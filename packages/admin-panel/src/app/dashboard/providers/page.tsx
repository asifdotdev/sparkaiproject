'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ProvidersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [verifiedFilter, setVerifiedFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-providers', verifiedFilter, page],
    queryFn: () => adminApi.getProviders({ verified: verifiedFilter || undefined, page, limit: 10 }),
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, verified }: { id: number; verified: boolean }) =>
      adminApi.verifyProvider(id, verified),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-providers'] }),
  });

  const providers = data?.data || [];
  const meta = data?.meta;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Providers</h1>
          <p className="text-gray-500 mt-1">Manage service providers and verification</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <select
          value={verifiedFilter}
          onChange={(e) => { setVerifiedFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="">All Providers</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Jobs</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Experience</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Available</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Verified</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
            ) : providers.length === 0 ? (
              <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400">No providers found</td></tr>
            ) : (
              providers.map((provider: any) => (
                <tr key={provider.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{provider.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{provider.user?.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="flex items-center gap-1">
                      <span className="text-amber-500">★</span> {provider.rating}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{provider.totalJobs}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{provider.experienceYears} years</td>
                  <td className="px-6 py-4">
                    {provider.isAvailable ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      provider.verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {provider.verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => verifyMutation.mutate({ id: provider.id, verified: !provider.verified })}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      {provider.verified ? 'Revoke' : 'Verify'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
