import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from "@/components/ui/sonner"

const queryClient = new QueryClient()


export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}  >
      <Toaster richColors />
      <Outlet />
      <TanStackRouterDevtools />
    </QueryClientProvider >
  ),
})