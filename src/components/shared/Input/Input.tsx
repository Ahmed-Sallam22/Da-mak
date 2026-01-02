import type { InputProps } from "./Input.types";

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon,
  onIconClick,
  ...rest
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-label mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full px-3 sm:px-4 py-2.5 sm:py-3 
            bg-[#F5F7FA] 
            border border-[#E1E4EA] 
            rounded-xl
            text-dark text-sm
            placeholder:text-placeholder placeholder:text-xs sm:placeholder:text-sm
            focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
            transition-all duration-200
            ${icon ? "pr-10 sm:pr-12" : ""}
            ${error ? "border-red-500" : ""}
          `}
          {...rest}
        />
        {icon && (
          <button
            type="button"
            onClick={onIconClick}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray hover:text-dark transition-colors"
          >
            {icon}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
