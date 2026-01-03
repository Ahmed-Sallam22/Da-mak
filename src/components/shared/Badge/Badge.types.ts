export type BadgeVariant =
  // Status variants (both lowercase for backward compatibility and uppercase from API)
  | 'new'
  | 'NEW'
  | 'resolved'
  | 'RESOLVED'
  | 'waiting'
  | 'in_progress'
  | 'IN_PROGRESS'
  | 'closed'
  | 'CLOSED'
  // Category variants
  | 'bug'
  | 'BUG'
  | 'feature'
  | 'FEATURE'
  | 'support'
  | 'SUPPORT'
  | 'problem'
  | 'PROBLEM'
  // Priority variants
  | 'high'
  | 'HIGH'
  | 'medium'
  | 'MEDIUM'
  | 'low'
  | 'LOW'
  | 'urgent'
  | 'URGENT'
  | 'default';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}
