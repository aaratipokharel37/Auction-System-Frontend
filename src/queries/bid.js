import apiClient from "@/lib/api-client"

export const placeBid = async(id, amount) => {
    try{
        const res = await apiClient.post(`/bid/place/${id}`, {
            amount
        })
        return res.data
    }catch(err){
        throw new Error(err)
    }
}