import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/shared/PageHeader/PageHeader";
import SearchBar from "../../components/shared/SearchBar/SearchBar";
import Table from "../../components/shared/Table/Table";
import Pagination from "../../components/shared/Pagination/Pagination";
import Badge from "../../components/shared/Badge/Badge";
import SearchableSelect from "../../components/shared/SearchableSelect/SearchableSelect";
import type { TableColumn } from "../../components/shared/Table/Table.types";
import type { SortDirection } from "../../components/shared/Table/Table.types";
import { usePageTitle } from "../../hooks/usePageTitle";
import api from "../../services/api";
import toast from "react-hot-toast";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  phone_number: string | null;
  whatsapp_number: string | null;
  department: string | null;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
}

interface Role {
  value: string;
  display: string;
}

interface UsersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

const UserManagementPage: React.FC = () => {
  usePageTitle("إدارة المستخدمين");
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get<UsersResponse>("/users/");
      setUsers(response.data.results);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      const response = await api.get<{ roles: Role[] }>("/users/roles/");
      setRoles(response.data.roles);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      toast.error("Failed to load roles");
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Handle toggle user active status
  const handleToggleStatus = async (userId: number, isActive: boolean) => {
    try {
      const endpoint = isActive
        ? `/users/${userId}/deactivate/`
        : `/users/${userId}/activate/`;
      await api.post(endpoint);
      toast.success(isActive ? "User deactivated" : "User activated");
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Failed to toggle user status:", error);
      toast.error("Failed to update user status");
    }
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSort = (columnKey: string, direction: SortDirection) => {
    // Sorting logic can be implemented here if needed
    console.log("Sort by:", columnKey, direction);
  };

  // Filter and sort users
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      key: "full_name",
      header: t("userManagement.fullName"),
      sortable: true,
      resizable: true,
      minWidth: 180,
      tooltip: "Full Name",
      render: (_value, user) => (
        <span className="text-dark">{user.full_name}</span>
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
      render: (_value, user) => {
        const roleDisplay =
          roles.find((r) => r.value === user.role)?.display || user.role;
        return <span className="text-dark">{roleDisplay}</span>;
      },
    },
    {
      key: "phone_number",
      header: t("userManagement.phone"),
      sortable: true,
      resizable: true,
      minWidth: 150,
      tooltip: "Phone Number",
      render: (_value, user) => (
        <span className="text-gray">{user.phone_number || "-"}</span>
      ),
    },
    {
      key: "is_active",
      header: t("userManagement.status"),
      sortable: true,
      resizable: true,
      minWidth: 120,
      tooltip: "User Status",
      render: (_value, user) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(user.id, user.is_active);
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              user.is_active ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                user.is_active ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <Badge variant={user.is_active ? "resolved" : "waiting"}>
            {user.is_active
              ? t("userManagement.active")
              : t("userManagement.inactive")}
          </Badge>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      resizable: false,
      minWidth: 80,
      render: (_value, user) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditUser(user);
          }}
          className="text-primary hover:text-primary/80 transition-colors p-2"
          title="Edit User"
        >
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
          <div>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t("userManagement.searchPlaceholder")}
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <Table
                columns={columns}
                data={currentUsers}
                sortable={true}
                resizable={true}
                onSort={handleSort}
              />

              <div className="p-2">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  pageSize={itemsPerPage}
                  onPageSizeChange={setItemsPerPage}
                  totalItems={filteredUsers.length}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {showCreateModal && (
        <UserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchUsers}
          roles={roles}
        />
      )}

      {showEditModal && selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSuccess={fetchUsers}
          roles={roles}
        />
      )}
    </div>
  );
};

interface UserModalProps {
  user?: User | null;
  onClose: () => void;
  onSuccess: () => void;
  roles: Role[];
}

const UserModal: React.FC<UserModalProps> = ({
  user,
  onClose,
  onSuccess,
  roles,
}) => {
  const { t } = useTranslation();
  const isEdit = !!user;

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    role: user?.role || "",
    phone_number: user?.phone_number || "",
    whatsapp_number: user?.whatsapp_number || "",
    department: user?.department || "",
    password: "",
    password_confirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!isEdit && formData.password !== formData.password_confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      if (isEdit && user) {
        // Update user - only send changed fields
        const updateData: Record<string, unknown> = {};
        if (formData.first_name !== user.first_name)
          updateData.first_name = formData.first_name;
        if (formData.last_name !== user.last_name)
          updateData.last_name = formData.last_name;
        if (formData.role !== user.role) updateData.role = formData.role;
        if (formData.phone_number !== user.phone_number)
          updateData.phone_number = formData.phone_number;
        if (formData.whatsapp_number !== user.whatsapp_number)
          updateData.whatsapp_number = formData.whatsapp_number;
        if (formData.department !== user.department)
          updateData.department = formData.department;

        await api.patch(`/users/${user.id}/`, updateData);
        toast.success("User updated successfully");
      } else {
        // Create new user
        await api.post("/users/", formData);
        toast.success("User created successfully");
      }
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error("Failed to save user:", error);
      const axiosError = error as {
        response?: { data?: { detail?: string; [key: string]: unknown } };
      };
      const errorMsg =
        axiosError?.response?.data?.detail ||
        JSON.stringify(axiosError?.response?.data) ||
        "Failed to save user";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-164 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-[#E1E4EA] flex items-center justify-between">
          <h2 className="text-xl font-semibold text-dark">
            {isEdit ? "Edit User" : t("userManagement.createNewUser")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray hover:text-dark transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-label mb-2">
              {t("userManagement.username")}
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              disabled={isEdit}
              required
              className="w-full px-4 py-2.5 border border-[#E1E4EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-dark placeholder:text-placeholder disabled:bg-gray-50"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-label mb-2">
              {t("userManagement.email")}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={isEdit}
              required
              className="w-full px-4 py-2.5 border border-[#E1E4EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-dark placeholder:text-placeholder disabled:bg-gray-50"
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
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                required
                className="w-full px-4 py-2.5 border border-[#E1E4EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-dark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-label mb-2">
                {t("userManagement.lastName")}
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#E1E4EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-dark"
              />
            </div>
          </div>

          {/* Role */}
          <SearchableSelect
            label={t("userManagement.roles")}
            placeholder="Select Role"
            options={roles.map((role) => ({
              value: role.value,
              label: role.display,
            }))}
            value={formData.role}
            onChange={(value) => setFormData({ ...formData, role: value })}
            searchPlaceholder="Search roles..."
            noResultsText="No roles found"
          />

          {/* Phone Numbers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-label mb-2">
                {t("userManagement.phone")}
              </label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#E1E4EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-dark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-label mb-2">
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={formData.whatsapp_number}
                onChange={(e) =>
                  setFormData({ ...formData, whatsapp_number: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#E1E4EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-dark"
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-label mb-2">
              Department
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-[#E1E4EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-dark"
            />
          </div>

          {/* Passwords - only for create */}
          {!isEdit && (
            <>
              <div>
                <label className="block text-sm font-medium text-label mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 border border-[#E1E4EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-dark pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray hover:text-dark"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-label mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.password_confirm}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password_confirm: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-2.5 border border-[#E1E4EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-dark pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray hover:text-dark"
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="sticky bottom-0 bg-white pt-4 border-t border-[#E1E4EA] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-[#E1E4EA] rounded-lg text-gray hover:text-dark hover:border-gray transition-colors font-medium"
            >
              {t("userManagement.cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEdit
                ? "Update User"
                : t("userManagement.createUser")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagementPage;
