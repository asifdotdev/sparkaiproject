'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';

export default function NewServicePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ categoryId: '', name: '', description: '', price: '', durationMinutes: '60', image: '' });
  const [error, setError] = useState('');

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => adminApi.getCategories(),
  });

  const categories = categoriesData?.data || [];

  const mutation = useMutation({
    mutationFn: () =>
      adminApi.createService({
        categoryId: parseInt(form.categoryId),
        name: form.name,
        description: form.description || undefined,
        price: parseFloat(form.price),
        durationMinutes: parseInt(form.durationMinutes),
        image: form.image || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      router.push('/dashboard/services');
    },
    onError: (err: any) => {
      setError(err.response?.data?.error?.message || 'Failed to create service');
    },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Service</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Select a category</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Service name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min) *</label>
              <input
                type="number"
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="https://..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => mutation.mutate()}
              disabled={!form.name || !form.categoryId || !form.price || mutation.isPending}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {mutation.isPending ? 'Creating...' : 'Create Service'}
            </button>
            <button onClick={() => router.back()} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
