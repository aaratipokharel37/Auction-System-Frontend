import apiClient from "@/lib/api-client"

export const register = async(data) => {
    try{
      const res =  await apiClient.post("/user/register", data)
      return res.data
    }catch(err){
        throw new Error(err.message)
    }
}




export const login = async (data) => {
  try {
    const res = await apiClient.post("/user/login", data);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Login failed");
  }
};

export const getMe = async () => {
  const res = await apiClient.get("/user/me");
  return res.data.user;
};