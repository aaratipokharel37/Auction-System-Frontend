import React, { useState } from 'react';
import { Clock, Heart } from 'lucide-react';

const BidCard = ({ auction, delay }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [bidPlaced, setBidPlaced] = useState(false);

  const handlePlaceBid = () => {
    setBidPlaced(true);
    setTimeout(() => setBidPlaced(false), 2000);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-scaleIn stagger-${delay} cursor-pointer`}>
      <div className="relative overflow-hidden group">
        <img 
          src={auction.image} 
          alt={auction.title} 
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <span className={`absolute top-4 right-4 px-4! py-2! rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm ${
          auction.status === 'live' 
            ? 'bg-green-600 bg-opacity-90 text-white' 
            : 'bg-red-600 bg-opacity-90 text-white'
        }`}>
          {auction.status === 'live' ? 'Live' : 'Ending Soon'}
        </span>
      </div>
      
      <div className="p-6!">
        <div className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">
          {auction.category}
        </div>
        <h3 className="font-display text-2xl font-semibold text-primary mb-4">
          {auction.title}
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4 p-4! bg-bg-subtle rounded-xl">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
              Current Bid
            </label>
            <div className="font-display text-2xl font-bold text-primary">
              ${auction.currentBid.toLocaleString()}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
              Total Bids
            </label>
            <div className="font-display text-2xl font-bold text-primary">
              {auction.totalBids}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600 text-sm mb-4!">
          <Clock className="w-4 h-4" />
          Ends in <span className="font-semibold text-primary">{auction.timeLeft}</span>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handlePlaceBid}
            className="flex-1 gradient-gold text-white py-3 rounded-xl font-semibold hover:-translate-y-1 transition-all duration-300"
          >
            {bidPlaced ? 'Bid Placed!' : 'Place Bid'}
          </button>
          <button 
            onClick={handleToggleFavorite}
            className={`p-3 border-2 rounded-xl transition-all duration-300 ${
              isFavorite 
                ? 'border-secondary bg-secondary bg-opacity-10' 
                : 'border-gray-200 hover:border-secondary hover:bg-bg-subtle'
            }`}
          >
            <Heart 
              className="w-5 h-5" 
              fill={isFavorite ? '#c9a86a' : 'none'} 
              stroke={isFavorite ? '#c9a86a' : 'currentColor'}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BidCard;