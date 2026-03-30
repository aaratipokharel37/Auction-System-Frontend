import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import Navbar from '@/components/shared/Navbar'
import { useEffect } from 'react'
import AdminDashboard from '@/components/admin/dashboard/AdminDashboard'

export const Route = createFileRoute('/_authenticated')({
  component: () => {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem("user"));
    const isUserSuperAdmin = user?.role === "Super Admin";
    if (isUserSuperAdmin) {
      return <AdminDashboard />;
    }
    useEffect(() => {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate({ to: '/login' }) // redirect to login if not authenticated
      }
    }, [navigate])

    return (
      <>
        <Navbar />
        <Outlet />
      </>
    )
  },
})
