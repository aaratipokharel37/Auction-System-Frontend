import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/_auth')({
  component: () => {
    const navigate = useNavigate()

    useEffect(() => {
      const token = localStorage.getItem('token')
      if (token) {
        navigate({ to: '/' }) // redirect to homepage if authenticated
      }
    }, [navigate])

    return (
      <>
        <Outlet />
      </>
    )
  },
})
