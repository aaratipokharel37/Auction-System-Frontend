import { getAuctionDetails, deleteAuction, republishAuction } from '@/queries/auction'
import { getMyPaymentProofs } from '@/queries/admin/paymentproofs'
import { getActiveBidAuction, placeBid } from '@/queries/bid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams, useRouter } from '@tanstack/react-router'
import { Loader2, Clock, Heart, Gavel, TrendingUp, User, Calendar, Package } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import PrimaryButton from '../shared/PrimaryButton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createPaymentProof } from '@/queries/admin/paymentproofs'
import { useMe } from '@/queries/admin/me'
import { isAuctionPubliclyVisible, getApprovalState, approvalLabel } from '@/lib/auction-approval'

// ─── Republish Dialog ───────────────────────────────────────────
const RepublishDialog = ({ auctionId }) => {
  const [open, setOpen] = useState(false)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const queryClient = useQueryClient()

  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  const minDateTime = now.toISOString().slice(0, 16)

  const { mutate, isPending } = useMutation({
    mutationFn: ({ startTime, endTime }) =>
      republishAuction({ id: auctionId, startTime, endTime }),
    onSuccess: (data) => {
      toast.success(data.message || 'Auction republished successfully!')
      queryClient.invalidateQueries({ queryKey: ['auction-details', auctionId] })
      queryClient.invalidateQueries({ queryKey: ['my-auctions'] })
      queryClient.invalidateQueries({ queryKey: ['public-auctions'] })
      queryClient.invalidateQueries({ queryKey: ['all-auctions'] })
      setOpen(false)
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to republish auction')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const start = new Date(startTime)
    const end = new Date(endTime)
    if (start >= end) {
      toast.error('End time must be after start time')
      return
    }
    mutate({ startTime: start, endTime: end })
  }




  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md">
          Republish Auction
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle>Republish Auction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">New Start Time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              min={minDateTime}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">New End Time</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              min={minDateTime}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <DialogFooter className="pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!startTime || !endTime || isPending}
              className="px-4 py-2 rounded-lg bg-yellow-500 text-sm font-semibold text-black hover:bg-yellow-400 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isPending && (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              )}
              {isPending ? 'Republishing...' : 'Republish'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Upload Payment Proof Dialog ────────────────────────────────
const UploadPaymentProofDialog = ({ open, onOpenChange, amount, onUpload, isUploading, auctionId }) => {
  const [file, setFile] = useState(null)
  const [comment, setComment] = useState('')
  const commissionAmount = Number(amount) * 0.05

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!file || !comment.trim()) return
    const formData = new FormData()
    formData.append('proof', file)
    formData.append('comment', comment.trim())
    formData.append('amount', commissionAmount)
    formData.append('auctionId', auctionId)
    onUpload(formData)
  }

  const handleOpenChange = (next) => {
    if (!next) { setFile(null); setComment('') }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-yellow-500 text-white hover:bg-yellow-600 transition-colors shadow-md">
          Upload Payment Proof
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle>Upload Payment Proof</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Amount (5% of current bid)</label>
            <input
              type="text"
              value={`NPR ${commissionAmount.toLocaleString('en-NP', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              readOnly
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50 text-gray-700"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Payment Proof (file)</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-700"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Comment</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Add details about this payment"
            />
          </div>
          <DialogFooter className="pt-2">
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || !comment.trim() || isUploading}
              className="px-4 py-2 rounded-lg bg-yellow-500 text-sm font-semibold text-white hover:bg-yellow-600 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isUploading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isUploading ? 'Uploading...' : 'Submit Proof'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Component ──────────────────────────────────────────────
const AuctionDetails = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { auctionId } = useParams({ from: '/_authenticated/_auction/auction/$auctionId' })

  // ✅ useMe instead of localStorage
  const { data: me } = useMe()
  console.log("me", me);
  const user = JSON.parse(localStorage.getItem("user"))

  
  const isBidder = user?.role === 'Bidder'
  const isAuctioneer = user?.role === 'Auctioneer'

  const { data: auctionDetails, isLoading, error } = useQuery({
    queryFn: () => getAuctionDetails(auctionId),
    queryKey: ['auction-details', auctionId],
    enabled: !!auctionId,
  })

  const { data: activeBidContext } = useQuery({
    queryKey: ['active-bid-auction'],
    queryFn: getActiveBidAuction,
    enabled: !!auctionId && isBidder,
    refetchInterval: 8000,
  })

  const { mutate: place, isPending } = useMutation({
    mutationFn: (amount) => placeBid(auctionId, amount),
    onSuccess: () => {
      toast.success('Bid placed successfully!')
      queryClient.invalidateQueries({ queryKey: ['auction-details', auctionId] })
      queryClient.invalidateQueries({ queryKey: ['active-bid-auction'] })
    },
    onError: (error) => toast.error(error.message),
  })

  const { mutate: uploadProof, isPending: isUploading } = useMutation({
    mutationFn: createPaymentProof,
    onSuccess: () => {
      toast.success('Payment proof uploaded successfully')
      setJustSubmitted(true)
      queryClient.invalidateQueries({ queryKey: ['me'] })
      queryClient.invalidateQueries({ queryKey: ['my-payment-proofs'] })
      setIsUploadOpen(false)
    },
    onError: (error) => toast.error(error.message || 'Failed to upload payment proof'),
  })

  const { mutate: removeAuction, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteAuction(auctionId),
    onSuccess: (data) => {
      toast.success(data?.message || 'Auction deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['my-auctions'] })
      queryClient.invalidateQueries({ queryKey: ['auction-items'] })
      queryClient.invalidateQueries({ queryKey: ['public-auctions'] })
      queryClient.invalidateQueries({ queryKey: ['all-auctions'] })
      router.navigate({ to: '/my-auctions' })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete auction')
    },
  })

  const auction = auctionDetails?.auctionItem
  const isMyAuction = isAuctioneer && user?._id === auction?.createdBy

  const { data: proofsData, isPending: isProofsLoading } = useQuery({
    queryKey: ['my-payment-proofs', auctionId],
    queryFn: () => getMyPaymentProofs(auctionId),
    enabled: isAuctioneer && !!isMyAuction,
  })

  const myProofs = proofsData?.paymentProofs || []
  const latestProof = myProofs[myProofs.length - 1]
  const isPendingProof = latestProof?.status === 'Pending'
  const isApprovedProof = latestProof?.status === 'Approved' || latestProof?.status === 'Settled'
  const isRejectedProof = latestProof?.status === 'Rejected'

  const [timeLeft, setTimeLeft] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [bidAmount, setBidAmount] = useState('')
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [justSubmitted, setJustSubmitted] = useState(false)

  useEffect(() => {
    if (!auctionDetails?.auctionItem?.endTime) return
    const calculateTimeLeft = () => {
      const now = new Date()
      const endTime = new Date(auctionDetails.auctionItem.endTime)
      const difference = endTime - now
      if (difference <= 0) { setTimeLeft('Auction Ended'); return }
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)
      if (days > 0) setTimeLeft(`${days}d ${hours}h ${minutes}m`)
      else if (hours > 0) setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      else if (minutes > 0) setTimeLeft(`${minutes}m ${seconds}s`)
      else setTimeLeft(`${seconds}s`)
    }
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [auctionDetails])

  const isEndedPreview =
    auctionDetails?.auctionItem?.endTime &&
    new Date(auctionDetails.auctionItem.endTime) - new Date() <= 0

  useEffect(() => {
    if (isEndedPreview) {
      queryClient.invalidateQueries({ queryKey: ['active-bid-auction'] })
    }
  }, [isEndedPreview, queryClient])

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className='animate-spin w-8 h-8 text-yellow-600' />
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-red-600 text-lg">{error.message}</div>
    </div>
  )

  const bidders = auctionDetails?.bidders || []



  if (!auction) return <div className="text-center py-12">Auction not found</div>

  // ✅ useMe for ownership check
  const isSuperAdmin = user?.role === 'Super Admin'
  const publiclyVisible = isAuctionPubliclyVisible(auction)
  const approvalState = getApprovalState(auction)

  if (!publiclyVisible && !isMyAuction && !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md text-center border border-gray-100">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Listing unavailable</h1>
          <p className="text-gray-600 text-sm mb-6">
            This item is not listed publicly yet or is no longer available. If you are the seller, check
            My Auctions for the approval status.
          </p>
          <PrimaryButton type="button" onClick={() => router.navigate({ to: '/' })}>
            Back to home
          </PrimaryButton>
        </div>
      </div>
    )
  }

  const currentBid = auction.currentBid || auction.startingBid
  const totalBids = auction.bids?.length || 0
  const minimumBid = currentBid + (currentBid * 0.1)
  const isEnded = timeLeft === 'Auction Ended'
  const lockedOnAnother =
    isBidder &&
    !isEnded &&
    activeBidContext?.activeAuctionId &&
    activeBidContext.activeAuctionId !== auctionId
  const isButtonDisabled =
    isPending || !bidAmount || parseFloat(bidAmount) < minimumBid || lockedOnAnother

  const handlePlaceBid = (e) => {
    e.preventDefault()
    place(parseFloat(bidAmount))
  }

  const formatDate = (dateString) => new Date(dateString).toLocaleString('en-NP', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  const getStatusColor = () => {
    const difference = new Date(auction.endTime) - new Date()
    if (difference <= 0) return 'bg-gray-600'
    if (difference / (1000 * 60 * 60) <= 1) return 'bg-red-600'
    return 'bg-green-600'
  }

  console.log("isBidder", isBidder)
  console.log("is Ended", isEnded)

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4'>
      <div className='max-w-7xl mx-auto'>
        {!publiclyVisible && (isMyAuction || isSuperAdmin) && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm font-medium ${
              approvalState === 'pending'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            {approvalState === 'pending'
              ? 'This listing is waiting for an admin to approve it. It will appear on the home page once approved.'
              : `Moderation: ${approvalLabel(approvalState)}. This listing is not shown on the public catalog.`}
          </div>
        )}

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>

          {/* Image Section */}
          <div className='bg-white rounded-2xl overflow-hidden shadow-xl'>
            <div className='relative'>
              <img src={auction.image?.url} alt={auction.title} className='w-full h-[500px] object-cover' />
              <div className='absolute top-4 right-4 flex gap-2'>
                <span className={`${getStatusColor()} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
                  {isEnded ? 'Ended' : 'Live'}
                </span>
                <span className='bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold'>
                  {auction.condition}
                </span>
              </div>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className='absolute top-4 left-4 p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform'
              >
                <Heart className="w-6 h-6" fill={isFavorite ? '#ca8a04' : 'none'} stroke={isFavorite ? '#ca8a04' : 'currentColor'} />
              </button>
            </div>
          </div>

          {/* Bid Section */}
          <div className='space-y-6'>
            <div className='bg-white rounded-2xl p-8 shadow-xl'>
              <div className='text-sm text-gray-500 uppercase tracking-wider mb-2'>{auction.category}</div>
              <h1 className='text-4xl font-bold text-gray-900 mb-4'>{auction.title}</h1>

              <div className='flex items-center gap-4 mb-6 pb-6 border-b'>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Clock className='w-5 h-5' />
                  <span className='font-semibold text-lg text-yellow-600'>{timeLeft}</span>
                </div>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Gavel className='w-5 h-5' />
                  <span className='font-semibold'>{totalBids} Bids</span>
                </div>

                {/* Delete auction – only owner, while auction is live */}
                {isMyAuction && !isEnded && (
                  <button
                    type="button"
                    onClick={() => removeAuction()}
                    disabled={isDeleting}
                    className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
                  >
                    {isDeleting && (
                      <span className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    )}
                    {isDeleting ? 'Deleting...' : 'Delete Auction'}
                  </button>
                )}
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
                  NPR {currentBid.toLocaleString('en-NP', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                {totalBids > 0 && (
                  <div className='text-sm text-gray-600 mt-2'>
                    Minimum next bid: NPR {minimumBid.toLocaleString('en-NP', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                )}
              </div>

              {/* ✅ Upload Payment Proof — only owner, after auction ends, before commission paid */}
              {isMyAuction && isEnded && auction.currentBid >= auction.startingBid && (
                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-2">
                    { isProofsLoading 
                        ? 'Checking payment status...'
                        : (isApprovedProof || (me?.unpaidCommission === 0 && !isPendingProof && !isRejectedProof && myProofs.length > 0)) 
                        ? 'Your commission payment for this session is settled.' 
                        : isPendingProof || justSubmitted
                        ? 'Your payment proof is under review by our team.'
                        : isRejectedProof
                        ? 'Your previous payment proof was rejected. Please upload a new proof.'
                        : 'The auction has ended. Upload your commission payment proof.' }
                  </p>
                  
                  { isProofsLoading ? (
                    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 shadow-sm">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                      <span className="text-sm font-bold text-gray-600">
                        Checking Status
                      </span>
                    </div>
                  ) : isApprovedProof || (me?.unpaidCommission === 0 && !isPendingProof && !isRejectedProof && myProofs.length > 0) ? (
                    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-green-50 border border-green-100 shadow-sm">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-green-800">
                        {latestProof?.status === 'Approved' ? 'Payment Approved' : 'Payment Done'}
                      </span>
                    </div>
                  ) : isPendingProof || justSubmitted ? (
                    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-amber-50 border border-amber-100 shadow-sm">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
                        <Clock className="w-5 h-5 animate-pulse" />
                      </div>
                      <span className="text-sm font-bold text-amber-800">
                        Payment Pending
                      </span>
                    </div>
                  ) : (
                    <UploadPaymentProofDialog
                      open={isUploadOpen}
                      onOpenChange={setIsUploadOpen}
                      amount={currentBid}
                      onUpload={uploadProof}
                      isUploading={isUploading}
                      auctionId={auctionId}
                    />
                  )}
                </div>
              )}

              {/* ✅ Republish — only owner, after auction ends */}
              {isMyAuction && isEnded && (
                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-2">
                    Want to run this auction again? Set a new start and end time.
                  </p>
                  <RepublishDialog auctionId={auctionId} />
                </div>
              )}

              {/* Bid Form — only bidders, while auction is live and listing is approved */}
              {!isEnded && isBidder && publiclyVisible && (
                <form onSubmit={handlePlaceBid} className='space-y-4'>
                  {lockedOnAnother && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                      You already have an active bid on another listing
                      {activeBidContext?.title ? ` (“${activeBidContext.title}”)` : ''}. You can bid here as soon as that
                      auction ends (this page refreshes the lock every few seconds).
                      {activeBidContext?.activeAuctionId && (
                        <>
                          {' '}
                          <Link
                            to={`/auction/${activeBidContext.activeAuctionId}`}
                            className="font-semibold text-amber-900 underline"
                          >
                            Open that auction
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Your Bid Amount</label>
                    <div className='relative'>
                      <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-semibold'>NPR</span>
                      <input
                        type='number'
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={minimumBid.toFixed(2)}
                        step='0.01'
                        min={minimumBid}
                        className='w-full pl-16 pr-4 py-4 border-2 border-gray-200 rounded-xl text-lg font-semibold focus:border-yellow-600 focus:outline-none transition-colors'
                      />
                    </div>
                  </div>
                  <PrimaryButton type='submit' disabled={isButtonDisabled}>Place Bid</PrimaryButton>
                </form>
              )}

              {isEnded && !isMyAuction && (
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
            <p className='text-gray-700 leading-relaxed whitespace-pre-line'>{auction.description}</p>
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
                      <img src={bidder.profileImage} alt={bidder.userName || 'Anonymous'} className='w-8 h-8 rounded-full object-cover' />
                    ) : (
                      <User className='w-5 h-5 text-gray-400' />
                    )}
                    <span className='font-semibold text-gray-900'>{bidder.userName || 'Anonymous'}</span>
                  </div>
                  <span className='font-bold text-yellow-600'>NPR {bidder.amount?.toLocaleString('en-NP')}</span>
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