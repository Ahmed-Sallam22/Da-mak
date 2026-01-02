export type BadgeVariant =
  | 'new'
  | 'resolved'
  | 'waiting'
  | 'bug'
  | 'feature'
  | 'support'
  | 'high'
  | 'medium'
  | 'low'
  | 'default';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}
