import type { TableColumn } from "../../../components/shared/Table/Table.types";

export interface OrgAccount {
  id: string;
  name: string;
  username: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  admin: string;
}

export const getAccountColumns = (): TableColumn<OrgAccount>[] => [
  {
    key: "name",
    header: "Name",
    minWidth: 200,
  },
  {
    key: "username",
    header: "Username",
    minWidth: 150,
  },
  {
    key: "email",
    header: "Email",
    minWidth: 200,
  },
];

export const getProjectColumns = (): TableColumn<Project>[] => [
  {
    key: "name",
    header: "Project Name",
    minWidth: 200,
  },
  {
    key: "code",
    header: "Code",
    minWidth: 100,
  },
  {
    key: "admin",
    header: "Admin",
    minWidth: 150,
  },
  {
    key: "actions",
    header: "Actions",
    minWidth: 80,
    render: () => (
      <button className="p-2 text-gray hover:text-dark hover:bg-[#F5F7FA] rounded-lg transition-colors">
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

// Mock data
export const getMockOrgAccounts = (): OrgAccount[] => [
  {
    id: "1",
    name: "Ahmed Ali",
    username: "ahmed.ali",
    email: "ahmed@acme.com",
  },
  {
    id: "2",
    name: "Sara Mohamed",
    username: "sara.m",
    email: "sara@acme.com",
  },
  {
    id: "3",
    name: "Omar Hassan",
    username: "omar.h",
    email: "omar@acme.com",
  },
];

export const getMockProjects = (): Project[] => [
  { id: "1", name: "Website Redesign", code: "WEB-R", admin: "Ahmed Ali" },
  { id: "2", name: "Mobile App", code: "MOB-A", admin: "Sara Mohamed" },
  { id: "3", name: "API Integration", code: "API-I", admin: "Omar Hassan" },
];
