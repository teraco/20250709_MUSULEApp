import { useEffect, useRef } from 'react'
import { ChatMessage } from '../types/workout'
import { ChatBubble } from './ChatBubble'
import { LoadingIndicator } from './LoadingIndicator'

interface ChatWindowProps {
  messages: ChatMessage[]
  isLoading: boolean
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <ChatBubble key={message.id} message={message} />
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <LoadingIndicator />
        </div>
      )}
      
      <div ref={bottomRef} />
    </div>
  )
}