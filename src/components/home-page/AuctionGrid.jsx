import React from 'react';
import FilterTabs from './FilterTabs';
import BidCard from './BidCard';
import { useQuery } from '@tanstack/react-query';
import { getAllAuctions } from '@/queries/auction';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

const AuctionGrid = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["all-auctions"],
    queryFn: getAllAuctions
  });

  return (
    <>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <h2 className="font-display text-4xl lg:text-5xl font-bold text-white">
          Featured Auctions
        </h2>
        <FilterTabs />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-64 w-full rounded-lg bg-gray-800" />
              <Skeleton className="h-6 w-3/4 bg-gray-800" />
              <Skeleton className="h-4 w-1/2 bg-gray-800" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24 bg-gray-800" />
                <Skeleton className="h-10 w-24 bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h3 className="text-xl font-semibold text-white">
                Failed to Load Auctions
              </h3>
            </div>
            <p className="text-gray-400 mb-6">
              {error?.message || 'An error occurred while fetching auctions. Please try again later.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* No Data State */}
      {!isLoading && !error && (!data?.items || data.items.length === 0) && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              No Auctions Available
            </h3>
            <p className="text-gray-400">
              There are currently no featured auctions. Check back soon for exciting new items!
            </p>
          </div>
        </div>
      )}

      {/* Bid Grid */}
      {!isLoading && !error && data?.items && data.items.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.items.map((auction, index) => (
            <BidCard 
              key={auction.id} 
              auction={auction} 
              delay={index + 1}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default AuctionGrid;