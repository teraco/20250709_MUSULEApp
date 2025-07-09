import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import { PlanService } from '../services/PlanService'
import { PlanUpdateRequest } from '../types/workout'

const router = Router()
const planService = new PlanService()

// PUT /api/plan - Save workout plan
router.put(
  '/',
  asyncHandler(async (req, res) => {
    const { week, items } = req.body as PlanUpdateRequest

    // Validate request body
    if (!week || typeof week !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Week is required',
      })
    }

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: 'Items array is required',
      })
    }

    try {
      await planService.savePlan(week, items)
      
      res.status(204).send()
    } catch (error) {
      console.error('Plan service error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to save plan',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }),
)

// GET /api/plan/:week - Get workout plan for specific week
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
      const plan = await planService.getPlan(week)
      
      res.json({
        success: true,
        data: plan,
      })
    } catch (error) {
      console.error('Plan service error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to get plan',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }),
)

export { router as planRouter }