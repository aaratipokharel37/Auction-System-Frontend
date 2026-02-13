// src/routes/auth/login.jsx
import { createFileRoute } from '@tanstack/react-router'
import Login from '@/components/auth/Login'

export const Route = createFileRoute('/_auth/login')({
  component: () => <Login />,
})