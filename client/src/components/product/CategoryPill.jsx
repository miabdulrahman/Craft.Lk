import React from 'react';
import {
  LayoutGrid,
  Palette,
  Gem,
  Flame,
  Trees,
  Layers,
  Sparkles,
  Gift
} from 'lucide-react';

export const categoryIcons = {
  All: LayoutGrid,
  Batik: Palette,
  Jewellery: Gem,
  Pottery: Flame,
  'Wooden Handicrafts': Trees,
  Wooden: Trees,
  'Woven Products': Layers,
  Woven: Layers,
  'Decorative Items': Sparkles,
  Decor: Sparkles,
  Gifts: Gift
};

export default function CategoryPill({ name, shortName, active, onClick }) {
  const IconComponent =
    categoryIcons[name] || categoryIcons[shortName] || Sparkles;

  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 min-w-[85px] sm:min-w-[105px] gap-2 active:scale-95 cursor-pointer ${
        active
          ? 'bg-[#A3481D] text-white border-[#A3481D] shadow-lg shadow-[#A3481D]/20 -translate-y-1'
          : 'bg-white text-stone-700 border-stone-200/90 hover:border-[#A3481D]/40 hover:bg-[#FAF6F0] hover:-translate-y-1 hover:shadow-md'
      }`}
    >
      <div
        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          active
            ? 'bg-white/20 text-white rotate-0'
            : 'bg-[#F5F2EB] text-[#A3481D] group-hover:scale-110 group-hover:bg-[#FAF2EC]'
        }`}
      >
        <IconComponent className="h-5 w-5" />
      </div>
      <span className="text-xs font-bold tracking-tight whitespace-nowrap">
        {shortName || name}
      </span>
    </button>
  );
}
