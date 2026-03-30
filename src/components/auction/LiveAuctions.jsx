import { getPublicAuctions } from '@/queries/auction'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, Radio } from 'lucide-react'
import React from 'react'
import BidCard from '../home-page/BidCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@tanstack/react-router'

const LiveAuctions = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['public-auctions'],
        queryFn: getPublicAuctions
    })

    const liveItems = data?.items?.filter((item) => {
        const now = new Date()
        const endTime = new Date(item.endTime)
        const startTime = new Date(item.startTime)
        return endTime > now && startTime <= now
    }) ?? []

    return (
        <div className="space-y-8 px-6 lg:px-10 py-8">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <h1 className="font-display text-3xl lg:text-4xl font-bold text-white">
                    Live Auctions
                </h1>
                {!isLoading && liveItems.length > 0 && (
                    <span className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium px-4 py-1.5 rounded-full">
                        <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse inline-block"></span>
                        {liveItems.length} Live Now
                    </span>
                )}
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
                                Failed to Load Live Auctions
                            </h3>
                        </div>
                        <p className="text-gray-400 mb-6">
                            {error?.message || 'An error occurred while fetching live auctions. Please try again later.'}
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

            {/* No Live Auctions State */}
            {!isLoading && !error && liveItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Radio className="w-10 h-10 text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-3">
                            No Live Auctions
                        </h3>
                        <p className="text-gray-400 mb-6">
                            There are no active auctions at the moment. Check back soon.
                        </p>
                    </div>
                </div>
            )}

            {/* Live Auctions Grid */}
            {!isLoading && !error && liveItems.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {liveItems.map((item, index) => (
                        <BidCard
                            key={item._id}
                            auction={item}
                            delay={index + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default LiveAuctions