import React from "react";

interface NotificationsDropdownProps {
  isOpen: boolean;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg 
                    border border-[#E1E4EA] animate-in fade-in zoom-in-95 
                    duration-100 origin-top-right max-h-128 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E1E4EA]">
        <h3 className="text-lg font-semibold text-dark">Notification</h3>
        <button
          className="text-sm text-primary hover:text-primary/80 font-medium
                         transition-colors duration-150"
        >
          Mark All as Read
        </button>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto flex-1">
        {/* Today Section */}
        <div className="px-4 py-2">
          <p className="text-xs font-medium text-gray uppercase tracking-wide">
            Today
          </p>
        </div>

        {/* Notification Item */}
        <div className="px-4 py-3 hover:bg-[#F5F7FA] transition-colors duration-150 cursor-pointer border-b border-[#E1E4EA]">
          <div className="flex gap-3">
            <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold text-dark">Lorem Ipsum</h4>
                <span className="text-xs text-gray whitespace-nowrap">
                  1m ago
                </span>
              </div>
              <p className="text-sm text-gray mt-1 line-clamp-2">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <button className="text-sm text-primary hover:text-primary/80 font-medium mt-2">
                Mark as Read
              </button>
            </div>
          </div>
        </div>

        {/* Another Notification Item */}
        <div className="px-4 py-3 hover:bg-[#F5F7FA] transition-colors duration-150 cursor-pointer border-b border-[#E1E4EA]">
          <div className="flex gap-3">
            <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold text-dark">Lorem Ipsum</h4>
                <span className="text-xs text-gray whitespace-nowrap">
                  1m ago
                </span>
              </div>
              <p className="text-sm text-gray mt-1 line-clamp-2">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <button className="text-sm text-primary hover:text-primary/80 font-medium mt-2">
                Mark as Read
              </button>
            </div>
          </div>
        </div>

        {/* Yesterday Section */}
        <div className="px-4 py-2 mt-2">
          <p className="text-xs font-medium text-gray uppercase tracking-wide">
            Yesterday
          </p>
        </div>

        {/* Yesterday Notifications */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="px-4 py-3 hover:bg-[#F5F7FA] transition-colors duration-150 cursor-pointer border-b border-[#E1E4EA]"
          >
            <div className="flex gap-3">
              <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
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
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-dark">
                    Lorem Ipsum
                  </h4>
                  <span className="text-xs text-gray whitespace-nowrap">
                    1m ago
                  </span>
                </div>
                <p className="text-sm text-gray mt-1 line-clamp-2">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
                <button className="text-sm text-primary hover:text-primary/80 font-medium mt-2">
                  Mark as Read
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsDropdown;
