import { getMyAuctions } from '@/queries/auction'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import React from 'react'
import BidCard from '../home-page/BidCard'

const MyAuctions = () => {
    const {data, isLoading, error} = useQuery({
        queryFn: getMyAuctions
    })

    if(isLoading){
        return  (
            <div>
                <Loader2 className='animate-spin'/>
            </div>
        )
    }

    if(error){
        return (
            <p className='text-red-500 font-semibold'>An error occured</p>
        )
    }
  return (
   <div>
    <h1>My Auctions</h1>
    <div className='grid grid-cols-3'>
        {data.items.map((item)=>{
            return <BidCard auction={item} />
        })}
    </div>
   </div>
  )
}

export default MyAuctions