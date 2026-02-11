import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import Navbar from '@/components/shared/Navbar'
import { useEffect } from 'react'

export const Route = createFileRoute('/_authenticated')({
  component: () => {
    const navigate = useNavigate()

    useEffect(() => {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate({ to: '/auth/login' }) // redirect to login if not authenticated
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
