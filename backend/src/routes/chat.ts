import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import { ChatService } from '../services/ChatService'
import { ChatMessage } from '../types/workout'

const router = Router()
const chatService = new ChatService()

// POST /api/chat - Send message to AI assistant
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { messages, week } = req.body

    // Validate request body
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Messages array is required',
      })
    }

    if (!week || typeof week !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Week is required',
      })
    }

    // Validate message format
    const lastMessage = messages[messages.length - 1] as ChatMessage
    if (!lastMessage || lastMessage.role !== 'user') {
      return res.status(400).json({
        success: false,
        error: 'Last message must be from user',
      })
    }

    try {
      const response = await chatService.sendMessage(messages, week)
      
      res.json({
        success: true,
        data: response,
      })
    } catch (error) {
      console.error('Chat service error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to process message',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }),
)

export { router as chatRouter }