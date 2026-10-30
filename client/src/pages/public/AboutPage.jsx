import React from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, Heart, ShieldCheck, Store, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#A3481D] uppercase tracking-wider bg-[#FAF2EC] px-3 py-1 rounded-full border border-amber-200">
            About CraftLK
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
            Connecting Sri Lankan Artisans with the World
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            A centralized digital marketplace designed to uplift local craft communities and showcase the rich heritage of Sri Lankan handicrafts.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/90 shadow-xs space-y-6">
          <h2 className="text-2xl font-bold text-stone-900">
            Our Purpose & Vision
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            Sri Lanka possesses an extraordinary, millennia-old tradition of handicraft production. From the Kandyan woodcarvers of Pilimathalawa and the master batik artists of the central hills to the Dumbara mat weavers and Kelani clay potters, our artisans produce works of supreme beauty.
          </p>
          <p className="text-stone-600 text-sm leading-relaxed">
            However, many small-scale creators face geographic isolation, relying solely on local wayside stalls or informal social media messages with disorganized order management. CraftLK bridges this gap with an elegant, multi-vendor B2C e-commerce platform that gives each artisan their own storefront and provides customers with structured order tracking and direct buying convenience.
          </p>
        </div>

        {/* Academic Project Accreditation */}
        <div className="bg-[#FAF5EE] p-8 sm:p-10 rounded-3xl border border-amber-200/80 space-y-4">
          <div className="flex items-center gap-2 text-[#A3481D] font-bold text-sm">
            <BookOpen className="h-5 w-5" />
            <span>Academic Background & Requirements</span>
          </div>
          <h3 className="text-xl font-extrabold text-stone-900">
            South Eastern University of Sri Lanka (SEUSL)
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Faculty of Technology • Course: <strong>CIS 22032 E-Commerce Strategies and Architecture</strong>.
            <br />
            Supervised by Ms. A.F. Masroofa. Developed by <strong>Group 7</strong> (12-member engineering team) to demonstrate modern MERN stack architecture, multi-vendor isolation, server-authoritative checkout, and responsive design.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs text-center">
            <Award className="h-8 w-8 text-[#A3481D] mx-auto mb-3" />
            <h4 className="font-bold text-stone-900 text-base mb-1">Authentic Quality</h4>
            <p className="text-xs text-stone-500">Every product verified handmade by Sri Lankan artisans.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs text-center">
            <ShieldCheck className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
            <h4 className="font-bold text-stone-900 text-base mb-1">Fair Trade</h4>
            <p className="text-xs text-stone-500">Makers set their own prices with transparent customer billing.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs text-center">
            <Store className="h-8 w-8 text-amber-600 mx-auto mb-3" />
            <h4 className="font-bold text-stone-900 text-base mb-1">Artisan Empowerment</h4>
            <p className="text-xs text-stone-500">Enabling rural cottage industries to compete digitally.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
