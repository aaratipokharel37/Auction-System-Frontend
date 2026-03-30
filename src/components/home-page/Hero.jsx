import React from 'react';

const Hero = () => {
  return (
    <section className="gradient-primary text-white relative overflow-hidden px-10!" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      {/* Floating Background Element */}
      <div className="absolute -top-1/2 -right-1/4 w-96 h-96 lg:w-[600px] lg:h-[600px] bg-gradient-radial rounded-full animate-float"></div>
      
      <div className="max-w-7xl mx-auto px-6! lg:px-12! relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Hero Content */}
          <div>
            <h1 className="font-display text-4xl lg:text-6xl font-bold leading-tight mb-6! animate-fadeInUp delay-200">
              Discover Exceptional Items at Elite Auctions
            </h1>
            <p className="text-lg lg:text-xl text-gray-200 mb-0! font-light animate-fadeInUp delay-400">
              Join thousands of collectors and enthusiasts bidding on rare art, luxury watches, vintage cars, and exclusive collectibles from around the world.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;