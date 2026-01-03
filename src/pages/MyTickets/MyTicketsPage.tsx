import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  PageHeader,
  SearchBar,
  Table,
  Pagination,
  Badge,
  TicketCard,
} from "../../components/shared";
import type { BadgeVariant } from "../../components/shared/Badge/Badge.types";
import CreateTicketModal from "./components/CreateTicketModal";
import type { TicketFormData } from "./components/CreateTicketModal";
import type { TableColumn } from "../../components/shared/Table/Table.types";
import type { SortDirection } from "../../components/shared/Table/Table.types";
import type { Ticket } from "../../types/ticket";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchTickets } from "../../store/slices/ticketSlice";

const MyTicketsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Set page title
  usePageTitle(t("myTickets.title"));

  // Redux state
  const { tickets, loading, count } = useAppSelector((state) => state.tickets);
  const { user } = useAppSelector((state) => state.auth);

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentView, setCurrentView] = useState<"list" | "grid">("list");
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<
    "create" | "edit" | "assign" | "attachment"
  >("create");
  const [selectedTicketId, setSelectedTicketId] = useState<
    number | undefined
  >();

  // Check if user is a client to show create button
  const isClient = user?.role?.toLowerCase() === "client";
  const isAdmin =
    user?.role?.toUpperCase() === "ADMIN" ||
    user?.role?.toUpperCase() === "SUPER_ADMIN" ||
    user?.role?.toUpperCase() === "SUPERADMIN";

  // Fetch tickets on component mount and when page/pageSize changes
  useEffect(() => {
    dispatch(fetchTickets({ page: currentPage, page_size: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  // Handle sorting
  const handleSort = (columnKey: string, direction: SortDirection) => {
    setSortKey(columnKey);
    setSortDirection(direction);
  };

  // Filter tickets based on search query (client-side filter on already fetched data)
  const filteredTickets = useMemo(() => {
    let filtered = tickets;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ticket: Ticket) =>
          ticket.project_name_display?.toLowerCase().includes(query) ||
          ticket.title.toLowerCase().includes(query) ||
          ticket.organization_name?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortKey && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = (a as unknown as Record<string, unknown>)[sortKey];
        const bValue = (b as unknown as Record<string, unknown>)[sortKey];

        if (aValue === bValue) return 0;

        const comparison = String(aValue) < String(bValue) ? -1 : 1;
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [tickets, searchQuery, sortKey, sortDirection]);

  // For display - use filtered tickets
  const paginatedTickets = filteredTickets;

  // Calculate total pages from API count
  const totalPages = Math.ceil(count / pageSize);

  // Reset to first page when search query or page size changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  // Handle ticket row click
  const handleTicketClick = (ticket: Ticket) => {
    navigate(`/tickets/${ticket.id}`);
  };

  // Handle create ticket button
  const handleCreateTicket = () => {
    setModalMode("create");
    setSelectedTicketId(undefined);
    setIsCreateModalOpen(true);
  };

  // Handle edit ticket (client only)
  const handleEditTicket = (ticketId: number) => {
    setModalMode("edit");
    setSelectedTicketId(ticketId);
    setIsCreateModalOpen(true);
  };

  // Handle assign ticket (admin/superadmin only)
  const handleAssignTicket = (ticketId: number) => {
    setModalMode("assign");
    setSelectedTicketId(ticketId);
    setIsCreateModalOpen(true);
  };

  // Handle attachment (all roles)
  const handleAttachment = (ticketId: number) => {
    setModalMode("attachment");
    setSelectedTicketId(ticketId);
    setIsCreateModalOpen(true);
  };

  // Handle create ticket submit
  const handleSubmitTicket = (data: TicketFormData) => {
    console.log("Ticket data:", data);
    console.log("Mode:", modalMode);
    console.log("Ticket ID:", selectedTicketId);
    // TODO: Add API call based on mode
    setIsCreateModalOpen(false);
  };

  // Define table columns
  const columns: TableColumn<Ticket>[] = [
    {
      key: "project_name_display",
      header: t("myTickets.table.project"),
      sortable: true,
      resizable: true,
      minWidth: 200,
      tooltip: "Project name",
      render: (_value, ticket) => (
        <span className="font-medium text-dark">
          {ticket.project_name_display || ticket.project_name || "-"}
        </span>
      ),
    },
    {
      key: "title",
      header: t("myTickets.table.title"),
      sortable: true,
      resizable: true,
      minWidth: 250,
      tooltip: "Ticket title and description",
      render: (_value, ticket) => (
        <span className="text-label">{ticket.title}</span>
      ),
    },
    {
      key: "category",
      header: t("myTickets.table.category"),
      sortable: true,
      resizable: true,
      minWidth: 150,
      tooltip: "Ticket category type",
      render: (_value, ticket) => (
        <Badge variant={ticket.category as BadgeVariant}>
          {ticket.category_display || ticket.category}
        </Badge>
      ),
    },
    {
      key: "priority",
      header: t("myTickets.table.priority"),
      sortable: true,
      resizable: true,
      minWidth: 130,
      tooltip: "Priority level",
      render: (_value, ticket) => (
        <Badge variant={ticket.priority as BadgeVariant}>
          {ticket.priority_display || ticket.priority}
        </Badge>
      ),
    },
    {
      key: "status",
      header: t("myTickets.table.status"),
      sortable: true,
      resizable: true,
      minWidth: 150,
      tooltip: "Current ticket status",
      render: (_value, ticket) => (
        <Badge variant={ticket.status as BadgeVariant}>
          {ticket.status_display || ticket.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      resizable: false,
      minWidth: 120,
      render: (_value, ticket) => (
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Edit Icon - Client only */}
          {isClient && (
            <button
              onClick={() => handleEditTicket(ticket.id)}
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Ticket"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}

          {/* Assign Icon - Admin/SuperAdmin only */}
          {isAdmin && (
            <button
              onClick={() => handleAssignTicket(ticket.id)}
              className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
              title="Assign Ticket"
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>
          )}

          {/* Attachment Icon - All roles */}
          <button
            onClick={() => handleAttachment(ticket.id)}
            className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
            title="Attachments"
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
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto">
        {/* Page Header - Only show create button for clients */}
        {isClient ? (
          <PageHeader
            title={t("myTickets.title")}
            buttonText={t("myTickets.createButton")}
            onButtonClick={handleCreateTicket}
          />
        ) : (
          <PageHeader title={t("myTickets.title")} />
        )}

        {/* Content */}
        <div className="bg-white rounded-xl overflow-hidden">
          {/* Search Bar with View Toggle */}
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={t("myTickets.searchPlaceholder")}
            currentView={currentView}
            onViewChange={setCurrentView}
          />

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray">{t("common.loading") || "Loading..."}</p>
            </div>
          )}

          {/* Grid View */}
          {!loading && currentView === "grid" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {paginatedTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onClick={() => handleTicketClick(ticket)}
                  />
                ))}
              </div>

              {/* Empty State for Grid */}
              {paginatedTickets.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray">
                    {searchQuery
                      ? t("myTickets.noResults")
                      : t("myTickets.noTickets")}
                  </p>
                </div>
              )}
            </>
          )}

          {/* List/Table View */}
          {!loading && currentView === "list" && (
            <Table<Ticket>
              data={paginatedTickets}
              columns={columns}
              onRowClick={handleTicketClick}
              sortable={true}
              resizable={true}
              onSort={handleSort}
              emptyMessage={
                searchQuery
                  ? t("myTickets.noResults")
                  : t("myTickets.noTickets")
              }
            />
          )}

          {/* Pagination */}
          {!loading && count > 0 && (
            <div className=" px-4 sm:px-6 py-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                totalItems={count}
              />
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSubmitTicket}
        mode={modalMode}
        ticketId={selectedTicketId}
      />
    </div>
  );
};

export default MyTicketsPage;
