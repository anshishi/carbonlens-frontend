const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface Activity {
  id: number;
  user_id: number;
  category: 'transport' | 'food' | 'energy' | 'waste';
  subtype: string;
  value: number;
  co2_kg: number;
  date: string;
  created_at: string;
}

export interface DashboardSummary {
  today_total_co2: number;
  this_week_total_co2: number;
  category_breakdown: {
    transport: number;
    food: number;
    energy: number;
    waste: number;
  };
  trend_vs_last_week: number;
}

export interface UserLeaderboardEntry {
  id: number;
  name: string;
  total_co2: number;
  streak_days: number;
  badges: string[];
  rank: number;
}

export interface TipsResponse {
  highest_emission_category: 'transport' | 'food' | 'energy' | 'waste' | null;
  tips: string[];
}

export interface StreakResponse {
  streak_days: number;
  badges: string[];
}

/**
 * Perform a health check query on the API.
 */
export async function fetchHealth(): Promise<{ status: string; timestamp: string }> {
  const res = await fetch(`${API_URL}/api/health`);
  if (!res.ok) throw new Error("Failed to fetch health check");
  return res.json();
}

/**
 * Log a new activity to the backend database.
 */
export async function logActivity(activity: {
  category: string;
  subtype: string;
  value: number;
  date?: string;
}): Promise<Activity> {
  const res = await fetch(`${API_URL}/api/activities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activity),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to log activity");
  }
  return res.json();
}

/**
 * Fetch activities for the current user.
 */
export async function fetchActivities(range?: '7days' | '30days'): Promise<Activity[]> {
  const url = range ? `${API_URL}/api/activities?range=${range}` : `${API_URL}/api/activities`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch activities");
  return res.json();
}

/**
 * Fetch the dashboard summary data.
 */
export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const res = await fetch(`${API_URL}/api/dashboard-summary`);
  if (!res.ok) throw new Error("Failed to fetch dashboard summary");
  return res.json();
}

/**
 * Fetch the complete user leaderboard.
 */
export async function fetchLeaderboard(): Promise<UserLeaderboardEntry[]> {
  const res = await fetch(`${API_URL}/api/leaderboard`);
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}

/**
 * Fetch personalized environmental tips.
 */
export async function fetchTips(): Promise<TipsResponse> {
  const res = await fetch(`${API_URL}/api/tips`);
  if (!res.ok) throw new Error("Failed to fetch tips");
  return res.json();
}

/**
 * Fetch streak and badges for the current user.
 */
export async function fetchStreak(): Promise<StreakResponse> {
  const res = await fetch(`${API_URL}/api/streak`);
  if (!res.ok) throw new Error("Failed to fetch streak information");
  return res.json();
}
