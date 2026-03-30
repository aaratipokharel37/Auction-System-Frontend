// src/queries/admin/me.js
import { useQuery } from "@tanstack/react-query"
import apiClient from "@/lib/api-client"

const getMe = async () => {
  try {
    const response = await apiClient.get("/user/me")
    return response.data.user
  } catch (err) {
    throw new Error(err)
  }
}

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: 0,
    gcTime: 0
  })
}