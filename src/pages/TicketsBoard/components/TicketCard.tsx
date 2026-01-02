import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Badge from "../../../components/shared/Badge/Badge";
import type { Ticket } from "../TicketsBoardPage";

interface TicketCardProps {
  ticket: Ticket;
  isDragging?: boolean;
}

const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  isDragging = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "high":
        return "high";
      case "medium":
        return "medium";
      case "low":
        return "low";
      default:
        return "medium";
    }
  };

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case "bug":
        return "bug";
      case "feature":
        return "feature";
      case "support":
        return "support";
      default:
        return "bug";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Open";
      default:
        return status;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg p-4 shadow-sm border border-[#E1E4EA] cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
        isDragging ? "rotate-2 shadow-lg" : ""
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center shrink-0">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
          >
            <path
              d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14.4c-3.5 0-6.4-2.9-6.4-6.4S4.5 1.6 8 1.6s6.4 2.9 6.4 6.4-2.9 6.4-6.4 6.4z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray mb-1">{ticket.projectName}</p>
          <h4 className="text-sm font-medium text-dark">{ticket.title}</h4>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray px-2 py-1 bg-[#F8F9FC] rounded">
          {getStatusText(ticket.status)}
        </span>
        <Badge variant={getPriorityVariant(ticket.priority)}>
          {ticket.priority}
        </Badge>
        <Badge variant={getCategoryVariant(ticket.category)}>
          {ticket.category.toUpperCase()}
        </Badge>
      </div>
    </div>
  );
};

export default TicketCard;
