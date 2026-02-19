'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { adminApi } from '@/lib/api';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function CategoriesPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => adminApi.getCategories(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  const categories = data?.data || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">Manage service categories</p>
        </div>
        <Link
          href="/dashboard/categories/new"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} /> Add Category
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-3 text-center py-12 text-gray-400">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-gray-400">No categories yet</div>
        ) : (
          categories.map((cat: any) => (
            <div key={cat.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-xl">
                      📂
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{cat.description || 'No description'}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  cat.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-gray-400">Order: {cat.sortOrder}</span>
                <div className="ml-auto flex gap-2">
                  <Link
                    href={`/dashboard/categories/${cat.id}/edit`}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to deactivate this category?')) {
                        deleteMutation.mutate(cat.id);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
