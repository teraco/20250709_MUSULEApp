import { promises as fs } from 'fs'
import { join } from 'path'
import { WorkoutItem, WeeklyPlan, WorkoutStatus } from '../types/workout'
import { getWeekDates } from '../utils/date'
import { logger } from '../utils/logger'

export class PlanService {
  private dataDir: string

  constructor() {
    this.dataDir = join(process.cwd(), '..', 'data')
    this.ensureDataDir()
  }

  private async ensureDataDir() {
    try {
      await fs.access(this.dataDir)
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true })
      logger.info(`Created data directory: ${this.dataDir}`)
    }
  }

  private getFilePath(week: string): string {
    return join(this.dataDir, `${week}.json`)
  }

  async savePlan(week: string, items: WorkoutItem[]): Promise<void> {
    const { startDate, endDate } = getWeekDates(week)
    
    const plan: WeeklyPlan = {
      week,
      startDate,
      endDate,
      items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      const filePath = this.getFilePath(week)
      await fs.writeFile(filePath, JSON.stringify(plan, null, 2), 'utf8')
      logger.info(`Saved plan for week ${week}`)
    } catch (error) {
      logger.error(`Failed to save plan for week ${week}:`, error)
      throw new Error(`Failed to save plan: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getPlan(week: string): Promise<WeeklyPlan | null> {
    try {
      const filePath = this.getFilePath(week)
      const data = await fs.readFile(filePath, 'utf8')
      const plan = JSON.parse(data) as WeeklyPlan
      
      logger.info(`Retrieved plan for week ${week}`)
      return plan
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        logger.info(`No plan found for week ${week}`)
        return null
      }
      
      logger.error(`Failed to get plan for week ${week}:`, error)
      throw new Error(`Failed to get plan: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async updateItemStatus(week: string, itemId: string, status: WorkoutStatus): Promise<void> {
    const plan = await this.getPlan(week)
    
    if (!plan) {
      throw new Error(`No plan found for week ${week}`)
    }

    const itemIndex = plan.items.findIndex(item => item.id === itemId)
    if (itemIndex === -1) {
      throw new Error(`Item ${itemId} not found in plan for week ${week}`)
    }

    plan.items[itemIndex].status = status
    plan.updatedAt = new Date().toISOString()

    await this.savePlan(week, plan.items)
    logger.info(`Updated status for item ${itemId} in week ${week} to ${status}`)
  }

  async listAllPlans(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.dataDir)
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''))
        .sort()
    } catch (error) {
      logger.error('Failed to list plans:', error)
      throw new Error(`Failed to list plans: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async cleanupOldPlans(): Promise<void> {
    const plans = await this.listAllPlans()
    const currentDate = new Date()
    const oneYearAgo = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate())

    for (const week of plans) {
      const [year, weekNum] = week.split('-').map(Number)
      const weekDate = new Date(year, 0, 1 + (weekNum - 1) * 7)
      
      if (weekDate < oneYearAgo) {
        try {
          const filePath = this.getFilePath(week)
          await fs.unlink(filePath)
          logger.info(`Cleaned up old plan for week ${week}`)
        } catch (error) {
          logger.error(`Failed to cleanup plan for week ${week}:`, error)
        }
      }
    }
  }
}