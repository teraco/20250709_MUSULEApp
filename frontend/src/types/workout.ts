export type WorkoutType = "run" | "strength" | "other";

export type WorkoutStatus = "pending" | "done" | "missed";

export interface WorkoutItem {
  id: string;           // "tue-run-5k"
  date: string;         // "2025-07-15" (ISO date)
  type: WorkoutType;
  detail: string;       // "5km easy pace"
  status: WorkoutStatus;
}

export interface WeeklyPlan {
  week: string;         // "2025-28" (ISO week)
  startDate: string;    // "2025-07-07" (ISO date)
  endDate: string;      // "2025-07-13" (ISO date)
  items: WorkoutItem[];
  createdAt: string;    // ISO timestamp
  updatedAt: string;    // ISO timestamp
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;    // ISO timestamp
  metadata?: {
    type?: "plan" | "checkin" | "summary";
    week?: string;
    parsedItems?: WorkoutItem[];
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PlanUpdateRequest {
  week: string;
  items: WorkoutItem[];
}

export interface StatusUpdateRequest {
  week: string;
  itemId: string;
  status: WorkoutStatus;
}

export interface WeeklySummary {
  week: string;
  totalWorkouts: number;
  completedWorkouts: number;
  missedWorkouts: number;
  completionRate: number;
  items: WorkoutItem[];
  highlights?: string[];
  recommendations?: string[];
}