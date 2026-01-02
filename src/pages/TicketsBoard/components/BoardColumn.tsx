import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { TicketCard } from './';
import type { Ticket, TicketStatus } from '../TicketsBoardPage';

interface BoardColumnProps {
  id: TicketStatus;
  title: string;
  tickets: Ticket[];
  count: number;
}

const BoardColumn: React.FC<BoardColumnProps> = ({ id, title, tickets, count }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-[#F5F7FA] rounded-lg transition-colors ${
        isOver ? "bg-primary/5 ring-2 ring-primary/20" : ""
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-dark">
            {title}
            <span className="ml-2 text-gray">{count}</span>
          </h3>
        </div>

        <div className="space-y-3 min-h-50">
          {tickets.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-gray">
              No Open Items.
            </div>
          ) : (
            tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardColumn;
