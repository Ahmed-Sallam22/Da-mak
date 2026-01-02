import React from "react";

interface ToggleProps {
  /**
   * Current toggle state
   */
  value: boolean;
  /**
   * Callback when toggle is clicked
   */
  onChange: () => void;
  /**
   * Label text to display next to toggle
   */
  label?: string;
  /**
   * Color variant for active state
   * @default 'primary'
   */
  variant?: "primary" | "green";
  /**
   * Toggle size
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";
  /**
   * Whether to show the toggle in a bordered container
   * @default false
   */
  bordered?: boolean;
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  /**
   * Additional CSS classes for the container
   */
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  value,
  onChange,
  label,
  variant = "primary",
  size = "md",
  bordered = false,
  disabled = false,
  className = "",
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      toggle: "w-9 h-5",
      circle: "w-3 h-3",
      translateOn: "right-0.5",
      translateOff: "left-0.5",
    },
    md: {
      toggle: "w-12 h-6",
      circle: "w-4 h-4",
      translateOn: "right-1",
      translateOff: "left-1",
    },
    lg: {
      toggle: "w-14 h-7",
      circle: "w-5 h-5",
      translateOn: "right-1",
      translateOff: "left-1",
    },
  };

  // Variant colors with better contrast
  const variantColors = {
    primary: value ? "bg-primary" : "bg-[#E5E7EB]",
    green: value ? "bg-green-500" : "bg-[#E5E7EB]",
  };

  const config = sizeConfig[size];
  const colorClass = variantColors[variant];

  const toggleButton = (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex items-center ${
        config.toggle
      } rounded-full transition-all duration-200 ${colorClass} ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:opacity-90"
      }`}
      aria-checked={value}
      role="switch"
    >
      <span
        className={`absolute ${
          config.circle
        } bg-white rounded-full shadow-lg transition-all duration-200 top-1/2 -translate-y-1/2 ${
          value ? config.translateOn : config.translateOff
        }`}
      />
    </button>
  );

  // If no label, return just the toggle
  if (!label) {
    return toggleButton;
  }

  // With label - return in container
  const containerClass = bordered
    ? "flex items-center justify-between py-3 px-4 border border-[#E1E4EA] rounded-xl bg-white"
    : "flex items-center justify-between";

  return (
    <div className={`${containerClass} ${className}`}>
      <span
        className={`text-sm font-medium ${
          value ? "text-dark" : "text-gray"
        } transition-colors`}
      >
        {label}
      </span>
      {toggleButton}
    </div>
  );
};

export default Toggle;
