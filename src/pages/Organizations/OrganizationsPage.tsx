import React, { useState } from "react";
import Table from "../../components/shared/Table/Table";
import type { TableColumn } from "../../components/shared/Table/Table.types";
import Pagination from "../../components/shared/Pagination/Pagination";
import Badge from "../../components/shared/Badge/Badge";
import SearchBar from "../../components/shared/SearchBar/SearchBar";
import PageHeader from "../../components/shared/PageHeader/PageHeader";
import CreateOrganizationModal from "./components/CreateOrganizationModal";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";

interface Organization {
  id: string;
  name: string;
  code: string;
  ticketCount: number;
  slaType: string;
  status: "Active" | "Inactive";
}

const OrganizationsPage: React.FC = () => {
  usePageTitle("المؤسسات");
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data
  const mockOrganizations: Organization[] = [
    {
      id: "1",
      name: "Acme Corp",
      code: "ACME",
      ticketCount: 45,
      slaType: "Default SLA",
      status: "Active",
    },
    {
      id: "2",
      name: "Global Tech",
      code: "GTECH",
      ticketCount: 128,
      slaType: "Custom SLA",
      status: "Active",
    },
    {
      id: "3",
      name: "Innovate Inc",
      code: "INNO",
      ticketCount: 67,
      slaType: "Default SLA",
      status: "Inactive",
    },
    {
      id: "4",
      name: "Data Systems",
      code: "DATA",
      ticketCount: 89,
      slaType: "Custom SLA",
      status: "Active",
    },
    {
      id: "5",
      name: "Cloud Services",
      code: "CLOUD",
      ticketCount: 34,
      slaType: "Default SLA",
      status: "Active",
    },
  ];

  const filteredOrganizations = mockOrganizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      org.code.toLowerCase().includes(searchValue.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrganizations.length / pageSize);

  const columns: TableColumn<Organization>[] = [
    {
      key: "name",
      header: "Organization Name",
      minWidth: 200,
    },
    {
      key: "code",
      header: "Code",
      minWidth: 100,
    },
    {
      key: "ticketCount",
      header: "Ticket Count",
      minWidth: 120,
    },
    {
      key: "slaType",
      header: "SLA Type",
      minWidth: 150,
    },
    {
      key: "status",
      header: "Status",
      minWidth: 100,
      render: (_value, org) => (
        <Badge variant={org.status === "Active" ? "new" : "default"}>
          {org.status}
        </Badge>
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

  const handleCreateOrganization = (data: {
    name: string;
    code: string;
    status: boolean;
    notifyOpened: boolean;
    notifyAssigned: boolean;
    notifyInProgress: boolean;
    notifyResolved: boolean;
  }) => {
    console.log("Create organization:", data);
    setIsModalOpen(false);
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
        <div >
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search organizations..."
            showViewToggle={false}
          />
        </div>

        {/* Table */}
        <Table columns={columns} data={filteredOrganizations} />

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
