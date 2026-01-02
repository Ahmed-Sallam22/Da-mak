import type { ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface TableColumn<T = unknown> {
  key: string;
  header: string;
  render?: (value: unknown, row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
  resizable?: boolean;
  minWidth?: number;
  tooltip?: string;
}

export interface TableProps<T = unknown> {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  isLoading?: boolean;
  sortable?: boolean;
  resizable?: boolean;
  onSort?: (columnKey: string, direction: SortDirection) => void;
}
