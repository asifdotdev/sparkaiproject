'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { adminApi } from '@/lib/api';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-700',
};

export default function BookingsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-bookings', statusFilter, page],
    queryFn: () => adminApi.getBookings({ status: statusFilter || undefined, page, limit: 10 }),
  });

  const bookings = data?.data || [];
  const meta = data?.meta;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-500 mt-1">View and manage all bookings</p>
      </div>

      <div className="flex gap-2 mb-6">
        {['', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => { setStatusFilter(status); setPage(1); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status ? status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'All'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Service</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Provider</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No bookings found</td></tr>
            ) : (
              bookings.map((booking: any) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-indigo-600">
                    <Link href={`/dashboard/bookings/${booking.id}`}>#{booking.id}</Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{booking.customer?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{booking.service?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{booking.provider?.user?.name || 'Unassigned'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{booking.scheduledDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[booking.status] || ''}`}>
                      {booking.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">${booking.totalPrice}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {meta && meta.totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
            <p className="text-sm text-gray-500">Page {meta.page} of {meta.totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-50">Previous</button>
              <button onClick={() => setPage(Math.min(meta.totalPages, page + 1))} disabled={page === meta.totalPages} className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
