import React from 'react'
import { UserPlus, LayoutGrid, Gavel, Trophy, FileCheck, Banknote } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Create Your Account',
    description: 'Register as a Bidder or Auctioneer. Verify your identity and set up your profile to get started on the platform. Bidders compete for items while Auctioneers list and manage their auction lots.',
  },
  {
    step: '02',
    icon: LayoutGrid,
    title: 'Discover Auctions',
    description: 'View all active and upcoming auction listings. Filter by category, condition, or ending soon to find pieces that match your interest.',
  },
  {
    step: '03',
    icon: Gavel,
    title: 'Place Your Bid',
    description: 'Found something exceptional? Each bid must exceed the current highest bid by at least 10%. Track live countdowns and compete in real time.',
  },
  {
    step: '04',
    icon: Trophy,
    title: 'Win the Auction',
    description: 'The highest bidder when the auction closes wins the lot. A notification is sent with the Auctioneer\'s payment details.',
  },
  {
    step: '05',
    icon: Banknote,
    title: 'Commission Payment',
    description: 'Once the Bidder completes payment, the Auctioneer is required to pay 5% of that amount to the platform as commission. Failure to pay restricts future listings.',
  },
  {
    step: '06',
    icon: FileCheck,
    title: 'Submit Proof of Payment',
    description: 'The Auctioneer uploads a screenshot of the commission transfer along with the total amount sent. Once verified by the Administrator, the unpaid commission is cleared.',
  },
]

const HowItWorks = () => {
  return (
    <div className="min-h-screen px-6 lg:px-10 py-12 space-y-20">

      {/* Header */}
      <div className="max-w-2xl">
        <span className="inline-block text-yellow-500 text-sm font-semibold uppercase tracking-widest mb-4">
          The Process
        </span>
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">
          How Elite Auction Works
        </h1>
        <p className="text-gray-400 text-base leading-relaxed">
          From registration to winning — here is everything you need to know about
          how our platform works for both Bidders and Auctioneers.
        </p>
      </div>

      {/* Steps */}
      <div className="relative">
        <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map(({ step, icon: Icon, title, description }) => (
            <div key={step} className="relative group">
              <div className="bg-gray-900 border border-white/5 rounded-2xl p-6 hover:border-yellow-500/20 transition-all duration-300 hover:-translate-y-1 h-full">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-yellow-500/20 font-display text-5xl font-bold leading-none">
                    {step}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                    <Icon className="w-5 h-5 text-yellow-500" />
                  </div>
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5" />
      

      {/* Roles */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-white/5 rounded-2xl p-8 hover:border-indigo-500/20 transition-all duration-300">
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-5">
            <span className="text-xl">🏷️</span>
          </div>
          <h3 className="text-white font-display text-lg font-bold mb-3">For Bidders</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            Register as a Bidder to compete for exceptional pieces. Track your bids in real time and build your collection with confidence.
          </p>
          <ul className="space-y-2">
            {[  
              'Register and login to access the platform',
              'Browse all live and upcoming auctions',
              'Place bids — each must exceed current by 10%',
              'Win the auction and receive payment instructions via email',
              'View complete bidding history per item',
              'Pay the Auctioneer through bank transfer or PayPal',
            ].map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-indigo-400 mt-0.5">✓</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-900 border border-white/5 rounded-2xl p-8 hover:border-yellow-500/20 transition-all duration-300">
          <div className="w-11 h-11 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-5">
            <span className="text-xl">🔨</span>
          </div>
          <h3 className="text-white font-display text-lg font-bold mb-3">For Auctioneers</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            Register as an Auctioneer to list your items. Set your starting bid, define the auction window, and manage your lots from one place.
          </p>
          <ul className="space-y-2">
            {[
              'Register and log in to access auctioneer features',
              'Create an auction with image, category, condition and starting bid',
              'Set a custom start time and end time',
              'Once sold, pay 5%  of the final bid as platform commission',
              'Upload payment screenshot as proof for admin verification',
              'Republish unsold items with new start and end times at no cost',
            ].map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-yellow-400 mt-0.5">✓</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  )
}

export default HowItWorks