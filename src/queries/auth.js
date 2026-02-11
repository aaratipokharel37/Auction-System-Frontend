import apiClient from "@/lib/api-client"

export const register = async(data) => {
  console.log("Register data:", data);
    try{
      const res =  await apiClient.post("/user/register", data)
      return res.data
    }catch(err){
        console.log("error", err)
        throw new Error(err.message)
    }
}




export const login = async (data) => {
  console.log("Login data:", data); // log form data
  try {
    const res = await apiClient.post("/user/login", data);
    console.log("Login response:", res.data); // log backend response
    return res.data; // should be { token, user }
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Login failed");
  }
};
