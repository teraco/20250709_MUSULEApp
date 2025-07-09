import { useState, KeyboardEvent } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-end space-x-2">
      <div className="flex-1">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="今週のワークアウトプランを入力してください..."
          className="input resize-none"
          rows={1}
          disabled={disabled}
          style={{
            minHeight: '2.5rem',
            maxHeight: '8rem',
            resize: 'none',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement
            target.style.height = 'auto'
            target.style.height = target.scrollHeight + 'px'
          }}
        />
      </div>
      
      <button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="btn btn-primary p-2 flex items-center justify-center"
        aria-label="メッセージを送信"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  )
}