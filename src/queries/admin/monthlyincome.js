import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

const fetchMonthlyRevenue = async () => {
  const response = await apiClient.get("/superadmin/monthlyincome");
  return response.data.totalMonthlyRevenue; // number[12]
};

export const useMonthlyRevenue = () => {
  return useQuery({
    queryKey: ["monthlyRevenue"],
    queryFn: fetchMonthlyRevenue,
    staleTime: 5 * 60 * 1000,
  });
};