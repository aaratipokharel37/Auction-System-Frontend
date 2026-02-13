import { createFileRoute } from '@tanstack/react-router'
import Register from '@/components/auth/Register'
export const Route = createFileRoute('/_auth/register')({
  component: () => <Register />,
})