import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MapPin,
  Phone,
  Mail,
  Award,
  ShieldCheck,
  Truck,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function Footer() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    showToast('Subscribed to the CraftLK Artisan Journal!', 'success');
  };

  return (
    <footer className="bg-[#181513] text-stone-300 border-t border-stone-800 relative overflow-hidden">
      {/* Subtle Top Gradient Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-[#A3481D] to-amber-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 mb-12 border-b border-stone-800/90">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-900/60 border border-stone-800/80">
            <div className="w-12 h-12 rounded-2xl bg-[#A3481D]/20 flex items-center justify-center text-[#E87A48] shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm sm:text-base">
                Authentic Sri Lankan Crafts
              </h4>
              <p className="text-stone-400 text-xs mt-0.5 leading-relaxed">
                100% verified handmade by local cottage artisans and master guilds.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-900/60 border border-stone-800/80">
            <div className="w-12 h-12 rounded-2xl bg-[#A3481D]/20 flex items-center justify-center text-[#E87A48] shrink-0">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm sm:text-base">
                Islandwide Tracked Delivery
              </h4>
              <p className="text-stone-400 text-xs mt-0.5 leading-relaxed">
                Carefully packaged fragile crafts delivered across all 25 districts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-900/60 border border-stone-800/80">
            <div className="w-12 h-12 rounded-2xl bg-[#A3481D]/20 flex items-center justify-center text-[#E87A48] shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm sm:text-base">
                100% Direct Fair Trade
              </h4>
              <p className="text-stone-400 text-xs mt-0.5 leading-relaxed">
                Artisans set their own prices and receive direct earnings.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <img
                src="/logo-horizontal-dark.png"
                alt="CraftLK — Sri Lankan Handmade Treasures"
                className="h-13 w-auto object-contain"
              />
            </Link>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              CraftLK is Sri Lanka's dedicated multi-vendor marketplace connecting heritage craft producers with conscious collectors across the island and beyond.
            </p>

            {/* Mini Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Join the Artisan Journal
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-3.5 py-2.5 rounded-xl">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Thank you for subscribing to our craft stories!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="flex-1 bg-stone-900 border border-stone-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:bg-stone-900"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#A3481D] hover:bg-[#8B3B14] text-white text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4">
              Marketplace
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  to="/shop"
                  className="text-stone-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  All Handicrafts
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="text-stone-400 hover:text-amber-400 transition-colors"
                >
                  Craft Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/artisans"
                  className="text-stone-400 hover:text-amber-400 transition-colors"
                >
                  Artisan Directory
                </Link>
              </li>
              <li>
                <Link
                  to="/auth?tab=register&role=seller"
                  className="text-stone-400 hover:text-amber-400 transition-colors"
                >
                  Open an Artisan Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-stone-400 hover:text-amber-400 transition-colors"
                >
                  Our Mission & Story
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Crafts */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4">
              Heritage Traditions
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  to="/shop?category=batik"
                  className="text-stone-400 hover:text-amber-400 transition-colors"
                >
                  Kandyan Batik & Handloom
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=pottery"
                  className="text-stone-400 hover:text-amber-400 transition-colors"
                >
                  Kelani Terracotta Pottery
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=wooden-handicrafts"
                  className="text-stone-400 hover:text-amber-400 transition-colors"
                >
                  Ambalangoda Masks & Woodwork
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=jewellery"
                  className="text-stone-400 hover:text-amber-400 transition-colors"
                >
                  Ceylon Silver & Moonstone
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=woven-products"
                  className="text-stone-400 hover:text-amber-400 transition-colors"
                >
                  Dumbara Cane & Reed Weaving
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4">
              Contact & Academic Info
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-stone-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#E87A48] shrink-0 mt-0.5" />
                <span>
                  Faculty of Technology, South Eastern University of Sri Lanka (SEUSL)
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#E87A48] shrink-0" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#E87A48] shrink-0" />
                <span>support@craftlk.com</span>
              </li>
            </ul>

            <div className="mt-4 p-3 rounded-xl bg-stone-900/90 border border-stone-800 text-[11px] text-stone-400">
              <span className="text-amber-400 font-bold block mb-0.5">
                SEUSL CIS 22032 Project
              </span>
              Engineered by Group 7 • Multi-Vendor E-Commerce Architecture
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} CraftLK Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="px-2.5 py-1 rounded-md bg-stone-900 border border-stone-800 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Cash on Delivery
            </span>
            <span className="px-2.5 py-1 rounded-md bg-stone-900 border border-stone-800 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              LKR Pricing
            </span>
            <p className="flex items-center gap-1 text-stone-400">
              Handcrafted with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> in Sri Lanka
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
