'use client';

import { useState } from 'react';
import { FoodItem } from '@/types/food';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Droplets, Wind, ChevronLeft, Plus } from 'lucide-react';
import { translations, Language } from '@/constants/translations';
import CaseStudyBadge from '@/components/CaseStudyBadge';

interface FoodCardProps {
  item: FoodItem;
  isHighlighted?: boolean;
  rank?: number;
  lang?: 'DE' | 'EN';
  onAddToPlate?: (item: FoodItem) => void;
  caseStudySlug?: string;
}

export default function FoodCard({ item, isHighlighted = false, rank, lang = 'DE', onAddToPlate, caseStudySlug }: FoodCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [added, setAdded] = useState(false);
  const currentLang = lang.toLowerCase() as Language;
  const t = translations[currentLang].card;

  const co2Max = 60;
  const waterMax = 18900;
  const currentMonth = new Date().getMonth() + 1;
  const isInSeason = item.inSeasonMonths?.includes(currentMonth) ?? false;
  const hasSeason = !!item.inSeasonMonths;

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleAddToPlate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToPlate?.(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const name = lang === 'DE' ? item.nameDE : item.nameEN;
  const reasoning = lang === 'DE' ? item.reasoningDE : item.reasoningEN;

  const getEcoGradient = (score: string) => {
    switch (score) {
      case 'GOOD': return 'from-emerald-100 to-teal-50';
      case 'MEDIUM': return 'from-orange-100 to-amber-50';
      case 'BAD': return 'from-rose-100 to-pink-50';
      default: return 'from-gray-100 to-slate-50';
    }
  };

  const getEcoTextColor = (score: string) => {
    switch (score) {
      case 'GOOD': return 'text-emerald-600';
      case 'MEDIUM': return 'text-orange-600';
      case 'BAD': return 'text-rose-600';
      default: return 'text-charcoal';
    }
  };

  const getEcoBgColor = (score: string) => {
    switch (score) {
      case 'GOOD': return 'bg-emerald-500';
      case 'MEDIUM': return 'bg-orange-500';
      case 'BAD': return 'bg-rose-500';
      default: return 'bg-charcoal';
    }
  };

  return (
    <div
      className="relative w-full max-w-sm h-[460px] cursor-pointer group"
      style={{ perspective: '1000px' }}
      onClick={handleFlip}
    >
      {rank && (
        <div className="absolute -top-3 -left-3 z-20 w-10 h-10 bg-burgundy text-white rounded-full flex items-center justify-center font-black text-sm shadow-lg border-2 border-white">
          #{rank}
        </div>
      )}

      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRONT */}
        <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
          <div className={cn(
            "relative flex flex-col h-full rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 group-hover:shadow-rose-500/10 group-hover:-translate-y-2 border border-white",
            isHighlighted && "ring-4 ring-burgundy/30 shadow-burgundy/10"
          )}>
            <div className={cn("absolute inset-0 bg-linear-to-br opacity-80", getEcoGradient(item.ecoScore))} />
            {caseStudySlug && (
              <CaseStudyBadge slug={caseStudySlug} />
            )}
            {hasSeason && (
              <div className={cn(
                "absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider text-white shadow-sm",
                isInSeason ? "bg-emerald-500" : "bg-slate-400/90"
              )}>
                {isInSeason ? `🌿 ${t.inSeason}` : `✈️ ${t.outOfSeason}`}
              </div>
            )}

            <div className="relative flex-grow flex flex-col items-center justify-center p-8 text-center gap-4">
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-[5.5rem] drop-shadow-2xl select-none"
              >
                {item.emoji}
              </motion.div>

              <div className="space-y-3">
                <h3 className="text-3xl font-serif font-black text-charcoal tracking-tight leading-tight">{name}</h3>

                <div className="space-y-0.5">
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className={cn("text-5xl font-serif font-black tracking-tighter", getEcoTextColor(item.ecoScore))}>
                      {item.co2.toFixed(1)}
                    </span>
                    <span className="text-sm font-black text-charcoal/40 uppercase tracking-wider">kg CO₂</span>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-charcoal/30">
                    ≈ {Math.round(item.co2 / 0.21).toLocaleString()} {t.carComparison}
                  </p>
                </div>

                <div className={cn("inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white", getEcoBgColor(item.ecoScore))}>
                  {item.ecoScore}
                </div>
              </div>
            </div>

            <div className="relative p-6 flex justify-center bg-white/30 backdrop-blur-sm">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/40 group-hover:text-charcoal transition-colors">
                {t.clickDetails}
              </span>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div className="bg-white flex flex-col h-full rounded-[2.5rem] shadow-2xl border border-black/5 p-8 overflow-hidden">
            <div className="flex justify-between items-center mb-5">
              <div className={cn("text-xs font-black uppercase tracking-widest", getEcoTextColor(item.ecoScore))}>
                {t.ecoAnalysis}
              </div>
              <button
                onClick={handleFlip}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <ChevronLeft size={20} className="text-charcoal/20" />
              </button>
            </div>

            <div className="space-y-6 flex-grow overflow-y-auto pr-1">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2 text-charcoal/40">
                    <Wind size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.co2Label}</span>
                  </div>
                  <span className={cn("text-3xl font-black tracking-tighter", getEcoTextColor(item.co2 > 10 ? 'BAD' : item.co2 > 2 ? 'MEDIUM' : 'GOOD'))}>
                    {item.co2.toFixed(1)} <span className="text-xs font-medium text-charcoal/20">kg</span>
                  </span>
                </div>
                <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((item.co2 / co2Max) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn("h-full rounded-full", getEcoBgColor(item.co2 > 10 ? 'BAD' : item.co2 > 2 ? 'MEDIUM' : 'GOOD'))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2 text-charcoal/40">
                    <Droplets size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.waterLabel}</span>
                  </div>
                  <span className="text-2xl font-black tracking-tighter text-charcoal/80">
                    {item.water.toLocaleString()} <span className="text-xs font-medium text-charcoal/20">l</span>
                  </span>
                </div>
                <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((item.water / waterMax) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                    className="h-full bg-sky-400 rounded-full"
                  />
                </div>
              </div>

              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-charcoal/20 text-center">{t.perKg}</p>

              <div className="space-y-2 pt-3 border-t border-black/5">
                <div className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">{t.background}</div>
                <p className="text-base font-serif italic text-charcoal/70 leading-snug">
                  "{reasoning}"
                </p>
              </div>

              {/* LOHNT ES SICH? */}
              <div className="space-y-3 pt-3 border-t border-black/5">
                <div className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">{t.worthIt}</div>
                <div className="flex justify-between items-center gap-3">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black uppercase tracking-wider text-charcoal/30">{t.pricePerKg}</p>
                    <p className="text-xl font-serif font-black text-charcoal">~€{item.pricePerKg.toFixed(0)}</p>
                  </div>
                  <div className="h-8 w-px bg-black/10" />
                  <div className="space-y-0.5 text-right">
                    <p className="text-[9px] font-black uppercase tracking-wider text-charcoal/30">{t.co2PerEuro}</p>
                    <p className="text-xl font-serif font-black text-charcoal">
                      {(item.co2 / item.pricePerKg).toFixed(2)}
                      <span className="text-xs font-medium text-charcoal/30"> kg/€</span>
                    </p>
                  </div>
                </div>
                <div className={cn(
                  'px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center text-white',
                  (item.co2 / item.pricePerKg) < 0.3
                    ? 'bg-emerald-500'
                    : (item.co2 / item.pricePerKg) < 1.5
                      ? 'bg-orange-500'
                      : 'bg-rose-500'
                )}>
                  {(item.co2 / item.pricePerKg) < 0.3
                    ? t.worthItGood
                    : (item.co2 / item.pricePerKg) < 1.5
                      ? t.worthItMedium
                      : t.worthItBad}
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {onAddToPlate && (
                <motion.button
                  onClick={handleAddToPlate}
                  animate={added ? { scale: [1, 1.05, 1] } : {}}
                  className={cn(
                    "w-full py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 shadow-md",
                    added
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-500 text-white hover:bg-emerald-600"
                  )}
                >
                  <Plus size={14} />
                  {added ? '✓' : t.addToPlate}
                </motion.button>
              )}
              <button
                onClick={handleFlip}
                className="w-full py-3.5 bg-charcoal text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-600 transition-colors"
              >
                {t.back}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
