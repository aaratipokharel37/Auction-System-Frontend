import CreateAuction from '@/components/auction/CreateAuction'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/create-auction')({
  beforeLoad: () => {
    const user = JSON.parse(localStorage.getItem("user"));

    // If not Auctioneer → go to home
    if (user.role !== "Auctioneer") {
      throw redirect({
        to: "/",
      });
    }
  },

  component: () => <CreateAuction />,
})