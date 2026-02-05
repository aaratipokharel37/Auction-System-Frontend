import { Outlet, createFileRoute } from '@tanstack/react-router'
import Navbar from '@/components/shared/Navbar'

export const Route = createFileRoute('/_authenticated')({
  component: () => (
    <>
      <Navbar />
      <Outlet />
    </>
  ),
})