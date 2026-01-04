import { useEffect, useState } from "react";
import { usePageTitle } from "../../hooks";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import api from "../../services/api";

interface TicketStatistics {
  total_tickets: number;
  not_closed_count: number;
  status_breakdown: {
    NEW: number;
    OPENED: number;
    IN_PROGRESS: number;
    RESOLVED: number;
    REJECTED: number;
    CLOSED: number;
  };
  created_today: number;
  breached_tickets: {
    response_breached: number;
    resolution_breached: number;
  };
}

interface DashboardStats {
  totalTickets: number;
  notClosedCount: number;
  closedTickets: number;
  createdToday: number;
  responseBreached: number;
  resolutionBreached: number;
  ticketsByStatus: Array<{ status: string; count: number; color: string }>;
}

const DashboardPage: React.FC = () => {
  usePageTitle("Dashboard");

  const [stats, setStats] = useState<DashboardStats>({
    totalTickets: 0,
    notClosedCount: 0,
    closedTickets: 0,
    createdToday: 0,
    responseBreached: 0,
    resolutionBreached: 0,
    ticketsByStatus: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get<TicketStatistics>("/tickets/statistics/");
      const data = response.data;

      const ticketsByStatus = [
        { status: "New", count: data.status_breakdown.NEW, color: "#3B82F6" },
        {
          status: "Opened",
          count: data.status_breakdown.OPENED,
          color: "#8B5CF6",
        },
        {
          status: "In Progress",
          count: data.status_breakdown.IN_PROGRESS,
          color: "#F59E0B",
        },
        {
          status: "Resolved",
          count: data.status_breakdown.RESOLVED,
          color: "#10B981",
        },
        {
          status: "Rejected",
          count: data.status_breakdown.REJECTED,
          color: "#EF4444",
        },
        {
          status: "Closed",
          count: data.status_breakdown.CLOSED,
          color: "#6B7280",
        },
      ].filter((item) => item.count > 0);

      setStats({
        totalTickets: data.total_tickets,
        notClosedCount: data.not_closed_count,
        closedTickets: data.status_breakdown.CLOSED,
        createdToday: data.created_today,
        responseBreached: data.breached_tickets.response_breached,
        resolutionBreached: data.breached_tickets.resolution_breached,
        ticketsByStatus,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-dark">Dashboard</h1>
          <p className="text-gray mt-2">
            Welcome back! Here is an overview of your tickets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E1E4EA] hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray font-medium">
                  Total Tickets
                </span>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-4xl font-bold text-dark">
                {stats.totalTickets}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mt-3">
              <span className="text-gray">All time</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E1E4EA] hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <svg
                    className="w-5 h-5 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray font-medium">
                  Active Tickets
                </span>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-4xl font-bold text-dark">
                {stats.notClosedCount}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mt-3">
              <span className="text-gray">Not closed</span>
              <span className="text-orange-500 font-medium">
                {stats.totalTickets > 0
                  ? Math.round(
                      (stats.notClosedCount / stats.totalTickets) * 100
                    )
                  : 0}
                %
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E1E4EA] hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray font-medium">
                  Closed Tickets
                </span>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-4xl font-bold text-dark">
                {stats.closedTickets}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mt-3">
              <span className="text-gray">Completed</span>
              <span className="text-green-500 font-medium">
                {stats.totalTickets > 0
                  ? Math.round((stats.closedTickets / stats.totalTickets) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E1E4EA]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray font-medium mb-1">
                  Created Today
                </p>
                <p className="text-2xl font-bold text-dark">
                  {stats.createdToday}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-500"
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
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E1E4EA]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray font-medium mb-1">
                  Response Breached
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.responseBreached}
                </p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E1E4EA]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray font-medium mb-1">
                  Resolution Breached
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.resolutionBreached}
                </p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E1E4EA]">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-dark">
                Tickets by Status
              </h2>
              <p className="text-sm text-gray mt-1">
                Current ticket status distribution
              </p>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={stats.ticketsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => {
                    const percent = entry.percent || 0;
                    const status =
                      stats.ticketsByStatus.find((s) => s.count === entry.value)
                        ?.status || "";
                    return `${status} ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.ticketsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {stats.ticketsByStatus.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm text-gray flex-1">
                    {entry.status}
                  </span>
                  <span className="text-sm font-semibold text-dark">
                    {entry.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E1E4EA]">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-dark">
                Status Breakdown
              </h2>
              <p className="text-sm text-gray mt-1">
                Detailed ticket count by status
              </p>
            </div>
            <div className="space-y-3">
              {stats.ticketsByStatus.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                    </div>
                    <span className="font-medium text-dark">{item.status}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-dark">{item.count}</p>
                    <p className="text-xs text-gray">
                      {stats.totalTickets > 0
                        ? Math.round((item.count / stats.totalTickets) * 100)
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
