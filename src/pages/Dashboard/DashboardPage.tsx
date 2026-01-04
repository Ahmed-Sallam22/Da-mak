import { useEffect, useState } from "react";
import { usePageTitle } from "../../hooks";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../../services/api";
import type { Ticket } from "../../types/ticket";

interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  closedTickets: number;
  inProgressTickets: number;
  avgResolutionTime: number;
  ticketsByMonth: Array<{ month: string; tickets: number }>;
  ticketsByStatus: Array<{ status: string; count: number; color: string }>;
  ticketsByPriority: Array<{ priority: string; count: number }>;
}

const DashboardPage: React.FC = () => {
  usePageTitle("Dashboard");

  const [stats, setStats] = useState<DashboardStats>({
    totalTickets: 0,
    openTickets: 0,
    closedTickets: 0,
    inProgressTickets: 0,
    avgResolutionTime: 0,
    ticketsByMonth: [],
    ticketsByStatus: [],
    ticketsByPriority: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tickets/");
      const tickets: Ticket[] = response.data.results || response.data;

      const total = tickets.length;
      const open = tickets.filter(
        (t) => t.status === "NEW" || t.status === "RESOLVED"
      ).length;
      const closed = tickets.filter((t) => t.status === "CLOSED").length;
      const inProgress = tickets.filter(
        (t) => t.status === "IN_PROGRESS"
      ).length;

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const ticketsByMonth = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        return {
          month: monthNames[date.getMonth()],
          tickets: 0,
        };
      });

      tickets.forEach((ticket) => {
        const createdDate = new Date(ticket.created_at);
        const monthIndex = ticketsByMonth.findIndex((m) => {
          const date = new Date();
          date.setMonth(date.getMonth() - (5 - ticketsByMonth.indexOf(m)));
          return createdDate.getMonth() === date.getMonth();
        });
        if (monthIndex !== -1) {
          ticketsByMonth[monthIndex].tickets++;
        }
      });

      const ticketsByStatus = [
        { status: "Open", count: open, color: "#3B82F6" },
        { status: "In Progress", count: inProgress, color: "#F59E0B" },
        { status: "Closed", count: closed, color: "#10B981" },
      ];

      const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
      const ticketsByPriority = priorities.map((priority) => ({
        priority,
        count: tickets.filter((t) => t.priority === priority).length,
      }));

      setStats({
        totalTickets: total,
        openTickets: open,
        closedTickets: closed,
        inProgressTickets: inProgress,
        avgResolutionTime: 2.5,
        ticketsByMonth,
        ticketsByStatus,
        ticketsByPriority,
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
            Welcome back! Here's an overview of your tickets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E1E4EA]">
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm text-gray font-medium">Total Tickets</div>
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
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-dark">
                {stats.totalTickets}
              </span>
            </div>
            <div className="flex items-center text-xs">
              <span className="text-gray">All time tickets</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E1E4EA]">
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm text-gray font-medium">Open Tickets</div>
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-dark">
                {stats.openTickets}
              </span>
            </div>
            <div className="flex items-center text-xs">
              <span className="text-blue-500">
                {stats.totalTickets > 0
                  ? Math.round((stats.openTickets / stats.totalTickets) * 100)
                  : 0}
                %
              </span>
              <span className="text-gray ml-1">of total</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E1E4EA]">
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm text-gray font-medium">In Progress</div>
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
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-dark">
                {stats.inProgressTickets}
              </span>
            </div>
            <div className="flex items-center text-xs">
              <span className="text-orange-500">
                {stats.totalTickets > 0
                  ? Math.round(
                      (stats.inProgressTickets / stats.totalTickets) * 100
                    )
                  : 0}
                %
              </span>
              <span className="text-gray ml-1">of total</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E1E4EA]">
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm text-gray font-medium">
                Closed Tickets
              </div>
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
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-dark">
                {stats.closedTickets}
              </span>
            </div>
            <div className="flex items-center text-xs">
              <span className="text-green-500">
                {stats.totalTickets > 0
                  ? Math.round((stats.closedTickets / stats.totalTickets) * 100)
                  : 0}
                %
              </span>
              <span className="text-gray ml-1">of total</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E1E4EA]">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-dark">
                Tickets Trend (Last 6 Months)
              </h2>
              <p className="text-sm text-gray mt-1">
                Monthly ticket creation overview
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.ticketsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E1E4EA" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E1E4EA",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tickets"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E1E4EA]">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-dark">
                Tickets by Status
              </h2>
              <p className="text-sm text-gray mt-1">
                Current ticket status distribution
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
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
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.ticketsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap gap-4 justify-center">
              {stats.ticketsByStatus.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm text-gray">
                    {entry.status}: {entry.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E1E4EA]">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-dark">
              Tickets by Priority
            </h2>
            <p className="text-sm text-gray mt-1">
              Ticket distribution across priority levels
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.ticketsByPriority}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E1E4EA" />
              <XAxis dataKey="priority" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E1E4EA",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
