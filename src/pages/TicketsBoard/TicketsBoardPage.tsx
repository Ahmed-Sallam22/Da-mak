import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BoardColumn, TicketCard } from "./components";
import { usePageTitle } from "../../hooks/usePageTitle";

export type TicketStatus =
  | "new"
  | "open"
  | "in-progress"
  | "waiting-approval"
  | "closed"
  | "rejected";

export type TicketPriority = "high" | "medium" | "low";

export type TicketCategory = "bug" | "feature" | "support";

export interface Ticket {
  id: string;
  title: string;
  projectName: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
}

const TicketsBoardPage: React.FC = () => {
  usePageTitle("لوحة التذاكر");
  const { t } = useTranslation();
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "1",
      title: "Title Problem",
      projectName: "Project Name",
      status: "open",
      priority: "high",
      category: "bug",
    },
    {
      id: "2",
      title: "Title Problem",
      projectName: "Project Name",
      status: "open",
      priority: "high",
      category: "bug",
    },
    {
      id: "3",
      title: "Title Problem",
      projectName: "Project Name",
      status: "open",
      priority: "high",
      category: "bug",
    },
  ]);

  const columns: { id: TicketStatus; title: string }[] = [
    { id: "new", title: "New" },
    { id: "open", title: "Open" },
    { id: "in-progress", title: "in Progress" },
    { id: "waiting-approval", title: "Waiting Approval" },
    { id: "closed", title: "Closed" },
    { id: "rejected", title: "Rejected" },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const ticket = tickets.find((t) => t.id === active.id);
    setActiveTicket(ticket || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTicket(null);

    if (!over) return;

    const ticketId = active.id as string;
    const newStatus = over.id as TicketStatus;

    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
  };

  const getTicketsByStatus = (status: TicketStatus) => {
    return tickets.filter((ticket) => ticket.status === status);
  };

  return (
    <div className="min-h-screen  p-3">
      <div className="max-w-full mx-auto bg-white p-6 rounded-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-dark">
            {t("ticketsBoard.title")}
          </h1>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="overflow-x-auto">
            <div className="grid grid-cols-6 gap-4 min-w-450">
              {columns.map((column) => {
                const columnTickets = getTicketsByStatus(column.id);
                return (
                  <SortableContext
                    key={column.id}
                    id={column.id}
                    items={columnTickets.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <BoardColumn
                      id={column.id}
                      title={column.title}
                      tickets={columnTickets}
                      count={columnTickets.length}
                    />
                  </SortableContext>
                );
              })}
            </div>
          </div>

          <DragOverlay>
            {activeTicket ? (
              <TicketCard ticket={activeTicket} isDragging />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default TicketsBoardPage;
