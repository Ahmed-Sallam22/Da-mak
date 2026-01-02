export interface SelectOption {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  searchPlaceholder?: string;
  noResultsText?: string;
  className?: string;
}
