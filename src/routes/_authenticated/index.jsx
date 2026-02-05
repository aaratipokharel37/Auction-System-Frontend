import HomePage from '@/components/home-page/HomePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  component: () => <HomePage />,
})