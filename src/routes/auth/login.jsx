// src/routes/auth/login.jsx
import { createFileRoute } from '@tanstack/react-router'
import Login from '@/components/auth/Login'

export const Route = createFileRoute('/auth/login')({
  component: () => <Login />,
})