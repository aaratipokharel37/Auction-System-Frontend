import React from 'react';
import { Menu } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    try {
      const token = localStorage.getItem("token");
      const u = localStorage.getItem("user");
      if (token) localStorage.removeItem("token");
      if (u) localStorage.removeItem("user");
      navigate({ to: '/login' });
    } catch (err) {
      toast.error("Unable to logout");
    }
  };

  const handleCreateAuction = () => navigate({ to: '/create-auction' });
  const goToMyAuctions = () => navigate({ to: '/my-auctions' });

  // ── Helpers ──────────────────────────────────────────────────────────────
  const getInitials = (name) =>
    (name || "?").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : null;

  const roleMeta = {
    Auctioneer: {
      label: "Auctioneer",
      icon: "🔨",
      className: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0 shadow-[0_0_10px_rgba(234,179,8,0.4)]",
    },
    Bidder: {
      label: "Bidder",
      icon: "🏷️",
      className: "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0 shadow-[0_0_10px_rgba(99,102,241,0.4)]",
    },
  };

  const role = roleMeta[user?.role] || {
    label: user?.role || "Member",
    icon: "👤",
    className: "bg-gradient-to-r from-slate-500 to-slate-600 text-white border-0",
  };

  return (
    <nav className="bg-gray-900 sticky top-0 z-50 shadow-md animate-slideDown">
      <div className="">
        <div className="flex justify-between items-center min-h-16 p-4!">

          {/* Logo */}
          <Link to={'/'}>
            <div className="font-display text-3xl font-bold text-white">
              Elite<span className="bg-linear-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent">Auction</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <ul className="hidden md:flex items-center gap-8 lg:gap-12">

            <li>
              <Link
                to={'/'}
                className="font-medium text-white hover:text-gray-100 transition-colors duration-300 relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 gradient-gold group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>

            <li>
              <Link to="/live-auctions" 
              className="font-medium text-white hover:text-gray-100 transition-colors duration-300 relative group"
              >
                Live Auctions
                <span className="absolute bottom-0 left-0 w-0 h-0.5 gradient-gold group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>

            <li>
              <Link
                to="/how-it-works"
                className="font-medium text-white hover:text-gray-100 transition-colors duration-300 relative group"
                >
                How It Works
                <span className="absolute bottom-0 left-0 w-0 h-0.5 gradient-gold group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>

            <li>
              <Link 
                to="/contact-us"
                className="font-medium text-white hover:text-gray-100 transition-colors duration-300 relative group"
              >
                Contact Us
                <span className="absolute bottom-0 left-0 w-0 h-0.5 gradient-gold group-hover:w-full transition-all duration-300"></span>
              </Link>
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

            {user?.role === "Auctioneer" && (
              <li>
                <button
                  onClick={goToMyAuctions}
                  className="cursor-pointer font-medium text-white hover:text-gray-100 transition-colors duration-300 relative group">
                  My Auctions
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 gradient-gold group-hover:w-full transition-all duration-300"></span>
                </button>
              </li>
            )}

            {/* ── User Profile Avatar + Popover ─────────────────────── */}
            {user && (
              <li>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-br from-yellow-500 to-indigo-500 hover:shadow-[0_0_0_2px_#f59e0b] focus:outline-none transition-shadow duration-200">
                      {user.profileImage?.url ? (
                        <img
                          src={user.profileImage.url}
                          alt={user.userName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-white text-xs font-bold">
                          {getInitials(user.userName)}
                        </div>
                      )}
                    </button>
                  </PopoverTrigger>

                  <PopoverContent
                    align="end"
                    sideOffset={12}
                    className="w-72 p-0 bg-[#141414] border border-white/10 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.8)] overflow-hidden"
                  >
                    {/* Header */}
                    <div className="relative bg-gradient-to-br from-[#1a1200] to-[#0d0d1f] px-5 py-4 border-b border-white/[0.07] overflow-hidden">
                      <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.18),transparent_70%)] pointer-events-none" />
                      <div className="absolute -bottom-8 left-6 w-20 h-20 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.14),transparent_70%)] pointer-events-none" />

                      <div className="relative flex items-center gap-3">
                        {/* Large Avatar */}
                        <div className="shrink-0 p-[2px] rounded-full bg-gradient-to-br from-yellow-500 to-indigo-500">
                          {user.profileImage?.url ? (
                            <img
                              src={user.profileImage.url}
                              alt={user.userName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-white text-lg font-bold">
                              {getInitials(user.userName)}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm truncate">{user.userName}</p>
                          <p className="text-white/40 text-xs truncate mt-0.5">{user.email}</p>
                          <div className="mt-2">
                            <Badge className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 ${role.className}`}>
                              {role.icon} {role.label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats — real fields from user object */}
                    <div className="grid grid-cols-3 divide-x divide-white/[0.06] border-b border-white/[0.06]">
                      <div className="flex flex-col items-center py-3">
                        <span className="text-white text-sm font-bold">{user.auctionsWon ?? 0}</span>
                        <span className="text-white/30 text-[10px] mt-0.5 uppercase tracking-wide">Won</span>
                      </div>
                      <div className="flex flex-col items-center py-3">
                      <span className="text-white text-sm font-bold">NPR {Number(user.moneySpent ?? 0).toLocaleString('en-NP')}</span>
                        <span className="text-white/30 text-[10px] mt-0.5 uppercase tracking-wide">Spent</span>
                      </div>
                      <div className="flex flex-col items-center py-3">
                      <span className="text-yellow-400 text-sm font-bold">NPR {Number(user.unpaidCommission ?? 0).toLocaleString('en-NP')}</span>
                        <span className="text-white/30 text-[10px] mt-0.5 uppercase tracking-wide">Due</span>
                      </div>
                    </div>

                    {/* Info rows */}
                    <div className="px-5 py-3 space-y-0">
                      {user.address && (
                        <div className="flex items-center justify-between py-1.5 border-b border-white/[0.05]">
                          <span className="text-white/40 text-xs">Address</span>
                          <span className="text-white/80 text-xs font-medium capitalize">{user.address}</span>
                        </div>
                      )}
                      {user.phone && (
                        <div className="flex items-center justify-between py-1.5 border-b border-white/[0.05]">
                          <span className="text-white/40 text-xs">Phone</span>
                          <span className="text-white/80 text-xs font-medium">{user.phone}</span>
                        </div>
                      )}
                      {user.createdAt && (
                        <div className="flex items-center justify-between py-1.5 border-b border-white/[0.05]">
                          <span className="text-white/40 text-xs">Member Since</span>
                          <span className="text-white/80 text-xs font-medium">{formatDate(user.createdAt)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between py-1.5">
                        <span className="text-white/40 text-xs">Status</span>
                        <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#4ade80] animate-pulse" />
                          Active
                        </span>
                      </div>
                    </div>

                    {/* Sign Out */}
                    <div className="px-4 pb-4 pt-1 border-t border-white/[0.06]">
                      <button
                        onClick={handleLogout}
                        className="w-full py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:opacity-85 transition-opacity"
                      >
                        Sign Out
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </li>
            )}
            {/* ────────────────────────────────────────────────────────── */}


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