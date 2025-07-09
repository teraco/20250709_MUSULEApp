import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import { PlanService } from '../services/PlanService'
import { StatusUpdateRequest } from '../types/workout'

const router = Router()
const planService = new PlanService()

// PATCH /api/status - Update workout item status
router.patch(
  '/',
  asyncHandler(async (req, res) => {
    const { week, itemId, status } = req.body as StatusUpdateRequest

    // Validate request body
    if (!week || typeof week !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Week is required',
      })
    }

    if (!itemId || typeof itemId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Item ID is required',
      })
    }

    if (!status || !['pending', 'done', 'missed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Valid status is required (pending, done, missed)',
      })
    }

    try {
      await planService.updateItemStatus(week, itemId, status)
      
      res.json({
        success: true,
        message: 'Status updated successfully',
      })
    } catch (error) {
      console.error('Status update error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to update status',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }),
)

export { router as statusRouter }