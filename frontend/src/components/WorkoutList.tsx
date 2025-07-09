import { WorkoutItem } from '../types/workout'
import { CheckCircle, Clock, XCircle, Calendar, Activity } from 'lucide-react'
import { getDayOfWeekJP } from '../utils/date'

interface WorkoutListProps {
  items: WorkoutItem[]
  onStatusChange?: (itemId: string, newStatus: WorkoutItem['status']) => void
}

export function WorkoutList({ items, onStatusChange }: WorkoutListProps) {
  const getStatusIcon = (status: WorkoutItem['status']) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
      case 'missed':
        return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
    }
  }

  const getStatusText = (status: WorkoutItem['status']) => {
    switch (status) {
      case 'done':
        return '完了'
      case 'pending':
        return '未実施'
      case 'missed':
        return '未実施'
    }
  }

  const getTypeIcon = (type: WorkoutItem['type']) => {
    switch (type) {
      case 'run':
        return '🏃'
      case 'strength':
        return '💪'
      default:
        return '🏃'
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="space-y-2 mt-3">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
        <Activity className="w-4 h-4" />
        <span>ワークアウトプラン</span>
      </h4>
      
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="workout-item"
          >
            <div className="flex items-center space-x-3 flex-1">
              <div className="text-lg">{getTypeIcon(item.type)}</div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {getDayOfWeekJP(new Date(item.date))}曜日
                  </span>
                </div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {item.detail}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {getStatusIcon(item.status)}
              <span className={`text-sm font-medium ${
                item.status === 'done' ? 'workout-status-done' : 
                item.status === 'pending' ? 'workout-status-pending' : 
                'workout-status-missed'
              }`}>
                {getStatusText(item.status)}
              </span>
              
              {onStatusChange && (
                <select
                  value={item.status}
                  onChange={(e) => onStatusChange(item.id, e.target.value as WorkoutItem['status'])}
                  className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="pending">未実施</option>
                  <option value="done">完了</option>
                  <option value="missed">スキップ</option>
                </select>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}