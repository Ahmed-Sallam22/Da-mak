import type { PaginationProps } from "./Pagination.types";

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [6, 12, 24, 48],
  showPageSize = true,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4  px-2">
      {/* Page Numbers - Left Side */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E1E4EA]
                     hover:bg-[#F5F7FA] disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-200"
          aria-label="Previous page"
        >
          <svg
            className="w-5 h-5 text-[#6B7280]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`
              min-w-8 h-8 px-3 flex items-center justify-center rounded-full text-sm font-medium
              transition-all duration-200
              ${
                page === currentPage
                  ? "bg-primary text-white shadow-md scale-105"
                  : page === "..."
                  ? "cursor-default text-[#9CA3AF]"
                  : "border border-[#E1E4EA] text-[#374151] hover:bg-[#F9FAFB] hover:border-[#D1D5DB]"
              }
            `}
            aria-label={typeof page === "number" ? `Page ${page}` : undefined}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E1E4EA]
                     hover:bg-[#F5F7FA] disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-200"
          aria-label="Next page"
        >
          <svg
            className="w-5 h-5 text-[#6B7280]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Page Size & Items Info - Right Side */}
      {showPageSize && (
        <div className="flex items-center gap-3">
          {/* Total Items Display */}
          <span className="text-sm text-[#6B7280] font-medium">
            {startItem}-{endItem} من {totalItems}
          </span>

          {/* Page Size Selector with Dropdown */}
          <div className="flex items-center gap-2 border border-[#E1E4EA] rounded-lg px-3 py-2 bg-white">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="text-sm font-medium text-[#374151] bg-transparent focus:outline-none
                         cursor-pointer appearance-none pr-6"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <svg
              className="w-4 h-4 text-[#6B7280] pointer-events-none -ml-5"
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
            <span className="text-sm text-[#6B7280]">عرض</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pagination;
