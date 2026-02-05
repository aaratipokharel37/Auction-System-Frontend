// src/routes/auth/login.jsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/login')({
  component: () => <div>Login Page (No Navbar)</div>,
})