'use client';

import { useQuery } from '@tanstack/react-query';
import { Users, UserCheck, Calendar, DollarSign } from 'lucide-react';
import { adminApi } from '@/lib/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6', '#10B981', '#6B7280'];

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => adminApi.getDashboard(),
  });

  const stats = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'bg-blue-500', bgColor: 'bg-blue-50' },
    { label: 'Total Providers', value: stats?.totalProviders || 0, icon: UserCheck, color: 'bg-green-500', bgColor: 'bg-green-50' },
    { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: Calendar, color: 'bg-purple-500', bgColor: 'bg-purple-50' },
    { label: 'Total Revenue', value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`, icon: DollarSign, color: 'bg-amber-500', bgColor: 'bg-amber-50' },
  ];

  const bookingsByStatus = (stats?.bookingsByStatus || []).map((item: any) => ({
    name: item.status.replace('_', ' ').toUpperCase(),
    value: parseInt(item.count),
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to SparkAI Admin Panel</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${card.color.replace('bg-', '')}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Bookings by Status</h2>
          {bookingsByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingsByStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {bookingsByStatus.map((_: any, index: number) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">No data yet</div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: 'Users', count: stats?.totalUsers || 0 },
                { name: 'Providers', count: stats?.totalProviders || 0 },
                { name: 'Active', count: stats?.activeProviders || 0 },
                { name: 'Bookings', count: stats?.totalBookings || 0 },
                { name: 'Recent', count: stats?.recentBookings || 0 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
