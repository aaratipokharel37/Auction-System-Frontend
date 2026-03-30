import apiClient from "@/lib/api-client"
import { isAuctionPubliclyVisible } from "@/lib/auction-approval"

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

/** Public marketplace: only listings approved by an admin (see `isAuctionPubliclyVisible`). */
export const getPublicAuctions = async () => {
    const data = await getAllAuctions()
    const items = (data?.items ?? []).filter(isAuctionPubliclyVisible)
    return { ...data, items }
}

export const getAuctionDetails = async(auctionId) => {
    try{
        const response = await apiClient.get(`/auctionitem/auction/${auctionId}`)
        return response.data
    }catch(err){
        throw new Error(err)
    }
}


export const deleteAuction = async (id) => {
    try {
      const response = await apiClient.delete(`/auctionitem/delete/${id}`)
      return response.data
    } catch (err) {
      throw new Error(err)
    }
  }

  
  export const republishAuction = async ({ id, startTime, endTime }) => {
    try {
      const response = await apiClient.put(`/auctionitem/item/republish/${id}`, {
        startTime,
        endTime,
      })
      return response.data
    } catch (err) {
      throw new Error(err)
    }
  }


  export const adminDeleteAuction = async (id) => {
    try {
      const response = await apiClient.delete(`/superadmin/auctionitem/delete/${id}`)
      return response.data
    } catch (err) {
      throw new Error(err)
    }
  }

  export const adminApproveAuction = async (id) => {
    try {
      const response = await apiClient.put(`/superadmin/auctionitem/approve/${id}`)
      return response.data
    } catch (err) {
      throw new Error(err)
    }
  }

  export const adminRejectAuction = async (id) => {
    try {
      const response = await apiClient.put(`/superadmin/auctionitem/reject/${id}`)
      return response.data
    } catch (err) {
      throw new Error(err)
    }
  }
