'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';

export default function NewCategoryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', description: '', image: '', sortOrder: 0 });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => adminApi.createCategory(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      router.push('/dashboard/categories');
    },
    onError: (err: any) => {
      setError(err.response?.data?.error?.message || 'Failed to create category');
    },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Category</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Category name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              rows={3}
              placeholder="Category description"
            />
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => mutation.mutate()}
              disabled={!form.name || mutation.isPending}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {mutation.isPending ? 'Creating...' : 'Create Category'}
            </button>
            <button
              onClick={() => router.back()}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
