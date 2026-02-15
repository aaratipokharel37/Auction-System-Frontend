import apiClient from "@/lib/api-client"

export const createAuction = async(payload) => {
    try{
        const response = await apiClient.post("/auctionitem/create", payload)
        return response.data
    }catch(err){
        throw new Error(err)
    }
}

export const getMyAuctions = async() => {
    try{
        const response = await apiClient.get("/auctionitem/myitems")
        return response.data
    }catch(err){
        throw new Error(err)
    }
}

export const getAllAuctions = async() => {
    try{
        const response = await apiClient.get(`/auctionitem/allItems`)
        return response.data
    }catch(err){
        throw new Error(err)
    }
}

export const getAuctionDetails = async(auctionId) => {
    try{
        const response = await apiClient.get(`/auctionitem/auction/${auctionId}`)
        return response.data
    }catch(err){
        throw new Error(err)
    }
}