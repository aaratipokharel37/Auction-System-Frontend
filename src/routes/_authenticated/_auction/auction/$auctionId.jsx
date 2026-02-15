import AuctionDetails from '@/components/auction/AuctionDetails'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_auction/auction/$auctionId')({
  component: () => <AuctionDetails />,
})