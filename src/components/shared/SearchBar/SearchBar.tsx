import type { SearchBarProps } from "./SearchBar.types";

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search by project name or title...",
  onViewChange,
  currentView = "grid",
  showViewToggle = true,
}) => {
  return (
    <div className="flex items-center gap-3 mt-3 w-[98%] mx-auto">
      {/* Search Input */}
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-gray"
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
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-[40%] pl-12 pr-20 py-3 bg-white border border-[#E1E4EA] rounded-xl
                     text-sm text-dark placeholder:text-placeholder
                     focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                     transition-all duration-150"
        />
        {/* Keyboard Shortcut Hint */}
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          <span className="text-xs text-gray bg-[#F5F7FA] px-2 py-1 rounded border border-[#E1E4EA]">
            ⌘ F
          </span>
        </div>
      </div>

      {/* View Toggle */}
      {showViewToggle && onViewChange && (
        <div className="flex items-center gap-1 bg-white border border-[#E1E4EA] rounded-xl p-1">
          <button
            onClick={() => onViewChange("list")}
            className={`p-2 rounded-lg transition-all duration-150 ${
              currentView === "list"
                ? "bg-[#F5F7FA] text-dark"
                : "text-gray hover:text-dark"
            }`}
            title="List View"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <button
            onClick={() => onViewChange("grid")}
            className={`p-2 rounded-lg transition-all duration-150 ${
              currentView === "grid"
                ? "bg-primary text-white"
                : "text-gray hover:text-dark"
            }`}
            title="Grid View"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
