import React, { useState, useEffect } from "react";
import Table from "../../components/shared/Table/Table";
import type { TableColumn } from "../../components/shared/Table/Table.types";
import Pagination from "../../components/shared/Pagination/Pagination";
import Badge from "../../components/shared/Badge/Badge";
import SearchBar from "../../components/shared/SearchBar/SearchBar";
import PageHeader from "../../components/shared/PageHeader/PageHeader";
import CreateOrganizationModal from "./components/CreateOrganizationModal";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";
import api from "../../services/api";
import toast from "react-hot-toast";

interface Organization {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
  use_default_sla: boolean;
  notify_on_opened: boolean;
  notify_on_resolved: boolean;
  notify_on_assigned: boolean;
  notify_on_in_progress: boolean;
  user_count: number;
  project_count: number;
  ticket_count: number;
  has_custom_sla: boolean;
  sla_type: string;
  created_at: string;
  updated_at: string;
}

interface OrganizationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Organization[];
}

const OrganizationsPage: React.FC = () => {
  usePageTitle("المؤسسات");
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch organizations from API
  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const response = await api.get<OrganizationsResponse>("/organizations/");
      setOrganizations(response.data.results);
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
      toast.error("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  // Load organizations on mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Handle toggle organization status
  const handleToggleStatus = async (orgId: number, isActive: boolean) => {
    try {
      const endpoint = isActive
        ? `/organizations/${orgId}/deactivate/`
        : `/organizations/${orgId}/activate/`;
      await api.post(endpoint);
      toast.success(
        isActive ? "Organization deactivated" : "Organization activated"
      );
      fetchOrganizations(); // Refresh list
    } catch (error) {
      console.error("Failed to toggle organization status:", error);
      toast.error("Failed to update organization status");
    }
  };

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      org.code.toLowerCase().includes(searchValue.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrganizations.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentOrganizations = filteredOrganizations.slice(
    startIndex,
    endIndex
  );

  const columns: TableColumn<Organization>[] = [
    {
      key: "name",
      header: "Organization Name",
      minWidth: 200,
      render: (_value, org) => (
        <span className="font-medium text-dark">{org.name}</span>
      ),
    },
    {
      key: "code",
      header: "Code",
      minWidth: 100,
      render: (_value, org) => <span className="text-gray">{org.code}</span>,
    },
    {
      key: "ticket_count",
      header: "Ticket Count",
      minWidth: 120,
      render: (_value, org) => (
        <span className="text-dark">{org.ticket_count}</span>
      ),
    },
    {
      key: "user_count",
      header: "User Count",
      minWidth: 120,
      render: (_value, org) => (
        <span className="text-dark">{org.user_count}</span>
      ),
    },
    {
      key: "sla_type",
      header: "SLA Type",
      minWidth: 150,
      render: (_value, org) => (
        <span className="text-dark capitalize">
          {org.sla_type === "none"
            ? "No SLA"
            : org.sla_type === "custom"
            ? "Custom SLA"
            : "Default SLA"}
        </span>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      minWidth: 150,
      render: (_value, org) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(org.id, org.is_active);
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              org.is_active ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                org.is_active ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <Badge variant={org.is_active ? "new" : "default"}>
            {org.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      minWidth: 80,
      render: (_value, org) => (
        <button
          onClick={() => navigate(`/organizations/${org.id}`)}
          className="p-2 text-gray hover:text-dark hover:bg-[#F5F7FA] rounded-lg transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
      ),
    },
  ];

  const handleCreateOrganization = async (data: {
    name: string;
    code: string;
    is_active: boolean;
    notify_on_opened: boolean;
    notify_on_assigned: boolean;
    notify_on_in_progress: boolean;
    notify_on_resolved: boolean;
  }) => {
    try {
      await api.post("/organizations/", data);
      toast.success("Organization created successfully");
      setIsModalOpen(false);
      fetchOrganizations(); // Refresh list
    } catch (error) {
      console.error("Failed to create organization:", error);
      const axiosError = error as {
        response?: { data?: { detail?: string; [key: string]: unknown } };
      };
      const errorMsg =
        axiosError?.response?.data?.detail ||
        JSON.stringify(axiosError?.response?.data) ||
        "Failed to create organization";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Organizations"
        buttonText="Add Organization"
        onButtonClick={() => setIsModalOpen(true)}
      />

      <div className="bg-white rounded-2xl border border-[#E1E4EA] overflow-hidden">
        {/* Search Bar */}
        <div>
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search organizations..."
            showViewToggle={false}
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table columns={columns} data={currentOrganizations} />
        )}

        {/* Pagination */}
        <div className="p-2 ">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredOrganizations.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[10, 20, 50]}
          />
        </div>
      </div>

      {/* Create Organization Modal */}
      <CreateOrganizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrganization}
      />
    </div>
  );
};

export default OrganizationsPage;
