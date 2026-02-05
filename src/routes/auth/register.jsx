import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/register')({
  component: () => <div>Register Page (No Navbar)</div>,
})