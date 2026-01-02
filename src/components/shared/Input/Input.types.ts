import type { InputHTMLAttributes } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon?: React.ReactNode;
  onIconClick?: () => void;
}
