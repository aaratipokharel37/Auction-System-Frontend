import React from 'react';
import { Menu } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    try{
      const token = localStorage.getItem("token")
      const user = localStorage.getItem("user")
      if(token){
        localStorage.removeItem("token")
      }
      if(user){
        localStorage.removeItem("user")
      }
      navigate({ to: '/login' });
    }catch(err){
      toast.error("Unable to logout")
    }
  };

  const handleCreateAuction = () => {
    navigate({ to: '/create-auction' });
  };

  return (
    <nav className="bg-gray-900 sticky top-0 z-50 shadow-md animate-slideDown">
      <div className="">
        <div className="flex justify-between items-center min-h-16 p-4!">
          {/* Logo */}
          <div className="font-display text-3xl font-bold text-white">
            Elite<span className="bg-linear-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent">Auction</span>
          </div>

          {/* Navigation Links */}
          <ul className="hidden md:flex items-center gap-8 lg:gap-12">
            <li>
              <a href="#home" className="font-medium text-white hover:text-gray-100 transition-colors duration-300 relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 gradient-gold group-hover:w-full transition-all duration-300"></span>
              </a>
            </li>
            
            <li>
              <a href="#auctions" className="font-medium text-white hover:text-gray-100 transition-colors duration-300 relative group">
                Live Auctions
                <span className="absolute bottom-0 left-0 w-0 h-0.5 gradient-gold group-hover:w-full transition-all duration-300"></span>
              </a>
            </li>
            
            <li>
              <a href="#categories" className="font-medium text-white hover:text-gray-100 transition-colors duration-300 relative group">
                Categories
                <span className="absolute bottom-0 left-0 w-0 h-0.5 gradient-gold group-hover:w-full transition-all duration-300"></span>
              </a>
            </li>
            
            <li>
              <a href="#how-it-works" className="font-medium text-white hover:text-gray-100 transition-colors duration-300 relative group">
                How It Works
                <span className="absolute bottom-0 left-0 w-0 h-0.5 gradient-gold group-hover:w-full transition-all duration-300"></span>
              </a>
            </li>
            
            <li>
              <a href="#contact" className="font-medium text-white hover:text-gray-100 transition-colors duration-300 relative group">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 gradient-gold group-hover:w-full transition-all duration-300"></span>
              </a>
            </li>
            
           {user?.role === "Auctioneer" && (
  <li>
    <button 
      onClick={handleCreateAuction}
      className="cursor-pointer font-medium text-white hover:text-gray-100 transition-colors duration-300 relative group">
      Create Auction
      <span className="absolute bottom-0 left-0 w-0 h-0.5 gradient-gold group-hover:w-full transition-all duration-300"></span>
    </button>
  </li>
)}

            
            <li>
              <button 
                 onClick={() => handleLogout()} 
                 className="gradient-gold bg-red-400 text-white px-7! py-1! rounded-full font-semibold hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl">
                Log Out
              </button>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button className="md:hidden">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;