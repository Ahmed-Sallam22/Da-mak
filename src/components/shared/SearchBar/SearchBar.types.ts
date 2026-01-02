export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onViewChange?: (view: 'list' | 'grid') => void;
  currentView?: 'list' | 'grid';
  showViewToggle?: boolean;
}
