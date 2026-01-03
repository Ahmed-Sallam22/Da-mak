import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { TicketCard } from "./";
import type { Ticket, TicketStatus } from "../TicketsBoardPage";

interface BoardColumnProps {
  id: TicketStatus;
  title: string;
  tickets: Ticket[];
  count: number;
  onTicketClick?: (ticketId: number) => void;
}

const BoardColumn: React.FC<BoardColumnProps> = ({
  id,
  title,
  tickets,
  count,
  onTicketClick,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-[#F5F7FA] rounded-lg transition-colors flex flex-col h-full ${
        isOver ? "bg-primary/5 ring-2 ring-primary/20" : ""
      }`}
    >
      <div className="p-4 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-dark">
            {title}
            <span className="ml-2 text-gray">{count}</span>
          </h3>
        </div>
      </div>

      {/* Scrollable tickets area */}
      <div
        className="flex-1 overflow-y-auto px-4 pb-4 space-y-3"
        style={{ maxHeight: "calc(100vh - 250px)" }}
      >
        {tickets.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-gray">
            No Open Items.
          </div>
        ) : (
          tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onTicketClick={onTicketClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BoardColumn;
