export type TicketStatus = 'new' | 'resolved' | 'waiting';
export type TicketCategory = 'bug' | 'feature' | 'support';
export type TicketPriority = 'high' | 'medium' | 'low';

export interface Ticket {
  id: string;
  project: string;
  title: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
}
