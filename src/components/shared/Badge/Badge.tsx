import type { BadgeProps, BadgeVariant } from "./Badge.types";

const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  children,
  className = "",
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    // Status badges (lowercase for backward compatibility)
    new: "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]",
    NEW: "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]",
    resolved: "bg-[#E3F2FD] text-[#1976D2] border-[#90CAF9]",
    RESOLVED: "bg-[#E3F2FD] text-[#1976D2] border-[#90CAF9]",
    waiting: "bg-[#FFF3E0] text-[#F57C00] border-[#FFCC80]",
    in_progress: "bg-[#FFF3E0] text-[#F57C00] border-[#FFCC80]",
    IN_PROGRESS: "bg-[#FFF3E0] text-[#F57C00] border-[#FFCC80]",
    closed: "bg-[#E0E0E0] text-[#424242] border-[#BDBDBD]",
    CLOSED: "bg-[#E0E0E0] text-[#424242] border-[#BDBDBD]",

    // Category badges
    bug: "bg-[#FFEBEE] text-[#C62828] border-[#EF9A9A]",
    BUG: "bg-[#FFEBEE] text-[#C62828] border-[#EF9A9A]",
    feature: "bg-[#F3E5F5] text-[#7B1FA2] border-[#CE93D8]",
    FEATURE: "bg-[#F3E5F5] text-[#7B1FA2] border-[#CE93D8]",
    support: "bg-[#E0F7FA] text-[#00838F] border-[#80DEEA]",
    SUPPORT: "bg-[#E0F7FA] text-[#00838F] border-[#80DEEA]",
    problem: "bg-[#FFEBEE] text-[#C62828] border-[#EF9A9A]",
    PROBLEM: "bg-[#FFEBEE] text-[#C62828] border-[#EF9A9A]",

    // Priority badges
    high: "bg-[#FFEBEE] text-[#C62828] border-[#EF9A9A]",
    HIGH: "bg-[#FFEBEE] text-[#C62828] border-[#EF9A9A]",
    medium: "bg-[#FFF3E0] text-[#F57C00] border-[#FFCC80]",
    MEDIUM: "bg-[#FFF3E0] text-[#F57C00] border-[#FFCC80]",
    low: "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]",
    LOW: "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]",
    urgent: "bg-[#D32F2F] text-white border-[#C62828]",
    URGENT: "bg-[#D32F2F] text-white border-[#C62828]",

    default: "bg-[#F5F7FA] text-gray border-[#E1E4EA]",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium
                  border transition-all duration-150
                  ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
