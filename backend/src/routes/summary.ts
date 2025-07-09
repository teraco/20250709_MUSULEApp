import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import { SummaryService } from '../services/SummaryService'

const router = Router()
const summaryService = new SummaryService()

// GET /api/summary/:week - Get weekly summary
router.get(
  '/:week',
  asyncHandler(async (req, res) => {
    const { week } = req.params

    if (!week) {
      return res.status(400).json({
        success: false,
        error: 'Week parameter is required',
      })
    }

    try {
      const summary = await summaryService.getWeeklySummary(week)
      
      res.json({
        success: true,
        data: summary,
      })
    } catch (error) {
      console.error('Summary service error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to get summary',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }),
)

// GET /api/summary/:week/markdown - Get weekly summary as markdown
router.get(
  '/:week/markdown',
  asyncHandler(async (req, res) => {
    const { week } = req.params

    if (!week) {
      return res.status(400).json({
        success: false,
        error: 'Week parameter is required',
      })
    }

    try {
      const markdown = await summaryService.getWeeklySummaryMarkdown(week)
      
      res.set('Content-Type', 'text/markdown')
      res.send(markdown)
    } catch (error) {
      console.error('Summary service error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to get summary',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }),
)

export { router as summaryRouter }