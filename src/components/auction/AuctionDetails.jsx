import { getAuctionDetails } from '@/queries/auction'
import { placeBid } from '@/queries/bid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { Loader2, Clock, Heart, Gavel, TrendingUp, User, Calendar, Package } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import PrimaryButton from '../shared/PrimaryButton'

const AuctionDetails = () => {
  const queryClient = useQueryClient()
  const { auctionId } = useParams({ from: '/_authenticated/_auction/auction/$auctionId' })
  const { data: auctionDetails, isLoading, error } = useQuery({
    queryFn: () => getAuctionDetails(auctionId),
    queryKey: ['auction-details', auctionId],
    enabled: !!auctionId
  })

  const { mutate: place, isPending } = useMutation({
    mutationFn: (amount) => placeBid(auctionId, amount),
    onSuccess: () => {
      toast.success('Bid placed successfully!')
      queryClient.invalidateQueries({ queryKey: ['auction-details', auctionId] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const [timeLeft, setTimeLeft] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [bidAmount, setBidAmount] = useState("")

  useEffect(() => {
    if (!auctionDetails?.auctionItem?.endTime) return

    const calculateTimeLeft = () => {
      const now = new Date()
      const endTime = new Date(auctionDetails.auctionItem.endTime)
      const difference = endTime - now

      if (difference <= 0) {
        setTimeLeft('Auction Ended')
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`)
      } else {
        setTimeLeft(`${seconds}s`)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [auctionDetails])

  const user = JSON.parse(localStorage.getItem("user"));
  const isBidder = user.role === "Bidder"

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className='animate-spin w-8 h-8 text-yellow-600' />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-lg">{error.message}</div>
      </div>
    )
  }

  const auction = auctionDetails?.auctionItem
  const bidders = auctionDetails?.bidders || []

  if (!auction) {
    return <div className="text-center py-12">Auction not found</div>
  }

  const currentBid = auction.currentBid || auction.startingBid
  const totalBids = auction.bids?.length || 0
  const minimumBid = currentBid + (currentBid * 0.01) // 1% increment
  const isButtonDisabled = isPending || !bidAmount || parseFloat(bidAmount) < minimumBid

  const handlePlaceBid = (e) => {
    e.preventDefault()
    place(parseFloat(bidAmount))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = () => {
    const now = new Date()
    const endTime = new Date(auction.endTime)
    const difference = endTime - now
    const hoursLeft = difference / (1000 * 60 * 60)

    if (difference <= 0) return 'bg-gray-600'
    if (hoursLeft <= 1) return 'bg-red-600'
    return 'bg-green-600'
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          {/* Image Section */}
          <div className='bg-white rounded-2xl overflow-hidden shadow-xl'>
            <div className='relative'>
              <img
                src={auction.image?.url}
                alt={auction.title}
                className='w-full h-[500px] object-cover'
              />
              <div className='absolute top-4 right-4 flex gap-2'>
                <span className={`${getStatusColor()} text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm bg-opacity-90`}>
                  {timeLeft === 'Auction Ended' ? 'Ended' : 'Live'}
                </span>
                <span className='bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm bg-opacity-90'>
                  {auction.condition}
                </span>
              </div>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className='absolute top-4 left-4 p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform'
              >
                <Heart
                  className="w-6 h-6"
                  fill={isFavorite ? '#ca8a04' : 'none'}
                  stroke={isFavorite ? '#ca8a04' : 'currentColor'}
                />
              </button>
            </div>
          </div>

          {/* Bid Section */}
          <div className='space-y-6'>
            <div className='bg-white rounded-2xl p-8 shadow-xl'>
              <div className='text-sm text-gray-500 uppercase tracking-wider mb-2'>
                {auction.category}
              </div>
              <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                {auction.title}
              </h1>

              <div className='flex items-center gap-4 mb-6 pb-6 border-b'>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Clock className='w-5 h-5' />
                  <span className='font-semibold text-lg text-yellow-600'>{timeLeft}</span>
                </div>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Gavel className='w-5 h-5' />
                  <span className='font-semibold'>{totalBids} Bids</span>
                </div>
              </div>

              {/* Current Bid */}
              <div className='bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 mb-6'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm text-gray-600 uppercase tracking-wider'>
                    {totalBids > 0 ? 'Current Bid' : 'Starting Bid'}
                  </span>
                  <TrendingUp className='w-5 h-5 text-green-600' />
                </div>
                <div className='text-4xl font-bold text-gray-900'>
                  ${currentBid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                {totalBids > 0 && (
                  <div className='text-sm text-gray-600 mt-2'>
                    Minimum next bid: ${minimumBid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                )}
              </div>

              {/* Bid Form */}
              {timeLeft !== 'Auction Ended' && isBidder && (
                <form onSubmit={handlePlaceBid} className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Your Bid Amount
                    </label>
                    <div className='relative'>
                      <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-semibold'>
                        $
                      </span>
                      <input
                        type='number'
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={minimumBid.toFixed(2)}
                        step='0.01'
                        min={minimumBid}
                        className='w-full pl-8 pr-4 py-4 border-2 border-gray-200 rounded-xl text-lg font-semibold focus:border-yellow-600 focus:outline-none transition-colors'
                      />
                    </div>
                  </div>
                  <PrimaryButton type='submit' disabled={isButtonDisabled}>Place Bid</PrimaryButton>
                </form>
              )}

              {timeLeft === 'Auction Ended' && (
                <div className='bg-gray-100 text-gray-600 py-4 rounded-xl text-center font-semibold'>
                  This auction has ended
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description and Details */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 bg-white rounded-2xl p-8 shadow-xl'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>Description</h2>
            <p className='text-gray-700 leading-relaxed whitespace-pre-line'>
              {auction.description}
            </p>
          </div>

          <div className='bg-white rounded-2xl p-8 shadow-xl'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>Auction Details</h2>
            <div className='space-y-4'>
              <div className='flex items-start gap-3'>
                <Package className='w-5 h-5 text-gray-400 mt-1' />
                <div>
                  <div className='text-sm text-gray-500'>Condition</div>
                  <div className='font-semibold text-gray-900'>{auction.condition}</div>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <Calendar className='w-5 h-5 text-gray-400 mt-1' />
                <div>
                  <div className='text-sm text-gray-500'>Start Time</div>
                  <div className='font-semibold text-gray-900'>{formatDate(auction.startTime)}</div>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <Calendar className='w-5 h-5 text-gray-400 mt-1' />
                <div>
                  <div className='text-sm text-gray-500'>End Time</div>
                  <div className='font-semibold text-gray-900'>{formatDate(auction.endTime)}</div>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <Gavel className='w-5 h-5 text-gray-400 mt-1' />
                <div>
                  <div className='text-sm text-gray-500'>Total Bids</div>
                  <div className='font-semibold text-gray-900'>{totalBids}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bidding History */}
        {bidders.length > 0 && (
          <div className='mt-8 bg-white rounded-2xl p-8 shadow-xl'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>Bidding History</h2>
            <div className='space-y-3'>
              {bidders.map((bidder, index) => (
                <div key={index} className='flex items-center justify-between p-4 bg-gray-50 rounded-xl'>
                  <div className='flex items-center gap-3'>
                    {bidder.profileImage ? (
                      <img
                        src={bidder.profileImage}
                        alt={bidder.userName || 'Anonymous'}
                        className='w-8 h-8 rounded-full object-cover'
                      />
                    ) : (
                      <User className='w-5 h-5 text-gray-400' />
                    )}
                    <span className='font-semibold text-gray-900'>{bidder.userName || 'Anonymous'}</span>
                  </div>
                  <span className='font-bold text-yellow-600'>${bidder.amount?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuctionDetails