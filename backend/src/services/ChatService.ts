import { ChatMessage, WorkoutItem } from '../types/workout'
import { getCurrentWeek, generateWorkoutId } from '../utils/date'
import { logger } from '../utils/logger'
import { AzureOpenAIService } from './AzureOpenAIService'

export class ChatService {
  private azureOpenAIService: AzureOpenAIService | null = null

  constructor() {
    try {
      this.azureOpenAIService = new AzureOpenAIService()
      logger.info('Azure OpenAI service initialized')
    } catch (error) {
      logger.warn('Azure OpenAI service not available, falling back to mock responses:', error)
    }
  }

  async sendMessage(messages: ChatMessage[], week: string): Promise<ChatMessage> {
    const lastMessage = messages[messages.length - 1]
    
    if (!lastMessage || lastMessage.role !== 'user') {
      throw new Error('Invalid message format')
    }

    try {
      let response: ChatMessage
      
      if (this.azureOpenAIService) {
        // Use Azure OpenAI
        const result = await this.azureOpenAIService.processWorkoutMessage(messages, week)
        
        response = {
          id: Date.now().toString(),
          role: 'assistant',
          content: result.response,
          timestamp: new Date().toISOString(),
          metadata: {
            type: 'plan',
            week,
            parsedItems: result.parsedItems.length > 0 ? result.parsedItems : undefined,
          },
        }
      } else {
        // Fallback to mock response
        response = this.generateMockResponse(lastMessage.content, week)
      }
      
      logger.info(`Processed chat message for week ${week}`)
      return response
    } catch (error) {
      logger.error('Chat service error:', error)
      throw new Error(`Failed to process message: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private generateMockResponse(userMessage: string, week: string): ChatMessage {
    const content = userMessage.toLowerCase()
    
    // Mock workout plan parsing
    let parsedItems: WorkoutItem[] = []
    let responseText = ''

    if (content.includes('ランニング') || content.includes('走る') || content.includes('run')) {
      parsedItems.push({
        id: generateWorkoutId('2025-07-08', 'run', '5km'),
        date: '2025-07-08',
        type: 'run',
        detail: '5km ランニング',
        status: 'pending',
      })
      responseText = '5kmランニングを計画に追加しました！'
    } else if (content.includes('筋トレ') || content.includes('筋力') || content.includes('strength')) {
      parsedItems.push({
        id: generateWorkoutId('2025-07-09', 'strength', 'bench press'),
        date: '2025-07-09',
        type: 'strength',
        detail: 'ベンチプレス 3セット',
        status: 'pending',
      })
      responseText = 'ベンチプレスを計画に追加しました！'
    } else if (content.includes('今週') || content.includes('計画') || content.includes('プラン')) {
      responseText = '今週のワークアウトプランを教えてください。例：\n\n- 火曜日に5kmランニング\n- 木曜日に筋トレ（ベンチプレス）\n- 土曜日に3kmジョギング\n\nのように具体的に教えてください！'
    } else {
      responseText = 'ワークアウトの内容を具体的に教えてください。ランニングや筋トレなど、どのような運動を予定していますか？'
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: responseText,
      timestamp: new Date().toISOString(),
      metadata: {
        type: 'plan',
        week,
        parsedItems: parsedItems.length > 0 ? parsedItems : undefined,
      },
    }
  }

  // This method will be used for Azure OpenAI integration
  private async callAzureOpenAI(messages: ChatMessage[], week: string): Promise<ChatMessage> {
    // TODO: Implement Azure OpenAI API call
    // This is a placeholder for the actual implementation
    
    throw new Error('Azure OpenAI integration not implemented yet')
  }
}