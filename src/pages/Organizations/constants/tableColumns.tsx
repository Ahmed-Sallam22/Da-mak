import type { TableColumn } from "../../../components/shared/Table/Table.types";

export interface OrgAccount {
  id: string;
  name: string;
}

export interface Project {
  id: string | number;
  name: string;
  code?: string;
  admin?: string;
  admin_id?: number | null;
  ticketCount?: number;
  status?: string;
}

export const getAccountColumns = (): TableColumn<OrgAccount>[] => [
  {
    key: "name",
    header: "Name",
    minWidth: 200,
  },
];

export const getProjectColumns = (
  onAssignAdmin?: (projectId: number) => void,
  onUpdateAdmin?: (projectId: number) => void
): TableColumn<Project>[] => [
  {
    key: "name",
    header: "Project Name",
    minWidth: 200,
  },

  {
    key: "admin",
    header: "Admin",
    minWidth: 150,
    render: (value) => (value as string) || "Not assigned",
  },
  {
    key: "actions",
    header: "Actions",
    minWidth: 150,
    render: (_, row) => {
      const projectId =
        typeof row.id === "string"
          ? parseInt(row.id.replace("project-", ""))
          : row.id;
      return (
        <div className="flex gap-2">
          {row.admin_id ? (
            <button
              onClick={() => onUpdateAdmin?.(projectId)}
              className="px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              Update Admin
            </button>
          ) : (
            <button
              onClick={() => onAssignAdmin?.(projectId)}
              className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              Assign Admin
            </button>
          )}
        </div>
      );
    },
  },
];
