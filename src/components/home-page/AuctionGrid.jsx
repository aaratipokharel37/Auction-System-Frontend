import React from 'react';
import FilterTabs from './FilterTabs';
import BidCard from './BidCard';

const auctionData = [
  {
    id: 1,
    title: '1960s Rolex Submariner',
    category: 'Luxury Watches',
    image: 'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=600&h=400&fit=crop',
    currentBid: 24500,
    totalBids: 47,
    timeLeft: '2h 34m',
    status: 'live'
  },
  {
    id: 2,
    title: 'Contemporary Abstract Canvas',
    category: 'Fine Art',
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&h=400&fit=crop',
    currentBid: 8200,
    totalBids: 23,
    timeLeft: '45m',
    status: 'ending'
  },
  {
    id: 3,
    title: '1967 Ford Mustang Fastback',
    category: 'Classic Cars',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop',
    currentBid: 68000,
    totalBids: 91,
    timeLeft: '5h 18m',
    status: 'live'
  },
  {
    id: 4,
    title: 'Leica M3 Vintage Camera (1954)',
    category: 'Collectibles',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&h=400&fit=crop',
    currentBid: 3400,
    totalBids: 34,
    timeLeft: '1d 4h',
    status: 'live'
  },
  {
    id: 5,
    title: 'Art Deco Diamond Ring (3.2ct)',
    category: 'Jewelry',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop',
    currentBid: 15800,
    totalBids: 56,
    timeLeft: '3h 22m',
    status: 'live'
  },
  {
    id: 6,
    title: 'First Edition Hemingway Collection',
    category: 'Rare Books',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
    currentBid: 5600,
    totalBids: 28,
    timeLeft: '1h 12m',
    status: 'ending'
  }
];

const AuctionGrid = () => {
  return (
    <>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12!">
        <h2 className="font-display text-4xl lg:text-5xl font-bold text-white">
          Featured Auctions
        </h2>
        <FilterTabs />
      </div>

      {/* Bid Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {auctionData.map((auction, index) => (
          <BidCard 
            key={auction.id} 
            auction={auction} 
            delay={index + 1}
          />
        ))}
      </div>
    </>
  );
};

export default AuctionGrid;