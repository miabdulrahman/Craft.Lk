import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  BookOpen,
  Heart,
  ShieldCheck,
  Store,
  Sparkles,
  ArrowRight,
  Globe,
  CheckCircle2
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      {/* Editorial Hero */}
      <div className="bg-[#F5EFE6] heritage-pattern border-b border-stone-200/80 py-16 sm:py-22 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-amber-300/70 text-[#A3481D] text-xs font-extrabold shadow-2xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Our Cultural Mission</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
            Connecting Sri Lankan Artisans <br className="hidden sm:inline" />
            <span className="text-gradient-terracotta">with Conscious Collectors</span>
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            A centralized digital multi-vendor marketplace designed to uplift rural craft communities and preserve the living heritage of Sri Lankan handicrafts.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="craft-card bg-white p-7 rounded-3xl border border-stone-200/90 shadow-xs text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF2EC] text-[#A3481D] flex items-center justify-center mx-auto mb-4">
              <Award className="h-7 w-7" />
            </div>
            <h4 className="font-extrabold text-stone-900 text-base mb-1.5">
              Authentic Quality
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Every listing is verified handmade by genuine Sri Lankan cottage artisans and traditional guilds.
            </p>
          </div>

          <div className="craft-card bg-white p-7 rounded-3xl border border-stone-200/90 shadow-xs text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h4 className="font-extrabold text-stone-900 text-base mb-1.5">
              100% Fair Trade
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Makers set their own prices in LKR with transparent billing and zero exploitative middlemen.
            </p>
          </div>

          <div className="craft-card bg-white p-7 rounded-3xl border border-stone-200/90 shadow-xs text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <Store className="h-7 w-7" />
            </div>
            <h4 className="font-extrabold text-stone-900 text-base mb-1.5">
              Digital Empowerment
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Enabling rural workshops in Kandy, Ambalangoda, and Kelaniya to manage digital storefronts effortlessly.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-stone-200/90 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#A3481D]">
              Why We Built CraftLK
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Preserving Millennia of Island Craftsmanship
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              Sri Lanka possesses an extraordinary, millennia-old tradition of handicraft production. From the Kandyan woodcarvers of Pilimathalawa and the master batik artists of the central hills to the Dumbara mat weavers and Kelani clay potters, our artisans produce works of supreme beauty.
            </p>
            <p className="text-stone-600 text-sm leading-relaxed">
              However, many small-scale creators face geographic isolation, relying solely on wayside stalls or informal social media messages. CraftLK bridges this gap with a dedicated multi-vendor B2C e-commerce platform that gives each artisan their own digital workshop and provides customers with structured order tracking and islandwide delivery.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border-4 border-[#FAF5EE] shadow-md aspect-4/3">
              <img
                src="/images/hero_crafts.jpg"
                alt="Sri Lankan Heritage Crafts"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Academic Project Accreditation */}
        <div className="bg-gradient-to-br from-[#FAF5EE] to-amber-50/70 p-8 sm:p-10 rounded-3xl border border-amber-200/90 space-y-4">
          <div className="flex items-center gap-2 text-[#A3481D] font-extrabold text-xs uppercase tracking-wider">
            <BookOpen className="h-4 w-4" />
            <span>Academic Engineering & Architecture</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            South Eastern University of Sri Lanka (SEUSL)
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Faculty of Technology • Course: <strong>CIS 22032 E-Commerce Strategies and Architecture</strong>.
            <br />
            Supervised by <strong>Ms. A.F. Masroofa</strong>. Developed by <strong>Group 7</strong> to demonstrate enterprise MERN stack engineering, multi-vendor order isolation, server-authoritative checkout pricing, Cloudinary WebP optimization, and responsive UI/UX design.
          </p>

          <div className="pt-2 flex flex-wrap gap-2">
            {[
              'Role-Based Access (Customer / Seller / Admin)',
              'Server-Authoritative Checkout',
              'Atomic Inventory Management',
              'Cloudinary WebP Pipeline'
            ].map((feat, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-stone-700 text-xs font-bold border border-amber-200"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#A3481D] hover:bg-[#8B3B14] text-white text-sm font-bold rounded-2xl shadow-lg transition-all shimmer-button"
          >
            <span>Explore Handcrafted Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
