import type { ButtonProps } from "./Button.types";

const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  disabled,
  className = "",
  ...rest
}) => {
  const baseStyles = `
    font-medium rounded-xl transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary",
    secondary: "bg-gray text-white hover:bg-gray/90 focus:ring-gray",
    outline:
      "bg-transparent border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary",
  };

  const sizeStyles = {
    sm: "px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm",
    md: "px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base",
    lg: "px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg",
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        title
      )}
    </button>
  );
};

export default Button;
