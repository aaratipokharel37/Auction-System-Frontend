import Contact from '@/components/contact/ContactUs'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_auction/contact-us')({
  component: () => <Contact />,
})