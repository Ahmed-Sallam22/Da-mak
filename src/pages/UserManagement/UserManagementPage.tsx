import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/shared/PageHeader/PageHeader";
import SearchBar from "../../components/shared/SearchBar/SearchBar";
import Table from "../../components/shared/Table/Table";
import Pagination from "../../components/shared/Pagination/Pagination";
import Badge from "../../components/shared/Badge/Badge";
import SearchableSelect from "../../components/shared/SearchableSelect/SearchableSelect";
import type { TableColumn } from "../../components/shared/Table/Table.types";
import type { SortDirection } from "../../components/shared/Table/Table.types";
import type { SelectOption } from "../../components/shared/SearchableSelect/SearchableSelect.types";
import { usePageTitle } from "../../hooks/usePageTitle";

interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  phone: string;
  status: "active" | "inactive";
}

const UserManagementPage: React.FC = () => {
  usePageTitle("إدارة المستخدمين");
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data - memoized to prevent recreation
  const mockUsers: User[] = useMemo(
    () => [
      {
        id: 1,
        username: "mohamed_tarek1",
        fullName: "Mohamed Tarek",
        email: "mail@company.com",
        role: "Admin",
        phone: "+201023456789",
        status: "active",
      },
      {
        id: 2,
        username: "youssef_mohamed2",
        fullName: "Youssef Mohamed",
        email: "mail@company.com",
        role: "Client",
        phone: "+201023456789",
        status: "active",
      },
      {
        id: 3,
        username: "karem_ahmed55",
        fullName: "Karem Ahmed",
        email: "mail@company.com",
        role: "Developer",
        phone: "+201023456789",
        status: "active",
      },
      {
        id: 4,
        username: "ahmed_ali22",
        fullName: "Ahmed Ali",
        email: "ahmed@company.com",
        role: "Client",
        phone: "+201023456788",
        status: "inactive",
      },
      {
        id: 5,
        username: "sara_hassan33",
        fullName: "Sara Hassan",
        email: "sara@company.com",
        role: "Developer",
        phone: "+201023456787",
        status: "active",
      },
    ],
    []
  );

  const handleSort = (columnKey: string, direction: SortDirection) => {
    setSortKey(columnKey);
    setSortDirection(direction);
  };

  const filteredUsers = useMemo(() => {
    let filtered = mockUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortKey && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = (a as unknown as Record<string, unknown>)[sortKey];
        const bValue = (b as unknown as Record<string, unknown>)[sortKey];
        const comparison =
          String(aValue).toLowerCase() < String(bValue).toLowerCase() ? -1 : 1;
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [searchQuery, sortKey, sortDirection, mockUsers]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const columns: TableColumn<User>[] = [
    {
      key: "username",
      header: t("userManagement.username"),
      sortable: true,
      resizable: true,
      minWidth: 150,
      tooltip: "Username",
      render: (_value, user) => (
        <span className="text-dark font-medium">{user.username}</span>
      ),
    },
    {
      key: "fullName",
      header: t("userManagement.fullName"),
      sortable: true,
      resizable: true,
      minWidth: 180,
      tooltip: "Full Name",
      render: (_value, user) => (
        <span className="text-dark">{user.fullName}</span>
      ),
    },
    {
      key: "email",
      header: t("userManagement.email"),
      sortable: true,
      resizable: true,
      minWidth: 200,
      tooltip: "Email Address",
      render: (_value, user) => <span className="text-gray">{user.email}</span>,
    },
    {
      key: "role",
      header: t("userManagement.roles"),
      sortable: true,
      resizable: true,
      minWidth: 120,
      tooltip: "User Role",
      render: (_value, user) => <span className="text-dark">{user.role}</span>,
    },
    {
      key: "phone",
      header: t("userManagement.phone"),
      sortable: true,
      resizable: true,
      minWidth: 150,
      tooltip: "Phone Number",
      render: (_value, user) => <span className="text-gray">{user.phone}</span>,
    },
    {
      key: "status",
      header: t("userManagement.status"),
      sortable: true,
      resizable: true,
      minWidth: 120,
      tooltip: "User Status",
      render: (_value, user) => (
        <Badge variant={user.status === "active" ? "resolved" : "waiting"}>
          {user.status === "active"
            ? t("userManagement.active")
            : t("userManagement.inactive")}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      resizable: false,
      minWidth: 60,
      render: () => (
        <button className="text-gray hover:text-dark transition-colors">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.8624 3.13672L15.0666 1.34089C14.5541 0.82839 13.7291 0.82839 13.2166 1.34089L11.9249 2.63255L15.5708 6.27839L16.8624 4.98672C17.3749 4.47422 17.3749 3.64922 16.8624 3.13672ZM10.8583 3.69922L2.08325 12.4743V16.1201H5.72909L14.5041 7.34505L10.8583 3.69922Z"
              fill="currentColor"
            />
          </svg>
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-6">
      <div className="max-w-350 mx-auto ">
        <PageHeader
          title={t("userManagement.title")}
          buttonText={t("userManagement.createButton")}
          onButtonClick={() => setShowCreateModal(true)}
        />

        <div className="bg-white rounded-lg shadow-sm border border-[#E1E4EA] overflow-hidden">
          <div >
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t("userManagement.searchPlaceholder")}
            />
          </div>

          <Table
            columns={columns}
            data={currentUsers}
            sortable={true}
            resizable={true}
            onSort={handleSort}
          />

          <div  className="p-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={itemsPerPage}
              onPageSizeChange={setItemsPerPage}
              totalItems={filteredUsers.length}
            />
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateUserModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

const CreateUserModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  // Role options
  const roleOptions: SelectOption[] = [
    { value: "admin", label: "Admin" },
    { value: "client", label: "Client" },
    { value: "developer", label: "Developer" },
    { value: "manager", label: "Manager" },
    { value: "support", label: "Support" },
  ];

  // Department options
  const departmentOptions: SelectOption[] = [
    { value: "it", label: "IT" },
    { value: "hr", label: "HR" },
    { value: "sales", label: "Sales" },
    { value: "marketing", label: "Marketing" },
    { value: "finance", label: "Finance" },
    { value: "operations", label: "Operations" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-164 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-[#E1E4EA] flex items-center justify-between">
          <h2 className="text-xl font-semibold text-dark">
            {t("userManagement.createNewUser")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray hover:text-dark transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-label mb-2">
              {t("userManagement.username")}
            </label>
            <input
              type="text"
              placeholder={t("userManagement.enterUsername")}
              className="w-full px-4 py-2.5 border border-[#E1E4EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-dark placeholder:text-placeholder"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-label mb-2">
              {t("userManagement.email")}
            </label>
            <input
              type="email"
              placeholder={t("userManagement.enterEmail")}
              className="w-full px-4 py-2.5 border border-[#E1E4EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-dark placeholder:text-placeholder"
            />
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-label mb-2">
                {t("userManagement.firstName")}
              </label>
              <input
                type="text"
                placeholder={t("userManagement.enterFirstName")}
                className="w-full px-4 py-2.5 border border-[#E1E4EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-dark placeholder:text-placeholder"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-label mb-2">
                {t("userManagement.lastName")}
              </label>
              <input
                type="text"
                placeholder={t("userManagement.enterLastName")}
                className="w-full px-4 py-2.5 border border-[#E1E4EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-dark placeholder:text-placeholder"
              />
            </div>
          </div>

          {/* Role & Department */}
          <div className="grid grid-cols-2 gap-4">
            <SearchableSelect
              label={t("userManagement.role")}
              placeholder={t("userManagement.selectRole")}
              options={roleOptions}
              value={selectedRole}
              onChange={setSelectedRole}
            />
            <SearchableSelect
              label={t("userManagement.department")}
              placeholder={t("userManagement.selectDepartment")}
              options={departmentOptions}
              value={selectedDepartment}
              onChange={setSelectedDepartment}
            />
          </div>

          {/* Phone Number & WhatsApp Number */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-label mb-2">
                {t("userManagement.phone")}
              </label>
              <input
                type="tel"
                placeholder={t("userManagement.phone")}
                className="w-full px-4 py-2.5 border border-[#E1E4EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-dark placeholder:text-placeholder"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-label mb-2">
                {t("userManagement.whatsapp")}
              </label>
              <input
                type="tel"
                placeholder={t("userManagement.whatsapp")}
                className="w-full px-4 py-2.5 border border-[#E1E4EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-dark placeholder:text-placeholder"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-label mb-2">
              {t("userManagement.password")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t("userManagement.enterPassword")}
                className="w-full px-4 py-2.5 pr-12 border border-[#E1E4EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-dark placeholder:text-placeholder"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray hover:text-dark transition-colors"
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 10C2.5 10 5 4.16667 10 4.16667C15 4.16667 17.5 10 17.5 10C17.5 10 15 15.8333 10 15.8333C5 15.8333 2.5 10 2.5 10Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.95 14.95C13.5255 16.0358 11.7909 16.6374 10 16.6667C5 16.6667 2.5 10.8333 2.5 10.8333C3.43564 8.99177 4.72973 7.34881 6.3 6L14.95 14.95Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.25 4.53333C8.82365 4.37748 9.41092 4.29874 10 4.3C15 4.3 17.5 10.1333 17.5 10.1333C17.0122 11.0709 16.4022 11.9456 15.6833 12.7333L8.25 4.53333Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2.5 2.5L17.5 17.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-label mb-2">
              {t("userManagement.confirmPassword")}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("userManagement.confirmPassword")}
                className="w-full px-4 py-2.5 pr-12 border border-[#E1E4EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-dark placeholder:text-placeholder"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray hover:text-dark transition-colors"
              >
                {showConfirmPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 10C2.5 10 5 4.16667 10 4.16667C15 4.16667 17.5 10 17.5 10C17.5 10 15 15.8333 10 15.8333C5 15.8333 2.5 10 2.5 10Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.95 14.95C13.5255 16.0358 11.7909 16.6374 10 16.6667C5 16.6667 2.5 10.8333 2.5 10.8333C3.43564 8.99177 4.72973 7.34881 6.3 6L14.95 14.95Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.25 4.53333C8.82365 4.37748 9.41092 4.29874 10 4.3C15 4.3 17.5 10.1333 17.5 10.1333C17.0122 11.0709 16.4022 11.9456 15.6833 12.7333L8.25 4.53333Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2.5 2.5L17.5 17.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Status Toggle */}
          <div className="bg-[#F8F9FC] rounded-lg p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-label">
              {t("userManagement.status")}
            </span>
            <button
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isActive ? "bg-[#22C55E]" : "bg-gray/30"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-[#E1E4EA] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-[#E1E4EA] rounded-lg text-gray hover:text-dark hover:border-gray transition-colors font-medium"
          >
            {t("userManagement.cancel")}
          </button>
          <button className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
            {t("userManagement.createUser")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
