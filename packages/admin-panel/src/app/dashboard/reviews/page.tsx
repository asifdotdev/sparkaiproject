'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { Star, Trash2 } from 'lucide-react';

export default function ReviewsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews', page],
    queryFn: () => adminApi.getReviews({ page, limit: 10 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteReview(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-reviews'] }),
  });

  const reviews = data?.data || [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-500 mt-1">Moderate user reviews</p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No reviews yet</div>
        ) : (
          reviews.map((review: any) => (
            <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{review.user?.name}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-gray-600">{review.provider?.user?.name}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}
                      />
                    ))}
                    <span className="ml-1 text-sm text-gray-500">({review.rating}/5)</span>
                  </div>
                  {review.comment && <p className="text-gray-600 text-sm">{review.comment}</p>}
                  <p className="text-xs text-gray-400 mt-2">Booking #{review.booking?.id}</p>
                </div>
                <button
                  onClick={() => confirm('Delete this review?') && deleteMutation.mutate(review.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
