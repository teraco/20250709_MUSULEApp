import { WeeklySummary, WorkoutItem } from '../types/workout'
import { getDayOfWeekJP } from '../utils/date'
import { PlanService } from './PlanService'
import { logger } from '../utils/logger'

export class SummaryService {
  private planService: PlanService

  constructor() {
    this.planService = new PlanService()
  }

  async getWeeklySummary(week: string): Promise<WeeklySummary> {
    const plan = await this.planService.getPlan(week)
    
    if (!plan) {
      throw new Error(`No plan found for week ${week}`)
    }

    const totalWorkouts = plan.items.length
    const completedWorkouts = plan.items.filter(item => item.status === 'done').length
    const missedWorkouts = plan.items.filter(item => item.status === 'missed').length
    const completionRate = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0

    const summary: WeeklySummary = {
      week,
      totalWorkouts,
      completedWorkouts,
      missedWorkouts,
      completionRate,
      items: plan.items,
      highlights: this.generateHighlights(plan.items),
      recommendations: this.generateRecommendations(plan.items),
    }

    logger.info(`Generated summary for week ${week}`)
    return summary
  }

  async getWeeklySummaryMarkdown(week: string): Promise<string> {
    const summary = await this.getWeeklySummary(week)
    
    const markdown = `# Week ${week} ワークアウト サマリー

## 概要
- **総ワークアウト数**: ${summary.totalWorkouts}
- **完了したワークアウト**: ${summary.completedWorkouts}
- **未完了のワークアウト**: ${summary.missedWorkouts}
- **完了率**: ${summary.completionRate.toFixed(1)}%

## ワークアウト詳細

${summary.items.map(item => this.formatWorkoutItemMarkdown(item)).join('\n')}

## ハイライト
${summary.highlights && summary.highlights.length > 0 
  ? summary.highlights.map(highlight => `- ${highlight}`).join('\n')
  : '- 特筆すべき点はありません'
}

## 推奨事項
${summary.recommendations && summary.recommendations.length > 0
  ? summary.recommendations.map(rec => `- ${rec}`).join('\n')
  : '- 現在の調子を維持してください'
}

---
*Generated on ${new Date().toLocaleDateString('ja-JP')}*`

    return markdown
  }

  private formatWorkoutItemMarkdown(item: WorkoutItem): string {
    const statusEmoji = {
      done: '✅',
      pending: '⏳',
      missed: '❌',
    }

    const typeEmoji = {
      run: '🏃',
      strength: '💪',
      other: '🏃',
    }

    const dayOfWeek = getDayOfWeekJP(new Date(item.date))
    
    return `### ${statusEmoji[item.status]} ${dayOfWeek}曜日 - ${item.detail}
- **タイプ**: ${typeEmoji[item.type]} ${item.type}
- **日付**: ${item.date}
- **ステータス**: ${item.status === 'done' ? '完了' : item.status === 'pending' ? '未実施' : 'スキップ'}
`
  }

  private generateHighlights(items: WorkoutItem[]): string[] {
    const highlights: string[] = []
    
    const completedItems = items.filter(item => item.status === 'done')
    const runItems = items.filter(item => item.type === 'run')
    const strengthItems = items.filter(item => item.type === 'strength')
    
    if (completedItems.length === items.length && items.length > 0) {
      highlights.push('🎉 全てのワークアウトを完了しました！')
    }
    
    if (completedItems.length >= items.length * 0.8) {
      highlights.push('💪 素晴らしい継続力です！')
    }
    
    if (runItems.length > 0 && runItems.every(item => item.status === 'done')) {
      highlights.push('🏃 ランニングのワークアウトを全て完了しました')
    }
    
    if (strengthItems.length > 0 && strengthItems.every(item => item.status === 'done')) {
      highlights.push('💪 筋力トレーニングのワークアウトを全て完了しました')
    }
    
    return highlights
  }

  private generateRecommendations(items: WorkoutItem[]): string[] {
    const recommendations: string[] = []
    
    const completedItems = items.filter(item => item.status === 'done')
    const missedItems = items.filter(item => item.status === 'missed')
    const pendingItems = items.filter(item => item.status === 'pending')
    
    if (missedItems.length > 0) {
      recommendations.push('未完了のワークアウトがあります。可能であれば次週に追加してみてください')
    }
    
    if (pendingItems.length > 0) {
      recommendations.push('まだ実施していないワークアウトがあります。週末に実施してみてください')
    }
    
    if (completedItems.length < items.length * 0.5) {
      recommendations.push('ワークアウトの頻度を調整して、より実現可能な計画を立ててみてください')
    }
    
    const runItems = items.filter(item => item.type === 'run')
    const strengthItems = items.filter(item => item.type === 'strength')
    
    if (runItems.length === 0) {
      recommendations.push('有酸素運動（ランニング）も含めてみてください')
    }
    
    if (strengthItems.length === 0) {
      recommendations.push('筋力トレーニングも含めてみてください')
    }
    
    if (recommendations.length === 0) {
      recommendations.push('素晴らしい週でした！この調子を維持してください')
    }
    
    return recommendations
  }
}