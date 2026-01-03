export interface Notification {
  id: number;
  ticket: number;
  ticket_title: string;
  subject: string;
  created_at: string;
  is_read: boolean;
  read_at: string | null;
}

export interface NotificationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
}

export interface MarkAsReadResponse {
  message: string;
  notification: Notification;
}

export interface UnreadCountResponse {
  unread_count: number;
}

export interface MarkAllAsReadResponse {
  message: string;
  count: number;
}
