import { usePageTitle } from "../../hooks";

const DashboardPage: React.FC = () => {
  // Set page title
  usePageTitle("Dashboard");

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-dark">Dashboard</h1>
          <p className="text-gray mt-2">
            Welcome back! Here's an overview of your tickets.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm text-gray">Lorem Ipsum</div>
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
                  d="M7 11l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-dark">500</span>
              <span className="text-sm text-gray ml-2">Lorem</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray">This Month</span>
              <span className="text-green-500">+10%</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm text-gray">Lorem Ipsum</div>
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
                  d="M7 11l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-dark">2000</span>
              <span className="text-sm text-gray ml-2">Lorem</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray">This Month</span>
              <span className="text-green-500">+10%</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm text-gray">Lorem Ipsum</div>
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
                  d="M7 11l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-dark">300000</span>
              <span className="text-sm text-gray ml-2">Lorem</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray">This Month</span>
              <span className="text-green-500">+10%</span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-dark">Lorem Ipsum</h2>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5">
                <option>This Month</option>
              </select>
            </div>
            <div className="h-64 flex items-center justify-center text-gray">
              <p>Chart placeholder - Revenue data would be displayed here</p>
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-dark">Lorem Ipsum</h2>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5">
                <option>This Year</option>
              </select>
            </div>
            <div className="h-64 flex items-center justify-center text-gray">
              <p>Chart placeholder - Trend data would be displayed here</p>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-dark">All Tickets</h2>
            <p className="text-sm text-gray">
              Check All Tickets list and informations
            </p>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray">
                      Project
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray">
                      Title
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray">
                      Priority
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-dark">Tanfeez</td>
                    <td className="py-4 px-4 text-sm text-dark">
                      Add export to Excel feature
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                        BUG
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                        Medium
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                        New
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-gray hover:text-dark">
                        <svg
                          className="w-5 h-5"
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
                    </td>
                  </tr>
                  {/* More rows would be added dynamically */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
