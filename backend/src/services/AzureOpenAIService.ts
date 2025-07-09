import axios, { AxiosInstance } from 'axios'
import { ChatMessage, WorkoutItem } from '../types/workout'
import { generateWorkoutId } from '../utils/date'
import { logger } from '../utils/logger'

interface AzureOpenAIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface AzureOpenAIResponse {
  choices: {
    message: {
      role: string
      content: string
    }
  }[]
}

interface WorkoutParseResult {
  response: string
  parsedItems: WorkoutItem[]
}

export class AzureOpenAIService {
  private client: AxiosInstance
  private deploymentName: string
  private apiVersion: string

  constructor() {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT
    const apiKey = process.env.AZURE_OPENAI_API_KEY
    this.deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o-mini'
    this.apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-02-01'

    if (!endpoint || !apiKey) {
      throw new Error('Azure OpenAI credentials not configured')
    }

    this.client = axios.create({
      baseURL: `${endpoint}/openai/deployments/${this.deploymentName}`,
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })
  }

  async processWorkoutMessage(messages: ChatMessage[], week: string): Promise<WorkoutParseResult> {
    const systemPrompt = this.createSystemPrompt(week)
    const azureMessages = this.convertToAzureMessages(messages, systemPrompt)

    try {
      const response = await this.client.post(
        `/chat/completions?api-version=${this.apiVersion}`,
        {
          messages: azureMessages,
          max_tokens: 1000,
          temperature: 0.7,
          top_p: 0.95,
          frequency_penalty: 0,
          presence_penalty: 0,
        }
      )

      const assistantResponse = response.data.choices[0].message.content
      const parsedItems = this.parseWorkoutItems(assistantResponse, week)

      logger.info(`Azure OpenAI processed message for week ${week}`)
      return {
        response: assistantResponse,
        parsedItems,
      }
    } catch (error) {
      logger.error('Azure OpenAI API error:', error)
      throw new Error(`Failed to process message with Azure OpenAI: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private createSystemPrompt(week: string): string {
    return `あなたは親切なフィットネスアシスタントです。日本語で応答してください。
現在の週: ${week}
タイムゾーン: Asia/Tokyo

あなたの役割:
1. ユーザーのワークアウトプランを理解して構造化する
2. 励ましとモチベーションを提供する
3. 残りのワークアウトを思い出させる
4. 週次サマリーを生成する
5. 常にサポート的で親しみやすい口調で応答する

ワークアウトの種類:
- "run" (ランニング、ジョギング、有酸素運動)
- "strength" (筋力トレーニング、重量挙げ)
- "other" (その他のスポーツ、ヨガ、ストレッチなど)

ユーザーがワークアウトプランを述べた場合は、以下の形式で応答してください:

**応答例:**
「素晴らしいプランですね！今週は以下のワークアウトを計画しました：

- 火曜日: 5km ランニング
- 木曜日: ベンチプレス 3セット
- 土曜日: 3km ジョギング

頑張ってください！進捗を教えてくださいね。」

各ワークアウトアイテムは以下の形式で記述してください（この形式は表示されません）:
[WORKOUT_ITEM]
id: {曜日}-{type}-{詳細}
date: {YYYY-MM-DD}
type: {run|strength|other}
detail: {詳細説明}
status: pending
[/WORKOUT_ITEM]`
  }

  private convertToAzureMessages(messages: ChatMessage[], systemPrompt: string): AzureOpenAIMessage[] {
    const azureMessages: AzureOpenAIMessage[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
    ]

    // Add conversation history (limit to last 10 messages to avoid token limit)
    const recentMessages = messages.slice(-10)
    
    for (const message of recentMessages) {
      azureMessages.push({
        role: message.role,
        content: message.content,
      })
    }

    return azureMessages
  }

  private parseWorkoutItems(response: string, week: string): WorkoutItem[] {
    const items: WorkoutItem[] = []
    const workoutItemRegex = /\[WORKOUT_ITEM\](.*?)\[\/WORKOUT_ITEM\]/gs
    
    let match
    while ((match = workoutItemRegex.exec(response)) !== null) {
      const itemContent = match[1].trim()
      const lines = itemContent.split('\n').map(line => line.trim())
      
      const workoutItem: Partial<WorkoutItem> = {
        status: 'pending',
      }
      
      for (const line of lines) {
        const [key, ...valueParts] = line.split(':')
        const value = valueParts.join(':').trim()
        
        switch (key.trim()) {
          case 'id':
            workoutItem.id = value
            break
          case 'date':
            workoutItem.date = value
            break
          case 'type':
            if (['run', 'strength', 'other'].includes(value)) {
              workoutItem.type = value as WorkoutItem['type']
            }
            break
          case 'detail':
            workoutItem.detail = value
            break
        }
      }
      
      // Validate required fields
      if (workoutItem.id && workoutItem.date && workoutItem.type && workoutItem.detail) {
        items.push(workoutItem as WorkoutItem)
      } else {
        logger.warn('Invalid workout item parsed:', workoutItem)
      }
    }
    
    // Fallback: try to extract workout items from natural language
    if (items.length === 0) {
      const fallbackItems = this.extractWorkoutItemsFromText(response, week)
      items.push(...fallbackItems)
    }
    
    return items
  }

  private extractWorkoutItemsFromText(text: string, week: string): WorkoutItem[] {
    const items: WorkoutItem[] = []
    const lines = text.split('\n')
    
    for (const line of lines) {
      const trimmedLine = line.trim()
      
      // Look for patterns like "火曜日: 5km ランニング" or "- 火曜日: 5km ランニング"
      const dayPattern = /(月|火|水|木|金|土|日)曜日.*?[:：]\s*(.+)/
      const match = trimmedLine.match(dayPattern)
      
      if (match) {
        const dayOfWeek = match[1]
        const description = match[2].trim()
        
        // Determine workout type
        let type: WorkoutItem['type'] = 'other'
        if (description.includes('ランニング') || description.includes('ジョギング') || description.includes('走る')) {
          type = 'run'
        } else if (description.includes('筋トレ') || description.includes('筋力') || description.includes('トレーニング')) {
          type = 'strength'
        }
        
        // Generate a date (for now, use a placeholder)
        const date = this.getDayOfWeekDate(dayOfWeek, week)
        
        items.push({
          id: generateWorkoutId(date, type, description),
          date,
          type,
          detail: description,
          status: 'pending',
        })
      }
    }
    
    return items
  }

  private getDayOfWeekDate(dayOfWeek: string, week: string): string {
    // This is a simplified implementation
    // In a real app, you'd calculate the actual date based on the week
    const dayMap: { [key: string]: number } = {
      '月': 1, '火': 2, '水': 3, '木': 4, '金': 5, '土': 6, '日': 0
    }
    
    // For now, return a placeholder date
    // TODO: Implement proper date calculation based on week
    return '2025-07-08'
  }
}