export type TicketStatus =
  | 'new'
  | 'open'
  | 'in-progress'
  | 'waiting-approval'
  | 'closed'
  | 'rejected';

export type TicketPriority = 'high' | 'medium' | 'low';

export type TicketCategory = 'bug' | 'feature' | 'support';

export interface Ticket {
  id: string;
  title: string;
  projectName: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
}
