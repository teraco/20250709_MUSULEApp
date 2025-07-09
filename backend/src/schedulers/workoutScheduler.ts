import cron from 'node-cron'
import { getCurrentWeek } from '../utils/date'
import { logger } from '../utils/logger'

export function startScheduler() {
  logger.info('Starting workout scheduler...')

  // Weekly planning prompt - Monday 07:00 (Asia/Tokyo)
  cron.schedule('0 7 * * 1', async () => {
    try {
      const currentWeek = getCurrentWeek()
      logger.info(`Weekly planning prompt for week ${currentWeek}`)
      
      // TODO: Send notification to user
      await sendPlanningPrompt(currentWeek)
      
    } catch (error) {
      logger.error('Error in weekly planning scheduler:', error)
    }
  }, {
    scheduled: true,
    timezone: 'Asia/Tokyo'
  })

  // Mid-week check-in - Friday 12:00 (Asia/Tokyo)
  cron.schedule('0 12 * * 5', async () => {
    try {
      const currentWeek = getCurrentWeek()
      logger.info(`Mid-week check-in for week ${currentWeek}`)
      
      // TODO: Send check-in notification
      await sendMidWeekCheckIn(currentWeek)
      
    } catch (error) {
      logger.error('Error in mid-week check-in scheduler:', error)
    }
  }, {
    scheduled: true,
    timezone: 'Asia/Tokyo'
  })

  // Weekly wrap-up - Sunday 18:00 (Asia/Tokyo)
  cron.schedule('0 18 * * 0', async () => {
    try {
      const currentWeek = getCurrentWeek()
      logger.info(`Weekly wrap-up for week ${currentWeek}`)
      
      // TODO: Send wrap-up notification
      await sendWeeklyWrapUp(currentWeek)
      
    } catch (error) {
      logger.error('Error in weekly wrap-up scheduler:', error)
    }
  }, {
    scheduled: true,
    timezone: 'Asia/Tokyo'
  })

  logger.info('Workout scheduler started successfully')
}

async function sendPlanningPrompt(week: string) {
  // TODO: Implement actual notification sending
  logger.info(`[NOTIFICATION] Planning prompt for week ${week}`)
  logger.info('Message: 今週のワークアウトプランを教えてください。どのような運動を予定していますか？')
}

async function sendMidWeekCheckIn(week: string) {
  // TODO: Implement actual notification sending
  // TODO: Get current plan and check progress
  logger.info(`[NOTIFICATION] Mid-week check-in for week ${week}`)
  logger.info('Message: 今週の進捗はいかがですか？残りのワークアウトを確認してみましょう。')
}

async function sendWeeklyWrapUp(week: string) {
  // TODO: Implement actual notification sending
  // TODO: Generate weekly summary
  logger.info(`[NOTIFICATION] Weekly wrap-up for week ${week}`)
  logger.info('Message: 今週のワークアウトの結果を共有してください。来週の計画も立てましょう。')
}

export { sendPlanningPrompt, sendMidWeekCheckIn, sendWeeklyWrapUp }