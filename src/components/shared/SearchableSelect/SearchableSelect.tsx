import { useState, useRef, useEffect } from "react";
import type { SearchableSelectProps } from "./SearchableSelect.types";

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  error,
  disabled = false,
  searchPlaceholder = "Search...",
  noResultsText = "No results found",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get selected option label
  const selectedOption = options.find((option) => option.value === value);
  const selectedLabel = selectedOption ? selectedOption.label : placeholder;

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchQuery("");
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-label mb-2">
          {label}
        </label>
      )}

      {/* Select Container */}
      <div ref={dropdownRef} className="relative">
        {/* Select Button */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={`w-full flex items-center justify-between px-4 py-3 
                      bg-white border rounded-xl text-sm
                      transition-all duration-150
                      ${
                        error
                          ? "border-red-500 focus:ring-red-500/20"
                          : "border-[#E1E4EA] focus:border-primary focus:ring-2 focus:ring-primary/20"
                      }
                      ${
                        disabled
                          ? "bg-[#F5F7FA] cursor-not-allowed opacity-60"
                          : "hover:border-primary"
                      }
                      ${isOpen ? "border-primary ring-2 ring-primary/20" : ""}
                      ${!selectedOption ? "text-placeholder" : "text-dark"}`}
        >
          <span className="truncate">{selectedLabel}</span>
          <svg
            className={`w-5 h-5 text-gray transition-transform duration-200 shrink-0 ml-2
                        ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-100 w-full mt-2 bg-white rounded-xl shadow-lg border border-[#E1E4EA] py-2 animate-in fade-in zoom-in-95 duration-100">
            {/* Search Input */}
            <div className="px-3 pb-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={searchPlaceholder}
                  className="w-full pl-10 pr-3 py-2 bg-[#F5F7FA] border border-[#E1E4EA] rounded-lg
                             text-sm text-dark placeholder:text-placeholder
                             focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                             transition-all duration-150"
                />
              </div>
            </div>

            {/* Options List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors duration-150
                                flex items-center justify-between
                                ${
                                  option.value === value
                                    ? "bg-primary/5 text-primary font-medium"
                                    : "text-dark hover:bg-[#F5F7FA]"
                                }`}
                  >
                    <span>{option.label}</span>
                    {option.value === value && (
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm text-gray">
                  {noResultsText}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default SearchableSelect;
