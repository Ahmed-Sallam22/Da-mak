import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import EditOrganizationModal from "./components/EditOrganizationModal";
import AddOrgAccountModal from "./components/AddOrgAccountModal";
import AddProjectModal from "./components/AddProjectModal";
import CustomSLAModal from "./components/CustomSLAModal";
import OrganizationInfoCard from "./components/OrganizationInfoCard";
import NotificationPreferencesCard from "./components/NotificationPreferencesCard";
import SLASettingsCard from "./components/SLASettingsCard";
import DataTableSection from "./components/DataTableSection";
import PageHeader from "./components/PageHeader";
import { useOrganization } from "./hooks/useOrganization";
import {
  getAccountColumns,
  getProjectColumns,
  getMockOrgAccounts,
  getMockProjects,
} from "./constants/tableColumns";
import type { OrgAccountFormData } from "./components/AddOrgAccountModal";
import type { ProjectFormData } from "./components/AddProjectModal";
import { usePageTitle } from "../../hooks/usePageTitle";

const PlusIcon = () => (
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
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const OrganizationDetailsPage: React.FC = () => {
  usePageTitle("تفاصيل المؤسسة");
  const { id } = useParams();

  // Custom hook for organization state management
  const { organization, toggleNotification, updateSLA, updateBasicInfo } =
    useOrganization({ id });

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isCustomSLAModalOpen, setIsCustomSLAModalOpen] = useState(false);

  // Data
  const orgAccounts = useMemo(() => getMockOrgAccounts(), []);
  const projects = useMemo(() => getMockProjects(), []);
  const accountColumns = useMemo(() => getAccountColumns(), []);
  const projectColumns = useMemo(() => getProjectColumns(), []);

  // Notification preferences configuration
  const notificationPreferences = useMemo(
    () => [
      {
        label: "Notify when Opened",
        value: organization.notifyOpened,
        onChange: () => toggleNotification("notifyOpened"),
      },
      {
        label: "Notify when Assigned",
        value: organization.notifyAssigned,
        onChange: () => toggleNotification("notifyAssigned"),
      },
      {
        label: "Notify when In Progress",
        value: organization.notifyInProgress,
        onChange: () => toggleNotification("notifyInProgress"),
      },
      {
        label: "Notify when Resolved",
        value: organization.notifyResolved,
        onChange: () => toggleNotification("notifyResolved"),
      },
    ],
    [organization, toggleNotification]
  );

  // Page header actions
  const headerActions = useMemo(
    () => [
      {
        label: "Add Org Account",
        onClick: () => setIsAddAccountModalOpen(true),
        icon: <PlusIcon />,
      },
      {
        label: "Add Project",
        onClick: () => setIsAddProjectModalOpen(true),
        icon: <PlusIcon />,
      },
    ],
    []
  );

  // SLA settings
  const slaSettings = useMemo(
    () => ({
      type: organization.slaType,
      urgent: organization.slaUrgent,
      high: organization.slaHigh,
      medium: organization.slaMedium,
      low: organization.slaLow,
    }),
    [organization]
  );

  // Handlers
  const handleSaveNotifications = () => {
    console.log("Notifications saved:", {
      notifyOpened: organization.notifyOpened,
      notifyAssigned: organization.notifyAssigned,
      notifyInProgress: organization.notifyInProgress,
      notifyResolved: organization.notifyResolved,
    });
  };

  const handleEditOrganization = (data: {
    name: string;
    code: string;
    status: boolean;
  }) => {
    updateBasicInfo(data);
    setIsEditModalOpen(false);
  };

  const handleCustomSLA = (data: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  }) => {
    updateSLA(data);
    setIsCustomSLAModalOpen(false);
  };

  const handleAddAccount = (data: OrgAccountFormData) => {
    console.log("Add account:", data);
    setIsAddAccountModalOpen(false);
  };

  const handleAddProject = (data: ProjectFormData) => {
    console.log("Add project:", data);
    setIsAddProjectModalOpen(false);
  };

  const handleSetDefaultSLA = () => {
    console.log("Set default SLA");
  };

  const handleUnassignSLA = () => {
    console.log("Unassign SLA");
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <PageHeader title="Organization Details" actions={headerActions} />

      {/* Top Section - Organization Info and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <OrganizationInfoCard
          name={organization.name}
          code={organization.code}
          status={organization.status}
          onEdit={() => setIsEditModalOpen(true)}
        />

        <NotificationPreferencesCard
          preferences={notificationPreferences}
          onSave={handleSaveNotifications}
        />
      </div>

      {/* SLA Settings Section */}
      <div className="mb-6">
        <SLASettingsCard
          sla={slaSettings}
          onSetDefault={handleSetDefaultSLA}
          onSetCustom={() => setIsCustomSLAModalOpen(true)}
          onUnassign={handleUnassignSLA}
        />
      </div>

      {/* Org Accounts Section */}
      <div className="mb-6">
        <DataTableSection
          title="Org Accounts"
          columns={accountColumns}
          data={orgAccounts}
        />
      </div>

      {/* Projects Section */}
      <DataTableSection
        title="Projects"
        columns={projectColumns}
        data={projects}
      />

      {/* Modals */}
      <EditOrganizationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditOrganization}
        organization={{
          name: organization.name,
          code: organization.code,
          status: organization.status === "Active",
        }}
      />

      <AddOrgAccountModal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        onSubmit={handleAddAccount}
      />

      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
        onSubmit={handleAddProject}
        organizationName={organization.name}
      />

      <CustomSLAModal
        isOpen={isCustomSLAModalOpen}
        onClose={() => setIsCustomSLAModalOpen(false)}
        onSubmit={handleCustomSLA}
        currentSLA={{
          urgent: organization.slaUrgent,
          high: organization.slaHigh,
          medium: organization.slaMedium,
          low: organization.slaLow,
        }}
      />
    </div>
  );
};

export default OrganizationDetailsPage;
