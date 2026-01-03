import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchTickets } from "../../store/slices/ticketSlice";
import api from "../../services/api";
import toast from "react-hot-toast";
import type { Ticket as ApiTicket } from "../../types/ticket";
import CreateTicketModal from "../MyTickets/components/CreateTicketModal";

export type TicketStatus =
  | "NEW"
  | "OPENED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED"
  | "REJECTED";

export type TicketPriority = "HIGH" | "MEDIUM" | "LOW" | "URGENT";

export type TicketCategory = "BUG" | "FEATURE" | "SUPPORT" | "PROBLEM";

export interface Ticket {
  id: number;
  title: string;
  projectName: string;
  status: TicketStatus;
  status_display?: string;
  priority: TicketPriority;
  category: TicketCategory;
  project_name_display?: string | null;
  organization_name?: string | null;
  assigned_to_names?: string[];
  created_by_name?: string;
}

const TicketsBoardPage: React.FC = () => {
  usePageTitle("لوحة التذاكر");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { tickets: apiTickets } = useAppSelector((state) => state.tickets);

  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [modalMode, setModalMode] = useState<
    "create" | "edit" | "assign" | "attachment"
  >("edit");

  // Comment modal for client approve/reject
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [pendingDragAction, setPendingDragAction] = useState<{
    ticketId: number;
    fromStatus: TicketStatus;
    toStatus: TicketStatus;
    endpoint: string;
  } | null>(null);
  const [comment, setComment] = useState("");

  // Local tickets state for optimistic updates
  const [localTickets, setLocalTickets] = useState<Ticket[]>([]);

  // Get user role
  const userRole = user?.role?.toUpperCase();
  const isDeveloper = userRole === "DEVELOPER";
  const isClient = userRole === "CLIENT";
  const isAdmin =
    userRole === "ADMIN" ||
    userRole === "SUPER_ADMIN" ||
    userRole === "SUPERADMIN";

  // Define columns based on role
  const getColumns = () => {
    const allColumns: { id: TicketStatus; title: string }[] = [
      { id: "NEW", title: "New" },
      { id: "OPENED", title: "Open" },
      { id: "IN_PROGRESS", title: "In Progress" },
      { id: "RESOLVED", title: "Waiting Approval" },
      { id: "CLOSED", title: "Closed" },
      { id: "REJECTED", title: "Rejected" },
    ];

    // Developer can only see from OPENED onwards
    if (isDeveloper) {
      return allColumns.filter((col) => col.id !== "NEW");
    }

    return allColumns;
  };

  const columns = getColumns();

  // Fetch tickets on mount
  useEffect(() => {
    dispatch(fetchTickets({}));
  }, [dispatch]);

  // Convert API tickets to board format with useMemo
  const apiFormattedTickets = useMemo(() => {
    if (apiTickets && apiTickets.length > 0) {
      return apiTickets.map((ticket: ApiTicket) => ({
        id: ticket.id,
        title: ticket.title,
        projectName:
          ticket.project_name || ticket.project_name_display || "No Project",
        status: ticket.status as TicketStatus,
        status_display: ticket.status_display,
        priority: ticket.priority as TicketPriority,
        category: ticket.category as TicketCategory,
        project_name_display: ticket.project_name_display,
        organization_name: ticket.organization_name,
        assigned_to_names: ticket.assigned_to_names,
        created_by_name: ticket.created_by_name,
      }));
    }
    return [];
  }, [apiTickets]);

  // Merge API tickets with local optimistic updates
  const tickets = useMemo(() => {
    if (localTickets.length === 0) {
      return apiFormattedTickets;
    }
    // For each local ticket, check if it exists in API tickets
    // If yes, keep local version (optimistic update still pending)
    // If API version is different, API wins (update completed)
    return localTickets.map((localTicket) => {
      const apiTicket = apiFormattedTickets.find(
        (t) => t.id === localTicket.id
      );
      // If API has this ticket and status matches local, use API (it's synced)
      // Otherwise keep local (optimistic update in progress)
      return apiTicket || localTicket;
    });
  }, [apiFormattedTickets, localTickets]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Check if drag is allowed based on role and status transition
  const isDragAllowed = (
    fromStatus: TicketStatus,
    toStatus: TicketStatus
  ): boolean => {
    // Developer: OPENED → IN_PROGRESS → RESOLVED
    if (isDeveloper) {
      if (fromStatus === "OPENED" && toStatus === "IN_PROGRESS") return true;
      if (fromStatus === "IN_PROGRESS" && toStatus === "RESOLVED") return true;
      return false;
    }

    // Admin/Super Admin: NEW → OPENED only
    if (isAdmin) {
      if (fromStatus === "NEW" && toStatus === "OPENED") return true;
      return false;
    }

    // Client: RESOLVED → CLOSED or REJECTED
    if (isClient) {
      if (
        fromStatus === "RESOLVED" &&
        (toStatus === "CLOSED" || toStatus === "REJECTED")
      )
        return true;
      return false;
    }

    return false;
  };

  // Get appropriate API endpoint based on transition
  const getApiEndpoint = (
    ticketId: number,
    fromStatus: TicketStatus,
    toStatus: TicketStatus
  ): string | null => {
    // Developer: OPENED → IN_PROGRESS (start_work)
    if (fromStatus === "OPENED" && toStatus === "IN_PROGRESS") {
      return `/tickets/${ticketId}/start_work/`;
    }

    // Developer: IN_PROGRESS → RESOLVED (finish_work)
    if (fromStatus === "IN_PROGRESS" && toStatus === "RESOLVED") {
      return `/tickets/${ticketId}/finish_work/`;
    }

    // Admin: NEW → OPENED (open_ticket)
    if (fromStatus === "NEW" && toStatus === "OPENED") {
      return `/tickets/${ticketId}/open_ticket/`;
    }

    // Client: RESOLVED → CLOSED (approve)
    if (fromStatus === "RESOLVED" && toStatus === "CLOSED") {
      return `/tickets/${ticketId}/approve/`;
    }

    // Client: RESOLVED → REJECTED (reject)
    if (fromStatus === "RESOLVED" && toStatus === "REJECTED") {
      return `/tickets/${ticketId}/reject/`;
    }

    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const ticket = tickets.find((t) => t.id === active.id);
    setActiveTicket(ticket || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTicket(null);

    if (!over) return;

    const ticketId = active.id as number;
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    const fromStatus = ticket.status;
    const toStatus = over.id as TicketStatus;

    // Check if same status
    if (fromStatus === toStatus) return;

    // Check if drag is allowed
    if (!isDragAllowed(fromStatus, toStatus)) {
      toast.error("You don't have permission to perform this action");
      // Refresh to revert unauthorized drag after a brief moment
      setTimeout(() => dispatch(fetchTickets({})), 100);
      return;
    }

    // Get API endpoint
    const endpoint = getApiEndpoint(ticketId, fromStatus, toStatus);
    if (!endpoint) {
      toast.error("Invalid status transition");
      // Refresh to revert invalid drag after a brief moment
      setTimeout(() => dispatch(fetchTickets({})), 100);
      return;
    }

    // If client is approving/rejecting, show comment modal
    if (isClient && (toStatus === "CLOSED" || toStatus === "REJECTED")) {
      setPendingDragAction({
        ticketId,
        fromStatus,
        toStatus,
        endpoint,
      });
      setShowCommentModal(true);

      // Immediately refresh to revert the visual drag
      // This keeps the card in "Waiting Approval" until user confirms
      dispatch(fetchTickets({}));
      return;
    }

    // OPTIMISTIC UPDATE: Immediately update local state
    setLocalTickets((prevTickets) =>
      prevTickets.map((t) =>
        t.id === ticketId ? { ...t, status: toStatus } : t
      )
    );

    // For other roles, proceed with API call
    // Card is already in new position (optimistic update)
    // Only revert if API call fails
    try {
      // Call API - card is already in new position visually
      await api.post(endpoint, {});

      // Success! Show toast and refresh to sync with server
      toast.success(
        `Ticket moved to ${toStatus.replace("_", " ").toLowerCase()}`
      );

      // Refresh to get the updated state from server (will sync localTickets)
      dispatch(fetchTickets({}));
    } catch (error) {
      console.error("Failed to update ticket status:", error);
      const axiosError = error as {
        response?: { data?: { detail?: string; message?: string } };
      };
      const errorMessage =
        axiosError?.response?.data?.detail ||
        axiosError?.response?.data?.message ||
        "Failed to update ticket status";
      toast.error(errorMessage);

      // REVERT OPTIMISTIC UPDATE: Restore original status
      setLocalTickets((prevTickets) =>
        prevTickets.map((t) =>
          t.id === ticketId ? { ...t, status: fromStatus } : t
        )
      );

      // Also refresh from server to ensure consistency
      dispatch(fetchTickets({}));
    }
  };
  const getTicketsByStatus = (status: TicketStatus) => {
    return tickets.filter((ticket) => ticket.status === status);
  };

  // Handle ticket click based on role
  const handleTicketClick = (ticketId: number) => {
    if (isDeveloper) {
      // Developer: Navigate to details page
      navigate(`/tickets/${ticketId}`);
    } else if (isAdmin) {
      // Admin: Open modal with assign and attachment tabs
      setSelectedTicketId(ticketId);
      setModalMode("assign");
      setShowModal(true);
    } else if (isClient) {
      // Client: Open modal with details and attachment tabs (edit mode)
      setSelectedTicketId(ticketId);
      setModalMode("edit");
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTicketId(null);
    // Refresh tickets after modal close
    dispatch(fetchTickets({}));
  };

  // Handle comment modal submit
  const handleCommentSubmit = async () => {
    if (!pendingDragAction) return;

    const { toStatus, endpoint } = pendingDragAction;

    // Validate: reject requires comment
    if (toStatus === "REJECTED" && !comment.trim()) {
      toast.error("Comment is required for rejection");
      return;
    }

    try {
      // Call API with optional comment
      const payload = comment.trim() ? { reason: comment.trim() } : {};
      await api.post(endpoint, payload);

      toast.success(
        `Ticket ${toStatus === "CLOSED" ? "approved" : "rejected"} successfully`
      );

      // Close modal and reset
      setShowCommentModal(false);
      setPendingDragAction(null);
      setComment("");

      // Refresh tickets
      dispatch(fetchTickets({}));
    } catch (error) {
      console.error("Failed to update ticket:", error);
      const axiosError = error as {
        response?: { data?: { detail?: string; message?: string } };
      };
      const errorMessage =
        axiosError?.response?.data?.detail ||
        axiosError?.response?.data?.message ||
        "Failed to update ticket";
      toast.error(errorMessage);
    }
  };

  // Handle comment modal close
  const handleCommentModalClose = () => {
    setShowCommentModal(false);
    setPendingDragAction(null);
    setComment("");
    // No need to refresh - already reverted when modal opened
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
                      onTicketClick={handleTicketClick}
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

        {/* Modal for ticket actions */}
        {showModal && selectedTicketId && (
          <CreateTicketModal
            isOpen={showModal}
            onClose={handleCloseModal}
            onSubmit={() => {
              // Modal handles API calls internally, just refresh on close
              dispatch(fetchTickets({}));
            }}
            mode={modalMode}
            ticketId={selectedTicketId}
          />
        )}

        {/* Comment Modal for Client Approve/Reject */}
        {showCommentModal && pendingDragAction && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-dark mb-4">
                {pendingDragAction.toStatus === "CLOSED"
                  ? "Approve Ticket"
                  : "Reject Ticket"}
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment{" "}
                  {pendingDragAction.toStatus === "REJECTED" && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    pendingDragAction.toStatus === "REJECTED"
                      ? "Please provide a reason for rejection..."
                      : "Optional: Add a comment..."
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCommentModalClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCommentSubmit}
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${
                    pendingDragAction.toStatus === "CLOSED"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {pendingDragAction.toStatus === "CLOSED"
                    ? "Approve"
                    : "Reject"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsBoardPage;
