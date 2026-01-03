import React, { useState, useRef, useEffect } from "react";

export interface Option {
  id: string | number;
  name: string;
  email?: string;
  avatar?: string;
}

interface MultiSelectProps {
  options: Option[];
  value: Option[];
  onChange: (selected: Option[]) => void;
  placeholder?: string;
  label?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select users...",
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const filteredOptions = options.filter(
    (option) =>
      option.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleOption = (option: Option) => {
    const isSelected = value.some((item) => item.id === option.id);
    if (isSelected) {
      onChange(value.filter((item) => item.id !== option.id));
    } else {
      onChange([...value, option]);
    }
  };

  const removeSelected = (optionId: string | number) => {
    onChange(value.filter((item) => item.id !== optionId));
  };

  return (
    <div ref={dropdownRef} className="relative">
      {label && (
        <label className="block text-sm font-semibold text-dark mb-2">
          {label}
        </label>
      )}

      {/* Selected Items Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-12 px-4 py-2 bg-[#F5F7FA] border border-[#E1E4EA] rounded-xl text-dark text-sm cursor-pointer hover:border-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
      >
        {value.length === 0 ? (
          <span className="text-placeholder flex items-center h-8">
            {placeholder}
          </span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {value.map((item) => (
              <div
                key={item.id}
                className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                {item.avatar ? (
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-medium">{item.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelected(item.id);
                  }}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Dropdown Arrow */}
        <div className="absolute right-4 top-[65%] -translate-y-1/2 pointer-events-none">
          <svg
            className={`w-4 h-4 text-gray transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
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
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-100 w-full mt-2 bg-white border border-[#E1E4EA] rounded-xl shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-[#E1E4EA]">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 bg-[#F5F7FA] border border-[#E1E4EA] rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray"
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
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto z-40">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-gray text-sm">
                No users found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = value.some((item) => item.id === option.id);
                return (
                  <div
                    key={option.id}
                    onClick={() => handleToggleOption(option)}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-[#F5F7FA] cursor-pointer transition-colors ${
                      isSelected ? "bg-primary/5" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-primary border-primary"
                          : "border-[#E1E4EA]"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Avatar */}
                    {option.avatar ? (
                      <img
                        src={option.avatar}
                        alt={option.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                        {option.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark truncate">
                        {option.name}
                      </p>
                      {option.email && (
                        <p className="text-xs text-gray truncate">
                          {option.email}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
