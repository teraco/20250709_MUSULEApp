import { Bot } from 'lucide-react'

export function LoadingIndicator() {
  return (
    <div className="chat-message items-start flex space-x-2">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
      </div>
      
      <div className="chat-bubble chat-bubble-assistant">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">考えています...</span>
        </div>
      </div>
    </div>
  )
}