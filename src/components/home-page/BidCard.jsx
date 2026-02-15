import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const BidCard = ({ auction, delay }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endTime = new Date(auction.endTime);
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft('Ended');
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${seconds}s`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [auction.endTime]);

  const currentBid = auction.currentBid || auction.startingBid;
  const totalBids = auction.bids?.length || 0;

  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-scaleIn stagger-${delay} cursor-pointer`}>
      <div className="relative overflow-hidden group">
        <img 
          src={auction.image?.url || auction.image} 
          alt={auction.title} 
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {auction.condition && (
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 bg-opacity-90 text-white backdrop-blur-sm">
            {auction.condition}
          </span>
        )}
      </div>
      
      <div className="p-6">
        <div className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">
          {auction.category}
        </div>
        <h3 className="font-display text-2xl font-semibold text-primary mb-4">
          {auction.title}
        </h3>
        
        {auction.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {auction.description}
          </p>
        )}
        
        <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
              Current Bid
            </label>
            <div className="font-display text-2xl font-bold text-primary">
              ${currentBid.toLocaleString()}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
              Total Bids
            </label>
            <div className="font-display text-2xl font-bold text-primary">
              {totalBids}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Clock className="w-4 h-4" />
          Ends in <span className="font-semibold text-primary">{timeLeft}</span>
        </div>
      </div>
    </div>
  );
};

export default BidCard;