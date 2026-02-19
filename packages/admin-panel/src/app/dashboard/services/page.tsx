'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { adminApi } from '@/lib/api';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function ServicesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data: servicesData, isLoading } = useQuery({
    queryKey: ['services', categoryFilter, page],
    queryFn: () => adminApi.getServices({ categoryId: categoryFilter || undefined, page, limit: 10 }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => adminApi.getCategories(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteService(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  });

  const services = servicesData?.data || [];
  const categories = categoriesData?.data || [];
  const meta = servicesData?.meta;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-500 mt-1">Manage services and pricing</p>
        </div>
        <Link
          href="/dashboard/services/new"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} /> Add Service
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
            ) : services.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No services found</td></tr>
            ) : (
              services.map((service: any) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{service.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{service.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{service.category?.name}</td>
                  <td className="px-6 py-4 text-sm font-medium text-indigo-600">${service.price}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{service.durationMinutes} min</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      service.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link href={`/dashboard/services/${service.id}/edit`} className="p-1.5 text-gray-400 hover:text-indigo-600">
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => confirm('Deactivate this service?') && deleteMutation.mutate(service.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
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
