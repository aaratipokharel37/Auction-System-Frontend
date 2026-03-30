import LiveAuctions from '@/components/auction/LiveAuctions';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_auction/live-auctions')({
  component: () => <LiveAuctions />,
})