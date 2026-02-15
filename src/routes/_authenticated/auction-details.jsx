import AuctionDetails from '@/components/auction/AuctionDetails'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/auction-details')({
  component: () => <AuctionDetails />,
})