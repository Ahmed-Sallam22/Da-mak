import type { PageHeaderProps } from "./PageHeader.types";

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  buttonText,
  onButtonClick,
  showButton = true,
}) => {
  return (
    <div className="flex items-center justify-between mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark">
        {title}
      </h1>
      {showButton && buttonText && (
        <button
          onClick={onButtonClick}
          className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 
                     bg-primary text-white rounded-xl font-medium text-sm sm:text-base
                     hover:bg-primary/90 transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="hidden sm:inline">{buttonText}</span>
          <span className="sm:hidden">Add</span>
        </button>
      )}
    </div>
  );
};

export default PageHeader;
