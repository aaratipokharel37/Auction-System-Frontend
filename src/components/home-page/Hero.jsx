import React from 'react';

const Hero = () => {
  return (
    <section className="gradient-primary text-white py-20! lg:py-24! relative overflow-hidden px-10!">
      {/* Floating Background Element */}
      <div className="absolute -top-1/2 -right-1/4 w-96 h-96 lg:w-[600px] lg:h-[600px] bg-gradient-radial rounded-full animate-float"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Hero Content */}
          <div>
            <h1 className="font-display text-4xl lg:text-6xl font-bold leading-tight mb-6 animate-fadeInUp delay-200">
              Discover Exceptional Items at Elite Auctions
            </h1>
            <p className="text-lg lg:text-xl text-gray-200 mb-10 font-light animate-fadeInUp delay-400">
              Join thousands of collectors and enthusiasts bidding on rare art, luxury watches, vintage cars, and exclusive collectibles from around the world.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 lg:gap-8 animate-fadeInUp delay-600">
              <div>
                <div className="font-display text-3xl lg:text-5xl font-bold text-secondary">12K+</div>
                <div className="text-sm lg:text-base text-gray-300 font-light mt-1">Active Bidders</div>
              </div>
              <div>
                <div className="font-display text-3xl lg:text-5xl font-bold text-secondary">500+</div>
                <div className="text-sm lg:text-base text-gray-300 font-light mt-1">Live Auctions</div>
              </div>
              <div>
                <div className="font-display text-3xl lg:text-5xl font-bold text-secondary">$2.5M</div>
                <div className="text-sm lg:text-base text-gray-300 font-light mt-1">Avg. Monthly</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;