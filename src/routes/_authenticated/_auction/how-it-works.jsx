import HowItWorks from '@/components/auction/HowItWorks'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_auction/how-it-works')({
  component: () => <HowItWorks />,
})