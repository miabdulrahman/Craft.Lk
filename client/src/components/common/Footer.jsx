import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Phone, Mail, Award, ShieldCheck, Truck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1C1917] text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 mb-12 border-b border-stone-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#A3481D]/20 flex items-center justify-center text-[#E06D38] shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Authentic Sri Lankan Crafts</h4>
              <p className="text-stone-400 text-xs mt-0.5">100% verified handmade by local cottage artisans.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#A3481D]/20 flex items-center justify-center text-[#E06D38] shrink-0">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Islandwide Delivery</h4>
              <p className="text-stone-400 text-xs mt-0.5">Secure, tracked shipping straight to your doorstep.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#A3481D]/20 flex items-center justify-center text-[#E06D38] shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Direct Artisan Support</h4>
              <p className="text-stone-400 text-xs mt-0.5">Fair trade empowering rural craft communities.</p>
            </div>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.svg" alt="CraftLK" className="h-8 brightness-0 invert" />
            </div>
            <p className="text-stone-400 text-sm leading-relaxed mb-4">
              CraftLK is Sri Lanka's dedicated multi-vendor marketplace connecting heritage craft producers with conscious customers worldwide.
            </p>
            <div className="text-xs text-stone-500">
              Developed as an academic enterprise system for SEUSL CIS 22032 by Group 7.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Marketplace</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/categories" className="hover:text-white transition-colors">Categories</Link></li>
              <li><Link to="/artisans" className="hover:text-white transition-colors">Artisan Directory</Link></li>
              <li><Link to="/auth?tab=register&role=seller" className="hover:text-white transition-colors">Sell on CraftLK</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Our Mission</Link></li>
            </ul>
          </div>

          {/* Popular Crafts */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Craft Traditions</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/shop?category=batik" className="hover:text-white transition-colors">Batik & Handloom</Link></li>
              <li><Link to="/shop?category=pottery" className="hover:text-white transition-colors">Terracotta Pottery</Link></li>
              <li><Link to="/shop?category=wooden-handicrafts" className="hover:text-white transition-colors">Wooden Handicrafts</Link></li>
              <li><Link to="/shop?category=jewellery" className="hover:text-white transition-colors">Silver & Moonstone</Link></li>
              <li><Link to="/shop?category=woven-products" className="hover:text-white transition-colors">Cane & Reed Weaving</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Get in Touch</h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#A3481D] shrink-0 mt-0.5" />
                <span>Faculty of Technology, South Eastern University of Sri Lanka</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#A3481D] shrink-0" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#A3481D] shrink-0" />
                <span>support@craftlk.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} CraftLK Marketplace. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Handcrafted with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> in Sri Lanka
          </p>
        </div>
      </div>
    </footer>
  );
}
