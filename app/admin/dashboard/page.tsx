'use client'

import { Users, UserCheck, MessageSquare, Eye, TrendingUp, TrendingDown } from 'lucide-react'

export default function DashboardPage() {
  // Mock data for testing
  const stats = {
    totalUsers: 150,
    activeUsers: 89,
    pendingInquiries: 12,
    totalPageViews: 2540,
  }

  const statCards = [
    {
      name: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      change: '+12%',
      changeType: 'positive' as const,
      bgColor: 'bg-blue-500',
    },
    {
      name: 'Active Users',
      value: stats.activeUsers,
      icon: UserCheck,
      change: '+5%',
      changeType: 'positive' as const,
      bgColor: 'bg-green-500',
    },
    {
      name: 'Pending Inquiries',
      value: stats.pendingInquiries,
      icon: MessageSquare,
      change: '-2%',
      changeType: 'negative' as const,
      bgColor: 'bg-yellow-500',
    },
    {
      name: 'Page Views',
      value: stats.totalPageViews,
      icon: Eye,
      change: '+18%',
      changeType: 'positive' as const,
      bgColor: 'bg-purple-500',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.changeType === 'positive' ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === 'positive'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500">from last week</span>
                </div>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Users
          </h2>
          <div className="text-sm text-gray-500 text-center py-8">
            User list will appear here once database is set up
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="text-sm text-gray-500 text-center py-8">
            Activity logs will appear here
          </div>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-primary-green to-green-600 rounded-xl shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to JKKN Admin Panel!</h2>
        <p className="text-green-50 mb-6">
          Testing Mode - You are viewing the admin dashboard with mock data.
        </p>
      </div>
    </div>
  )
}
