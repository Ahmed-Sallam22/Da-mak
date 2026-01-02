import { useState } from "react";

interface Organization {
  id: string;
  name: string;
  code: string;
  status: "Active" | "Inactive";
  notifyOpened: boolean;
  notifyAssigned: boolean;
  notifyInProgress: boolean;
  notifyResolved: boolean;
  slaType: string;
  slaUrgent: number;
  slaHigh: number;
  slaMedium: number;
  slaLow: number;
}

interface UseOrganizationReturn {
  organization: Organization;
  updateOrganization: (updates: Partial<Organization>) => void;
  toggleNotification: (key: keyof Pick<Organization, 'notifyOpened' | 'notifyAssigned' | 'notifyInProgress' | 'notifyResolved'>) => void;
  updateSLA: (sla: { urgent: number; high: number; medium: number; low: number }) => void;
  updateBasicInfo: (data: { name: string; code: string; status: boolean }) => void;
}

export const useOrganization = (initialData?: Partial<Organization>): UseOrganizationReturn => {
  const [organization, setOrganization] = useState<Organization>({
    id: initialData?.id || "1",
    name: initialData?.name || "Acme Corp",
    code: initialData?.code || "ACME",
    status: initialData?.status || "Active",
    notifyOpened: initialData?.notifyOpened ?? true,
    notifyAssigned: initialData?.notifyAssigned ?? true,
    notifyInProgress: initialData?.notifyInProgress ?? false,
    notifyResolved: initialData?.notifyResolved ?? true,
    slaType: initialData?.slaType || "Custom SLA",
    slaUrgent: initialData?.slaUrgent || 15,
    slaHigh: initialData?.slaHigh || 30,
    slaMedium: initialData?.slaMedium || 60,
    slaLow: initialData?.slaLow || 120,
  });

  const updateOrganization = (updates: Partial<Organization>) => {
    setOrganization((prev) => ({ ...prev, ...updates }));
  };

  const toggleNotification = (key: keyof Pick<Organization, 'notifyOpened' | 'notifyAssigned' | 'notifyInProgress' | 'notifyResolved'>) => {
    setOrganization((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateSLA = (sla: { urgent: number; high: number; medium: number; low: number }) => {
    setOrganization((prev) => ({
      ...prev,
      slaType: "Custom SLA",
      slaUrgent: sla.urgent,
      slaHigh: sla.high,
      slaMedium: sla.medium,
      slaLow: sla.low,
    }));
  };

  const updateBasicInfo = (data: { name: string; code: string; status: boolean }) => {
    setOrganization((prev) => ({
      ...prev,
      name: data.name,
      code: data.code,
      status: data.status ? "Active" : "Inactive",
    }));
  };

  return {
    organization,
    updateOrganization,
    toggleNotification,
    updateSLA,
    updateBasicInfo,
  };
};
