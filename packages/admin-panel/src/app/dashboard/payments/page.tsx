'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
};

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-payments', statusFilter, page],
    queryFn: () => adminApi.getPayments({ status: statusFilter || undefined, page, limit: 10 }),
  });

  const payments = data?.data || [];
  const meta = data?.meta;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-500 mt-1">View all payment transactions</p>
      </div>

      <div className="flex gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Booking</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Method</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No payments found</td></tr>
            ) : (
              payments.map((payment: any) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{payment.id}</td>
                  <td className="px-6 py-4 text-sm text-indigo-600">#{payment.booking?.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{payment.booking?.customer?.name}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">${payment.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 capitalize">{payment.method}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[payment.status] || ''}`}>
                      {payment.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 font-mono">{payment.transactionId || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
