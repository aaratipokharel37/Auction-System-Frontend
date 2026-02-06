import React from 'react'
import Hero from './Hero'
import AuctionGrid from './AuctionGrid'
function HomePage() {
  return (
    <>
    <Hero />
   <div className="px-10! mt-20!">
   <AuctionGrid />
   </div>
    </>
  )
}

export default HomePage