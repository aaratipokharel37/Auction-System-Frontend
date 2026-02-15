import MyAuctions from '@/components/auction/MyAuctions';
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/my-auctions')({
  beforeLoad: () => {
    const user = JSON.parse(localStorage.getItem("user"));

    // If not Auctioneer → go to home
    if (user.role !== "Auctioneer") {
      throw redirect({
        to: "/",
      });
    }
  },

  component: () => <MyAuctions />,
})