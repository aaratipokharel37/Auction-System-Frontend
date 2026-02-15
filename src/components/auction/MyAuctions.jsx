import { getMyAuctions } from '@/queries/auction'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle } from 'lucide-react'
import React from 'react'
import BidCard from '../home-page/BidCard'
import { Skeleton } from '@/components/ui/skeleton'

const MyAuctions = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['my-auctions'],
        queryFn: getMyAuctions
    })

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white">
                My Auctions
            </h1>

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
                                Failed to Load Your Auctions
                            </h3>
                        </div>
                        <p className="text-gray-400 mb-6">
                            {error?.message || 'An error occurred while fetching your auctions. Please try again later.'}
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
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-3">
                            No Auctions Yet
                        </h3>
                        <p className="text-gray-400 mb-6">
                            You haven't created any auctions yet. Start by creating your first auction!
                        </p>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                            Create Auction
                        </button>
                    </div>
                </div>
            )}

            {/* Auctions Grid */}
            {!isLoading && !error && data?.items && data.items.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.items.map((item, index) => (
                        <BidCard 
                            key={item.id} 
                            auction={item}
                            delay={index + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyAuctions