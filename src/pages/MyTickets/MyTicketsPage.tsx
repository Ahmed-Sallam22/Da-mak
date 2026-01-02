import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  PageHeader,
  SearchBar,
  Table,
  Pagination,
  Badge,
} from "../../components/shared";
import type { TableColumn } from "../../components/shared/Table/Table.types";
import type { SortDirection } from "../../components/shared/Table/Table.types";
import type { Ticket } from "../../types/ticket";
import { mockTickets } from "../../data/mockTickets";
import { usePageTitle } from "../../hooks/usePageTitle";

const MyTicketsPage: React.FC = () => {
  const { t } = useTranslation();

  // Set page title
  usePageTitle(t("myTickets.title"));

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentView, setCurrentView] = useState<"list" | "grid">("grid");
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Handle sorting
  const handleSort = (columnKey: string, direction: SortDirection) => {
    setSortKey(columnKey);
    setSortDirection(direction);
  };

  // Filter tickets based on search query
  const filteredTickets = useMemo(() => {
    let filtered = mockTickets;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ticket) =>
          ticket.project.toLowerCase().includes(query) ||
          ticket.title.toLowerCase().includes(query)
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
  }, [searchQuery, sortKey, sortDirection]);

  // Paginate tickets
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredTickets.slice(startIndex, endIndex);
  }, [filteredTickets, currentPage, pageSize]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredTickets.length / pageSize);

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
    console.log("Ticket clicked:", ticket);
    // Navigate to ticket detail page (to be implemented)
    // navigate(`/tickets/${ticket.id}`);
  };

  // Handle create ticket button
  const handleCreateTicket = () => {
    console.log("Create ticket clicked");
    // Navigate to create ticket page (to be implemented)
    // navigate('/tickets/create');
  };

  // Define table columns
  const columns: TableColumn<Ticket>[] = [
    {
      key: "project",
      header: t("myTickets.table.project"),
      sortable: true,
      resizable: true,
      minWidth: 200,
      tooltip: "Project name",
      render: (_value, ticket) => (
        <span className="font-medium text-dark">{ticket.project}</span>
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
        <Badge variant={ticket.category}>
          {t(`myTickets.categories.${ticket.category}`)}
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
        <Badge variant={ticket.priority}>
          {t(`myTickets.priorities.${ticket.priority}`)}
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
        <Badge variant={ticket.status}>
          {t(`myTickets.statuses.${ticket.status}`)}
        </Badge>
      ),
    },
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto">
        {/* Page Header */}
        <PageHeader
          title={t("myTickets.title")}
          buttonText={t("myTickets.createButton")}
          onButtonClick={handleCreateTicket}
        />

        {/* Table */}
        <div className="bg-white rounded-xl  overflow-hidden">
          {/* Search Bar with View Toggle */}
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={t("myTickets.searchPlaceholder")}
            currentView={currentView}
            onViewChange={setCurrentView}
          />
          <Table<Ticket>
            data={paginatedTickets}
            columns={columns}
            onRowClick={handleTicketClick}
            sortable={true}
            resizable={true}
            onSort={handleSort}
            emptyMessage={
              searchQuery ? t("myTickets.noResults") : t("myTickets.noTickets")
            }
          />

          {/* Pagination */}
          {filteredTickets.length > 0 && (
            <div className=" px-4 sm:px-6 py-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                totalItems={filteredTickets.length}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTicketsPage;
