import apiClient from "@/lib/api-client"

/** While this returns a different `activeAuctionId` than the page you are on, placing bids elsewhere is blocked. */
export const getActiveBidAuction = async () => {
    try {
        const res = await apiClient.get("/bid/active-auction")
        return res.data
    } catch (err) {
        throw err instanceof Error ? err : new Error(String(err))
    }
}

export const placeBid = async(id, amount) => {
    try{
        const res = await apiClient.post(`/bid/place/${id}`, {
            amount
        })
        return res.data
    } catch (err) {
        throw err instanceof Error ? err : new Error(String(err))
    }
}