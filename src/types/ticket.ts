export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TicketCategory = "BUG" | "FEATURE" | "SUPPORT" | "PROBLEM";
export type TicketStatus = "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface Ticket {
  id: number;
  organization: number | null;
  organization_name: string | null;
  project: number | null;
  project_name_display: string | null;
  project_name: string;
  title: string;
  description: string;
  priority: TicketPriority;
  priority_display: string;
  category: TicketCategory;
  category_display: string;
  status: TicketStatus;
  status_display: string;
  created_by: number;
  created_by_name: string;
  assigned_to: number[];
  assigned_to_names: string[];
  assigned_team: number | null;
  created_at: string;
  updated_at: string;
}

export interface TicketsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Ticket[];
}

export interface TicketAttachment {
  id: number;
  ticket: number;
  file_data: string; // base64 encoded file data
  file_name?: string;
  file_size?: number;
  uploaded_at?: string;
  uploaded_by?: number;
  uploaded_by_name?: string;
}

export interface TicketHistory {
  id: number;
  ticket: number;
  changed_by: number;
  changed_by_name: string;
  status_from: TicketStatus;
  status_from_display: string;
  status_to: TicketStatus;
  status_to_display: string;
  comment: string;
  timestamp: string;
}

export interface TicketDetails extends Ticket {
  resolution_due_at: string | null;
  estimated_resolution_time: number | null;
  attachments: TicketAttachment[];
  history: TicketHistory[];
  assigned_team_name: string | null;
  resolved_at: string | null;
  closed_at: string | null;
}
