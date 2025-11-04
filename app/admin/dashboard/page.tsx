'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, UserCheck, MessageSquare, Eye, TrendingUp, TrendingDown } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingInquiries: 0,
    totalPageViews: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const supabase = createClient()

    try {
      // Fetch total regular users
      const { count: totalRegularUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })

      // Fetch total admins
      const { count: totalAdmins } = await supabase
        .from('admin_profiles')
        .select('*', { count: 'exact', head: true })

      // Calculate total users (users + admins)
      const totalUsers = (totalRegularUsers || 0) + (totalAdmins || 0)

      // Fetch active users (logged in within last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { count: activeRegularUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_login_at', sevenDaysAgo.toISOString())

      const { count: activeAdmins } = await supabase
        .from('admin_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_login_at', sevenDaysAgo.toISOString())

      const activeUsers = (activeRegularUsers || 0) + (activeAdmins || 0)

      // Fetch pending inquiries
      const { count: pendingInquiries } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      setStats({
        totalUsers,
        activeUsers,
        pendingInquiries: pendingInquiries || 0,
        totalPageViews: 0, // Will be fetched from analytics when implemented
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green"></div>
      </div>
    )
  }

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
          You have successfully set up your admin panel. Complete the Supabase setup to unlock all features.
        </p>
        <div className="flex gap-4">
          <a
            href="/SUPABASE_SETUP_GUIDE.md"
            className="bg-white text-primary-green px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Setup Guide
          </a>
          <a
            href="/ADMIN_PANEL_PRD.md"
            className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/10 transition-colors"
          >
            View Documentation
          </a>
        </div>
      </div>
    </div>
  )
}
