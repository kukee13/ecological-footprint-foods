'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { Search, Menu, Globe, Apple, X, Settings2, ArrowUpNarrowWide, ArrowDownWideNarrow, ShoppingBag, Plus, Minus, Trash2, ChevronUp, ChevronDown, Share2, Download } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FoodItem } from '@/types/food';
import { FoodService } from '@/services/foodService';
import { foodData } from '@/data/foodItems';
import dynamic from 'next/dynamic';
import { translations, Language } from '@/constants/translations';
import { cn } from '@/lib/utils';

const CASE_STUDIES: Record<string, string> = {
  '35': 'erdbeere',
};

const FoodCard = dynamic(() => import('@/components/FoodCard'), { ssr: false });

type SortType = 'co2' | 'water' | 'ecoScore';
type SortOrder = 'asc' | 'desc';

const TAB_ALL = 'ALL';
const TAB_PLANT = 'PLANT';
const TAB_ANIMAL = 'ANIMAL';

interface PlateEntry {
  item: FoodItem;
  quantity: number;
}

const DAILY_BUDGET_KG = 1.7;

function getBestSwap(item: FoodItem): FoodItem | null {
  let candidates: FoodItem[];
  if (item.category === 'Meat') {
    candidates = foodData.filter(f => f.category !== 'Meat' && f.id !== item.id);
  } else if (item.category === 'Vegetarian') {
    candidates = foodData.filter(f => f.category === 'Vegan' && f.id !== item.id);
  } else {
    candidates = foodData.filter(f => f.category === 'Vegan' && f.id !== item.id && f.co2 < item.co2);
  }
  if (candidates.length === 0) return null;
  const best = candidates.reduce((min, f) => f.co2 < min.co2 ? f : min);
  return item.co2 - best.co2 >= 1 ? best : null;
}

async function generateShareCard(
  plate: PlateEntry[],
  totalCO2: number,
  lang: 'DE' | 'EN'
): Promise<void> {
  if (typeof window === 'undefined') return;
  await document.fonts.ready;

  const S = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d')!;

  const L = 80;

  ctx.fillStyle = '#f7f6f1';
  ctx.fillRect(0, 0, S, S);

  const circle = (x: number, y: number, r: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };
  circle(-80, -80, 380, 'rgba(159,18,57,0.055)');
  circle(S + 80, S + 80, 430, 'rgba(159,18,57,0.04)');
  circle(S * 0.75, S * 0.28, 180, 'rgba(159,18,57,0.025)');

  const budgetRatio = totalCO2 / DAILY_BUDGET_KG;
  const co2Color = budgetRatio >= 1 ? '#f43f5e' : budgetRatio >= 0.7 ? '#f97316' : '#10b981';
  const yearlyKg = totalCO2 * 365;
  const flights = Math.round(yearlyKg / 1600);
  const carKm = Math.round(yearlyKg / 0.21);

  let y = 96;

  ctx.fillStyle = 'rgba(26,26,26,0.22)';
  ctx.font = '700 22px Arial,Helvetica,sans-serif';
  ctx.fillText('ECOFOOTPRINT', L, y);
  y += 76;

  const emojis = plate.slice(0, 6).map(p => p.item.emoji).join('  ');
  ctx.font = '84px Arial,sans-serif';
  ctx.fillText(emojis || '🍽', L, y);
  y += 76;

  ctx.fillStyle = co2Color;
  ctx.font = '900 148px Georgia,"Times New Roman",serif';
  ctx.fillText(totalCO2.toFixed(1), L, y);
  ctx.fillStyle = 'rgba(26,26,26,0.35)';
  ctx.font = '400 38px Georgia,serif';
  ctx.fillText(lang === 'DE' ? 'kg CO₂ heute' : 'kg CO₂ today', L, y + 44);
  y += 126;

  const barW = S - 2 * L;
  const barH = 11;
  ctx.fillStyle = 'rgba(0,0,0,0.07)';
  ctx.beginPath();
  ctx.roundRect(L, y, barW, barH, 5.5);
  ctx.fill();
  ctx.fillStyle = co2Color;
  ctx.beginPath();
  ctx.roundRect(L, y, barW * Math.min(budgetRatio, 1), barH, 5.5);
  ctx.fill();
  y += 30;
  ctx.fillStyle = 'rgba(26,26,26,0.28)';
  ctx.font = '600 22px Arial,sans-serif';
  const remaining = budgetRatio < 1
    ? `${(DAILY_BUDGET_KG - totalCO2).toFixed(1)} kg ${lang === 'DE' ? 'übrig' : 'remaining'}`
    : `+${(totalCO2 - DAILY_BUDGET_KG).toFixed(1)} kg ${lang === 'DE' ? 'über Limit' : 'over limit'}`;
  ctx.fillText(`${Math.round(budgetRatio * 100)}% ${lang === 'DE' ? 'Tagesbudget' : 'daily budget'} · ${remaining}`, L, y);
  y += 56;

  ctx.fillStyle = 'rgba(0,0,0,0.07)';
  ctx.fillRect(L, y, barW, 1);
  y += 38;

  ctx.fillStyle = 'rgba(26,26,26,0.45)';
  ctx.font = '600 24px Arial,sans-serif';
  ctx.fillText(lang === 'DE' ? 'Jährliche Projektion (täglich × 365)' : 'Yearly projection (daily × 365)', L, y);
  y += 52;

  ctx.fillStyle = 'rgba(26,26,26,0.88)';
  ctx.font = '700 50px Georgia,serif';
  ctx.fillText(`${Math.round(yearlyKg).toLocaleString()} kg CO₂`, L, y);
  y += 64;

  ctx.fillStyle = 'rgba(26,26,26,0.52)';
  ctx.font = '400 34px Georgia,serif';
  ctx.fillText(`✈  ${flights}× ${lang === 'DE' ? 'Transatlantikflug' : 'transatlantic flight'}`, L, y);
  y += 46;
  ctx.fillText(`🚗  ${carKm.toLocaleString()} km ${lang === 'DE' ? 'Autofahrt' : 'by car'}`, L, y);

  ctx.fillStyle = 'rgba(26,26,26,0.16)';
  ctx.font = '600 20px Arial,sans-serif';
  ctx.fillText('ecological-footprint-foods.vercel.app', L, S - 48);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = lang === 'DE' ? 'klimaabdruck.png' : 'carbon-footprint.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

export default function EcoApp() {
  const [search, setSearch] = useState('');
  const [lang, setLang] = useState<'DE' | 'EN'>('DE');
  const [activeTab, setActiveTab] = useState<string>(TAB_ALL);
  const [filteredFood, setFilteredFood] = useState<FoodItem[]>(() =>
    [...foodData].sort((a, b) => b.co2 - a.co2)
  );
  const [topN, setTopN] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlateOpen, setIsPlateOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortType>('co2');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isScanning, setIsScanning] = useState(false);
  const [plate, setPlate] = useState<PlateEntry[]>([]);
  const [displayLimit, setDisplayLimit] = useState<number | null>(null);
  const [statsCollapsed, setStatsCollapsed] = useState(false);

  const pathname = usePathname();
  const isFallstudie = pathname === '/';

  const mainSectionRef = useRef<HTMLElement>(null);
  const scanY = useMotionValue(0);
  const laserTop = useTransform(scanY, (latest) => `${latest}%`);
  const laserOpacity = useTransform(scanY, [0, 10, 90, 100], [0, 1, 1, 0]);

  const currentLang = lang.toLowerCase() as Language;
  const t = translations[currentLang];

  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const heroOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.12], [1, 0.92]);
  const heroY = useTransform(smoothProgress, [0, 0.12], [0, -60]);

  useEffect(() => {
    const fetchFood = async () => {
      setLoading(true);
      setDisplayLimit(null);
      const data = await FoodService.getFoodItems();
      let filtered = [...data];

      if (search) {
        const term = search.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.nameDE.toLowerCase().includes(term) ||
            item.nameEN.toLowerCase().includes(term)
        );
      }

      if (activeTab === TAB_PLANT) {
        filtered = filtered.filter(
          (item) => item.category === 'Vegan' || item.category === 'Vegetarian'
        );
      } else if (activeTab === TAB_ANIMAL) {
        filtered = filtered.filter((item) => item.category === 'Meat');
      }

      filtered.sort((a, b) => {
        if (sortBy === 'ecoScore') {
          const scores = { GOOD: 1, MEDIUM: 2, BAD: 3 };
          const diff = scores[a.ecoScore] - scores[b.ecoScore];
          return sortOrder === 'asc' ? diff : -diff;
        }
        const diff = a[sortBy] - b[sortBy];
        return sortOrder === 'asc' ? diff : -diff;
      });

      setFilteredFood(filtered);
      setLoading(false);
    };

    const timer = setTimeout(fetchFood, 300);
    return () => clearTimeout(timer);
  }, [search, activeTab, sortBy, sortOrder]);

  useEffect(() => {
    if (plate.length === 3) setStatsCollapsed(true);
  }, [plate.length]);

  const worstPflanzlich = [...foodData]
    .filter((item) => item.category === 'Vegan' || item.category === 'Vegetarian')
    .sort((a, b) => b.co2 - a.co2)
    .slice(0, topN);

  const worstTierisch = [...foodData]
    .filter((item) => item.category === 'Meat')
    .sort((a, b) => b.co2 - a.co2)
    .slice(0, topN);

  const addToPlate = (item: FoodItem) => {
    setPlate((prev) => {
      const existing = prev.find((p) => p.item.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.item.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromPlate = (itemId: string) => {
    setPlate((prev) => {
      const existing = prev.find((p) => p.item.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((p) =>
          p.item.id === itemId ? { ...p, quantity: p.quantity - 1 } : p
        );
      }
      return prev.filter((p) => p.item.id !== itemId);
    });
  };

  const clearPlate = () => {
    setPlate([]);
    setIsPlateOpen(false);
  };

  const totalCO2 = plate.reduce((sum, p) => sum + p.item.co2 * p.quantity, 0);
  const totalWater = plate.reduce((sum, p) => sum + p.item.water * p.quantity, 0);
  const totalItems = plate.reduce((sum, p) => sum + p.quantity, 0);

  const startScan = async () => {
    if (isScanning) return;
    setIsScanning(true);
    scanY.set(0);
    await animate(scanY, 100, { duration: 1.0, ease: 'easeInOut' });
    setIsScanning(false);
    const target = mainSectionRef.current?.offsetTop ?? 0;
    animate(window.scrollY, target, {
      duration: 1,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (v) => window.scrollTo(0, v),
    });
  };

  return (
    <div
      className="relative min-h-screen bg-alabaster text-charcoal selection:bg-charcoal selection:text-alabaster mesh-gradient font-sans"
    >
      {/* PERSISTENT HEADER */}
      <div className="fixed top-0 left-0 right-0 p-8 flex justify-between items-center z-50 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3">
          <Link
            href="/"
            className="glass px-5 py-2.5 rounded-full text-[10px] font-black tracking-[0.2em] hover:bg-charcoal hover:text-white transition-all duration-500 shadow-xl border-white/40 hidden md:inline-block"
          >
            ECOFOOTPRINT
          </Link>
          <Link
            href="/"
            className={cn(
              "px-5 py-2.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-500 shadow-xl",
              isFallstudie
                ? "bg-burgundy text-white border border-burgundy/30"
                : "glass border-white/40 hover:bg-burgundy hover:text-white"
            )}
          >
            Fallstudie
          </Link>
          <button
            onClick={() => setLang(lang === 'DE' ? 'EN' : 'DE')}
            className="glass px-6 py-2.5 rounded-full text-[10px] font-black tracking-[0.2em] hover:bg-charcoal hover:text-white transition-all duration-500 shadow-xl border-white/40"
          >
            {lang}
          </button>
        </div>
        <div className="pointer-events-auto">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-3.5 glass rounded-full cursor-pointer hover:bg-charcoal hover:text-white transition-all active:scale-95 shadow-xl border-white/40 group"
          >
            <Menu className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* FILTER MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-charcoal/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white/90 backdrop-blur-2xl border-l border-black/5 z-[70] p-12 flex flex-col gap-16 shadow-2xl"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Settings2 className="text-rose-500" size={28} />
                  <h2 className="text-3xl font-serif tracking-tight text-charcoal italic">
                    {t.menu.title}
                  </h2>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-3 hover:bg-black/5 rounded-full transition-colors duration-500"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-12">
                <div className="space-y-8">
                  <p className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-charcoal/30">
                    {t.menu.sortBy}
                  </p>

                  {([
                    { key: 'co2' as SortType, label: t.menu.co2 },
                    { key: 'water' as SortType, label: t.menu.water },
                  ] as const).map(({ key, label }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-6 bg-alabaster rounded-3xl border border-black/5 shadow-sm"
                    >
                      <span className="font-serif text-lg tracking-tight text-charcoal">{label}</span>
                      <div className="flex gap-1.5 bg-black/5 p-1.5 rounded-2xl">
                        {(['asc', 'desc'] as const).map((order) => (
                          <button
                            key={order}
                            onClick={() => { setSortBy(key); setSortOrder(order); }}
                            className={cn(
                              'px-5 py-3 rounded-xl text-[10px] font-sans font-black uppercase tracking-widest transition-all duration-500',
                              sortBy === key && sortOrder === order
                                ? 'bg-charcoal text-alabaster shadow-lg'
                                : 'text-charcoal/40 hover:text-charcoal/80'
                            )}
                          >
                            {order === 'asc' ? <ArrowUpNarrowWide size={16} /> : <ArrowDownWideNarrow size={16} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between p-6 bg-alabaster rounded-3xl border border-black/5 shadow-sm">
                    <span className="font-serif text-lg tracking-tight text-charcoal">{t.menu.ecoScore}</span>
                    <button
                      onClick={() => { setSortBy('ecoScore'); setSortOrder('asc'); }}
                      className={cn(
                        'px-8 py-3 rounded-2xl text-[10px] font-sans font-black uppercase tracking-widest transition-all duration-500',
                        sortBy === 'ecoScore'
                          ? 'bg-charcoal text-alabaster shadow-lg'
                          : 'bg-black/5 text-charcoal/40 hover:text-charcoal'
                      )}
                    >
                      {t.menu.aToZ}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-12 border-t border-black/5">
                <div className="flex items-center gap-4 text-charcoal/10">
                  <div className="w-16 h-px bg-black/10" />
                  <span className="text-[10px] font-sans font-black uppercase tracking-[0.5em]">
                    System Matrix v2.0
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* PLATE PANEL */}
      <AnimatePresence>
        {isPlateOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPlateOpen(false)}
              className="fixed inset-0 bg-charcoal/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white/95 backdrop-blur-2xl border-t border-black/5 z-[70] rounded-t-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="shrink-0 flex justify-between items-center px-8 pt-8 pb-6 border-b border-black/5">
                <div className="flex items-center gap-4">
                  <ShoppingBag className="text-burgundy" size={24} />
                  <h2 className="text-2xl font-serif tracking-tight text-charcoal italic">
                    {t.scanner.yourPlate}
                  </h2>
                  {totalItems > 0 && (
                    <span className="px-3 py-1 bg-burgundy text-white text-[10px] font-black rounded-full">
                      {totalItems}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {plate.length > 0 && (
                    <>
                      <button
                        onClick={() => setIsShareOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-charcoal/50 hover:bg-black/5 rounded-xl transition-colors"
                      >
                        <Share2 size={14} />
                        {t.scanner.shareCard}
                      </button>
                      <button
                        onClick={clearPlate}
                        className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <Trash2 size={14} />
                        {t.scanner.clear}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setIsPlateOpen(false)}
                    className="p-3 hover:bg-black/5 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {plate.length > 0 && (() => {
                const budgetRatio = totalCO2 / DAILY_BUDGET_KG;
                const fillRatio = Math.min(budgetRatio, 1);
                const R = 38;
                const circ = 2 * Math.PI * R;
                const dashOffset = circ * (1 - fillRatio);
                const meterColor = budgetRatio >= 1 ? '#f43f5e' : budgetRatio >= 0.7 ? '#f97316' : '#10b981';
                const meterStatus = budgetRatio >= 1 ? t.scanner.budgetExceeded : budgetRatio >= 0.7 ? t.scanner.budgetWarning : t.scanner.budgetGood;
                const yearlyKg = totalCO2 * 365;
                const flights = Math.round(yearlyKg / 1600);
                const carKm = Math.round(yearlyKg / 0.21);
                return (
                  <div className="shrink-0 bg-alabaster/60 border-b border-black/5">
                    {/* CO2 + Water totals — always visible */}
                    <div className="grid grid-cols-2 gap-4 px-8 pt-5 pb-3">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/30">{t.card.co2Label}</p>
                        <p className="text-2xl font-serif font-black text-charcoal">
                          {totalCO2.toFixed(1)} <span className="text-sm font-normal text-charcoal/40">kg</span>
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/30">{t.card.waterLabel}</p>
                        <p className="text-2xl font-serif font-black text-charcoal">
                          {totalWater.toLocaleString()} <span className="text-sm font-normal text-charcoal/40">l</span>
                        </p>
                      </div>
                    </div>

                    {/* Collapse toggle */}
                    <button
                      onClick={() => setStatsCollapsed(v => !v)}
                      className="w-full px-8 py-2 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-charcoal/30 hover:bg-black/[0.03] transition-colors border-t border-black/5"
                    >
                      <span>{statsCollapsed ? (lang === 'DE' ? 'Projektion & Budget' : 'Projection & Budget') : (lang === 'DE' ? 'Einklappen' : 'Collapse')}</span>
                      <ChevronDown size={14} className={cn('transition-transform duration-300', !statsCollapsed && 'rotate-180')} />
                    </button>

                    {/* Yearly Projection + Budget Meter — collapsible */}
                    {!statsCollapsed && (
                      <div className="px-8 pb-5 space-y-3">
                        <div className="flex items-center gap-5 p-4 bg-white rounded-2xl border border-black/5">
                          <div className="text-3xl shrink-0">📅</div>
                          <div className="space-y-1 min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/30">
                              {t.scanner.yearlyProjection}
                            </p>
                            <p className="text-2xl font-serif font-black text-charcoal">
                              {Math.round(yearlyKg).toLocaleString()}{' '}
                              <span className="text-sm font-normal text-charcoal/40">kg CO₂</span>
                            </p>
                            <p className="text-[11px] text-charcoal/50">
                              ✈️ {flights} {t.scanner.transatlanticFlights}
                            </p>
                            <p className="text-[11px] text-charcoal/40">
                              🚗 {carKm.toLocaleString()} {t.scanner.carKm}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-5 p-4 bg-white rounded-2xl border border-black/5">
                          <div className="relative shrink-0">
                            <svg width="84" height="84" viewBox="0 0 96 96">
                              <circle cx="48" cy="48" r={R} fill="none" stroke="#f0f0ec" strokeWidth="7" />
                              <circle
                                cx="48" cy="48" r={R}
                                fill="none"
                                stroke={meterColor}
                                strokeWidth="7"
                                strokeDasharray={circ}
                                strokeLinecap="round"
                                transform="rotate(-90 48 48)"
                                style={{
                                  strokeDashoffset: dashOffset,
                                  transition: 'stroke-dashoffset 0.7s ease, stroke 0.4s ease',
                                }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-base font-serif font-black" style={{ color: meterColor }}>
                                {Math.round(budgetRatio * 100)}%
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/30">
                              {t.scanner.dailyBudget}
                            </p>
                            <p className="text-2xl font-serif font-black text-charcoal">
                              {totalCO2.toFixed(1)}{' '}
                              <span className="text-sm font-normal text-charcoal/40">/ {DAILY_BUDGET_KG} kg</span>
                            </p>
                            <p className="text-[11px] font-black uppercase tracking-wider" style={{ color: meterColor }}>
                              {meterStatus}
                            </p>
                            <p className="text-[10px] text-charcoal/40">
                              {budgetRatio < 1
                                ? `${(DAILY_BUDGET_KG - totalCO2).toFixed(1)} kg ${t.scanner.budgetRemaining}`
                                : `+${(totalCO2 - DAILY_BUDGET_KG).toFixed(1)} kg ${t.scanner.budgetOver}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="flex-1 min-h-0 overflow-y-auto p-8 pb-24 space-y-3">
                {plate.length === 0 ? (
                  <div className="text-center py-16 text-charcoal/30">
                    <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-serif italic text-xl">{t.scanner.emptyPlate}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest mt-3 opacity-60">
                      {lang === 'DE' ? 'Füge Lebensmittel über die Karten hinzu' : 'Flip a card and tap "Add to Plate"'}
                    </p>
                  </div>
                ) : (
                  plate.map(({ item, quantity }) => {
                    const swap = getBestSwap(item);
                    const saving = swap ? item.co2 - swap.co2 : 0;
                    return (
                      <div key={item.id} className="bg-alabaster rounded-2xl border border-black/5 overflow-hidden">
                        <div className="flex items-center gap-4 p-4">
                          <span className="text-3xl">{item.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-serif text-lg font-black text-charcoal truncate">
                              {lang === 'DE' ? item.nameDE : item.nameEN}
                            </p>
                            <p className="text-[10px] font-black text-charcoal/30 uppercase tracking-widest">
                              {(item.co2 * quantity).toFixed(1)} kg CO₂ · {(item.water * quantity).toLocaleString()} l
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => removeFromPlate(item.id)}
                              className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-rose-100 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-6 text-center font-black text-sm">{quantity}</span>
                            <button
                              onClick={() => addToPlate(item)}
                              className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        {swap && (
                          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-emerald-50 border-t border-emerald-100">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 shrink-0">
                              {t.scanner.swapFor}
                            </span>
                            <span className="text-sm">{swap.emoji}</span>
                            <span className="text-sm font-black text-emerald-700 truncate">
                              {lang === 'DE' ? swap.nameDE : swap.nameEN}
                            </span>
                            <span className="text-[10px] font-black text-emerald-500 ml-auto shrink-0">
                              −{saving.toFixed(1)} kg {t.scanner.saveCO2}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SHARE MODAL */}
      <AnimatePresence>
        {isShareOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareOpen(false)}
              className="fixed inset-0 bg-charcoal/30 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[400px] bg-white rounded-[2rem] shadow-2xl z-[70] flex flex-col overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex justify-between items-center px-7 pt-7 pb-5 border-b border-black/5">
                <div className="flex items-center gap-3">
                  <Share2 className="text-burgundy" size={20} />
                  <h2 className="text-xl font-serif tracking-tight text-charcoal italic">{t.scanner.shareCard}</h2>
                </div>
                <button onClick={() => setIsShareOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Card preview */}
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="rounded-2xl overflow-hidden border border-black/5 shadow-md bg-[#f7f6f1] p-6 space-y-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-charcoal/25">ECOFOOTPRINT</p>
                  <p className="text-4xl">{plate.slice(0, 5).map(p => p.item.emoji).join(' ')}</p>
                  {(() => {
                    const budgetRatio = totalCO2 / DAILY_BUDGET_KG;
                    const co2Color = budgetRatio >= 1 ? '#f43f5e' : budgetRatio >= 0.7 ? '#f97316' : '#10b981';
                    const yearlyKg = totalCO2 * 365;
                    const flights = Math.round(yearlyKg / 1600);
                    const carKm = Math.round(yearlyKg / 0.21);
                    return (
                      <>
                        <div>
                          <span className="text-5xl font-serif font-black" style={{ color: co2Color }}>{totalCO2.toFixed(1)}</span>
                          <span className="text-sm text-charcoal/40 ml-1.5">kg CO₂ {lang === 'DE' ? 'heute' : 'today'}</span>
                        </div>
                        <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(budgetRatio * 100, 100)}%`, backgroundColor: co2Color }} />
                        </div>
                        <p className="text-[10px] text-charcoal/40">{Math.round(budgetRatio * 100)}% {lang === 'DE' ? 'Tagesbudget' : 'daily budget'}</p>
                        <div className="pt-2 border-t border-black/5 space-y-1">
                          <p className="text-xs font-black text-charcoal/30 uppercase tracking-widest">{t.scanner.yearlyProjection}</p>
                          <p className="font-serif font-black text-charcoal">{Math.round(yearlyKg).toLocaleString()} kg CO₂</p>
                          <p className="text-xs text-charcoal/50">✈️ {flights} {t.scanner.transatlanticFlights}</p>
                          <p className="text-xs text-charcoal/40">🚗 {carKm.toLocaleString()} {t.scanner.carKm}</p>
                        </div>
                        <p className="text-[9px] text-charcoal/20 font-black uppercase tracking-widest">ecological-footprint-foods.vercel.app</p>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 space-y-2">
                <button
                  onClick={() => { generateShareCard(plate, totalCO2, lang); }}
                  className="w-full py-4 bg-charcoal text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-burgundy transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={14} />
                  {t.scanner.downloadCard}
                </button>
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    onClick={() => {
                      navigator.share({
                        title: lang === 'DE' ? 'Mein Öko-Fußabdruck' : 'My Carbon Footprint',
                        text: lang === 'DE'
                          ? `Mein Teller erzeugt ${totalCO2.toFixed(1)} kg CO₂ – das sind ${Math.round(totalCO2 * 365).toLocaleString()} kg pro Jahr!`
                          : `My plate produces ${totalCO2.toFixed(1)} kg CO₂ – that's ${Math.round(totalCO2 * 365).toLocaleString()} kg per year!`,
                        url: 'https://ecological-footprint-foods.vercel.app',
                      }).catch(() => {});
                    }}
                    className="w-full py-4 bg-black/5 text-charcoal rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 size={14} />
                    {lang === 'DE' ? 'Teilen' : 'Share'}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative text-center max-w-6xl mx-auto"
        >
          <h1 className="relative text-6xl md:text-[8rem] font-serif mb-12 tracking-tighter leading-[0.9] select-none text-charcoal font-black">
            <motion.div
              animate={{
                x: [-100, 100, -100, 100],
                y: [-20, -20, 80, 80],
                rotate: [0, 20, 0, -20, 0],
                scale: [1, 1.2, 1, 1.2, 1],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-12 left-1/2 -ml-6 text-rose-500 z-20 pointer-events-none opacity-90"
            >
              <Apple
                size={56}
                strokeWidth={2}
                fill="currentColor"
                className="drop-shadow-[0_0_20px_rgba(244,63,94,0.3)]"
              />
            </motion.div>

            {t.hero.titleLine1}{' '}
            <span className="inline-block w-8 md:w-12" />{' '}
            {t.hero.titleLine2}
            <br />
            <span className="text-rose-500 italic">
              {t.hero.titleLine3}{' '}
              <span className="inline-block w-8 md:w-12" />{' '}
              {t.hero.titleLine4}
            </span>
          </h1>

          <div className="mt-8">
            <motion.button
              onClick={startScan}
              disabled={isScanning}
              whileHover={isScanning ? {} : { scale: 1.05 }}
              whileTap={isScanning ? {} : { scale: 0.95 }}
              className="group relative px-16 py-8 bg-charcoal text-white rounded-full font-black text-sm tracking-[0.3em] overflow-hidden transition-colors duration-500 shadow-2xl pointer-events-auto uppercase disabled:opacity-60 disabled:cursor-wait"
            >
              <span className="relative z-10">
                {isScanning ? '···' : t.hero.checkImpact}
              </span>
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-40 group-hover:animate-shine" />
            </motion.button>
          </div>
        </motion.div>

        {/* SCANNING LASER LINE */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              style={{ top: laserTop, opacity: laserOpacity }}
              className="fixed left-0 right-0 h-[2px] bg-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.5)] z-[100] pointer-events-none"
            >
              <div className="absolute top-1/2 left-0 right-0 h-[400px] -translate-y-1/2 bg-gradient-to-b from-rose-500/20 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-charcoal/20"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t.hero.scroll}</span>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="w-px h-16 bg-gradient-to-b from-charcoal/20 to-transparent"
          />
        </motion.div>
      </motion.section>

      {/* MAIN APP INTERFACE */}
      <motion.section
        ref={mainSectionRef}
        className="relative z-30 px-6 md:px-20 py-32"
      >
        <div className="max-w-7xl mx-auto space-y-20">
          {/* SECTION HEADING */}
          <div className="text-center space-y-4">
            <h2 className="text-5xl md:text-6xl font-serif tracking-tight text-charcoal italic">
              {t.filters.browseSectionTitle}
            </h2>
            <p className="text-charcoal/30 font-sans font-black uppercase tracking-[0.4em] text-[10px]">
              {filteredFood.length} {lang === 'DE' ? 'Lebensmittel' : 'Foods'}
            </p>
          </div>

          {/* SEARCH & FILTERS */}
          <div className="space-y-12">
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
                <Search
                  className="text-charcoal/20 group-focus-within:text-burgundy transition-colors duration-500"
                  size={24}
                />
              </div>
              <input
                type="text"
                placeholder={t.filters.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-black/5 rounded-[2rem] py-8 pl-20 pr-16 text-xl font-serif focus:outline-none focus:ring-4 focus:ring-black/2 focus:border-charcoal/20 transition-all duration-500 placeholder:text-charcoal/20 shadow-[0_10px_40px_rgba(0,0,0,0.03)]"
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearch('')}
                    className="absolute inset-y-0 right-8 flex items-center text-charcoal/30 hover:text-charcoal transition-colors"
                  >
                    <X size={20} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {[
                { id: TAB_ALL, label: t.filters.all },
                { id: TAB_PLANT, label: t.filters.plantBased },
                { id: TAB_ANIMAL, label: t.filters.animalBased },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={cn(
                    'px-10 py-4 rounded-full font-sans font-black text-[10px] tracking-[0.3em] transition-all duration-500 border uppercase',
                    activeTab === cat.id
                      ? 'bg-charcoal text-alabaster border-charcoal shadow-xl scale-110'
                      : 'bg-white text-charcoal/40 border-black/5 hover:border-charcoal/20 hover:text-charcoal/60'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* DISPLAY LIMIT */}
          {!loading && filteredFood.length > 5 && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-charcoal/30 mr-1">
                {t.filters.showLimit}:
              </span>
              {[5, 10, 20, 50].filter(n => n < filteredFood.length).map(n => (
                <button
                  key={n}
                  onClick={() => setDisplayLimit(displayLimit === n ? null : n)}
                  className={cn(
                    'px-7 py-3 rounded-full font-sans font-black text-[10px] tracking-[0.2em] transition-all duration-300 border uppercase',
                    displayLimit === n
                      ? 'bg-burgundy text-white border-burgundy shadow-lg scale-105'
                      : 'bg-white text-charcoal/40 border-black/5 hover:border-burgundy/30 hover:text-charcoal/70'
                  )}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setDisplayLimit(null)}
                className={cn(
                  'px-7 py-3 rounded-full font-sans font-black text-[10px] tracking-[0.2em] transition-all duration-300 border uppercase',
                  displayLimit === null
                    ? 'bg-charcoal text-white border-charcoal shadow-lg scale-105'
                    : 'bg-white text-charcoal/40 border-black/5 hover:border-charcoal/20 hover:text-charcoal/70'
                )}
              >
                {t.filters.showAll} ({filteredFood.length})
              </button>
            </div>
          )}

          {/* RESULTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center min-h-[400px]">
            {loading ? (
              <div className="col-span-full py-20 flex flex-col items-center gap-6">
                <div className="w-10 h-10 border-2 border-charcoal/5 border-t-burgundy rounded-full animate-spin" />
                <p className="text-charcoal/30 animate-pulse font-sans font-black uppercase tracking-[0.3em] text-[10px]">
                  {t.filters.loading}
                </p>
              </div>
            ) : filteredFood.length === 0 ? (
              <div className="col-span-full py-20 text-center text-charcoal/30 font-serif italic text-2xl">
                {t.filters.noResults} &ldquo;{search}&rdquo;
              </div>
            ) : (
              (displayLimit ? filteredFood.slice(0, displayLimit) : filteredFood).map((item) => (
                <FoodCard
                  key={item.id}
                  item={item}
                  lang={lang}
                  onAddToPlate={addToPlate}
                  caseStudySlug={CASE_STUDIES[item.id]}
                />
              ))
            )}
          </div>
        </div>
      </motion.section>

      {/* WUSSTEN SIE? — TEASER FOR ERDBEERE CASE STUDY */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-30 px-6 md:px-20 py-24 border-t border-black/5"
      >
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-burgundy">Fallstudie · Erdbeere</p>
            <h2 className="text-5xl md:text-6xl font-serif tracking-tight text-charcoal italic">
              Wussten Sie?
            </h2>
            <p className="text-charcoal/40 font-sans font-black uppercase tracking-[0.4em] text-[10px] max-w-2xl mx-auto">
              Drei überraschende Fakten aus unserer Fallstudie zur Erdbeere
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: '11×',
                body: 'Deutsche Winter-Erdbeeren verursachen 11× mehr CO₂ als Saison-Ware.',
              },
              {
                number: '209 L',
                body: 'Eine spanische Erdbeere braucht 209 Liter Wasser pro Kilo — aus knappem Grundwasser.',
              },
              {
                number: '3.666',
                body: 'Kühl-LKWs fahren jedes Jahr von Huelva nach NRW.',
              },
            ].map((card, i) => (
              <Link
                key={i}
                href="/"
                className="group block bg-white rounded-[2rem] border border-black/5 shadow-sm hover:shadow-xl hover:border-burgundy/20 transition-all duration-500 p-10 space-y-6 hover:-translate-y-1"
              >
                <p className="text-6xl md:text-7xl font-serif font-black text-burgundy tracking-tighter leading-none">
                  {card.number}
                </p>
                <p className="text-charcoal/70 leading-relaxed font-serif text-lg">
                  {card.body}
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/40 group-hover:text-burgundy transition-colors flex items-center gap-2 pt-2">
                  Fallstudie öffnen
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </p>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>

      {/* TRANSITION */}
      <div className="relative z-30 px-6 md:px-20 py-12 text-center">
        <p className="text-charcoal/40 font-serif italic text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
          {t.leaderboard.transitionText}
        </p>
      </div>

      {/* HIGHEST IMPACT LEADERBOARD */}
      <motion.section
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-30 px-6 md:px-20 pb-40"
      >
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-6">
            <h2 className="text-5xl md:text-7xl font-serif tracking-tight text-charcoal italic">
              {t.leaderboard.title}
            </h2>
            <p className="text-charcoal/40 max-w-2xl mx-auto font-sans font-black uppercase tracking-[0.4em] text-[10px]">
              {t.leaderboard.subtitle}
            </p>
          </div>

          <div className="flex justify-center gap-3">
            {[1, 3, 5, 10].map((num) => (
              <button
                key={num}
                onClick={() => setTopN(num)}
                className={cn(
                  'px-8 py-3 rounded-full font-sans font-black text-[10px] tracking-[0.2em] transition-all duration-500 border uppercase',
                  topN === num
                    ? 'bg-burgundy text-white border-burgundy shadow-xl scale-110'
                    : 'bg-white text-charcoal/40 border-black/5 hover:border-charcoal/20'
                )}
              >
                {t.leaderboard.top} {num}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <div className="space-y-12 flex flex-col items-center">
              <div className="flex items-center gap-6 px-4 w-full max-w-sm">
                <div className="h-px grow bg-linear-to-r from-transparent to-black/5" />
                <h3 className="text-xs font-sans font-black uppercase tracking-[0.4em] text-charcoal/40">
                  {t.filters.plantBased}
                </h3>
                <div className="h-px grow bg-linear-to-l from-transparent to-black/5" />
              </div>
              <div className="space-y-12 w-full flex flex-col items-center">
                {worstPflanzlich.map((item, i) => (
                  <FoodCard
                    key={item.id}
                    item={item}
                    isHighlighted
                    rank={i + 1}
                    lang={lang}
                    onAddToPlate={addToPlate}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-12 flex flex-col items-center">
              <div className="flex items-center gap-6 px-4 w-full max-w-sm">
                <div className="h-px grow bg-linear-to-r from-transparent to-black/5" />
                <h3 className="text-xs font-sans font-black uppercase tracking-[0.4em] text-charcoal/40">
                  {t.filters.animalBased}
                </h3>
                <div className="h-px grow bg-linear-to-l from-transparent to-black/5" />
              </div>
              <div className="space-y-12 w-full flex flex-col items-center">
                {worstTierisch.map((item, i) => (
                  <FoodCard
                    key={item.id}
                    item={item}
                    isHighlighted
                    rank={i + 1}
                    lang={lang}
                    onAddToPlate={addToPlate}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* QUELLEN / SOURCES */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-30 px-6 md:px-20 py-24 border-t border-black/5"
      >
        <div className="max-w-4xl mx-auto space-y-14">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-charcoal italic">
              {t.sources.title}
            </h2>
            <p className="text-charcoal/40 font-sans font-black uppercase tracking-[0.35em] text-[10px] max-w-xl mx-auto">
              {t.sources.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: "Reducing food's environmental impacts through producers and consumers",
                author: "Poore & Nemecek", year: "2018",
                note: lang === 'DE' ? "Primärquelle für CO₂- und Landflächen-Daten" : "Primary source for CO₂ and land-use data",
                url: "https://science.sciencemag.org/content/360/6392/987",
              },
              {
                title: "Environmental Impacts of Food Production",
                author: "Our World in Data", year: "2022",
                note: lang === 'DE' ? "Visualisierung globaler Lebensmittelemissionen" : "Visualization of global food production emissions",
                url: "https://ourworldindata.org/environmental-impacts-of-food",
              },
              {
                title: "Water Footprint of Food",
                author: "Water Footprint Network", year: "2021",
                note: lang === 'DE' ? "Primärdatenquelle für Wasserverbrauchswerte" : "Primary data source for water consumption values",
                url: "https://www.waterfootprint.org",
              },
              {
                title: "Ökobilanz von Lebensmitteln",
                author: "Umweltbundesamt (UBA)", year: "2023",
                note: lang === 'DE' ? "Lebenszyklusanalyse von Lebensmitteln (DE)" : "Food lifecycle analysis by German Federal Environment Agency",
                url: "https://www.umweltbundesamt.de",
              },
              {
                title: "Food and Climate Change: Healthy Diets for a Healthier Planet",
                author: "Hannah Ritchie, Our World in Data", year: "2022",
                note: lang === 'DE' ? "Evidenz-Synthese zu Ernährung und Klima" : "Evidence synthesis on diet and climate impact",
                url: "https://ourworldindata.org/food-choice-vs-eating-local",
              },
              {
                title: "Food in the Anthropocene: the EAT–Lancet Commission",
                author: "EAT-Lancet Commission", year: "2019",
                note: lang === 'DE' ? "Referenzrahmen für nachhaltige Ernährungssysteme" : "Reference framework for sustainable food systems",
                url: "https://eatforum.org/eat-lancet-commission",
              },
            ].map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 bg-white rounded-3xl border border-black/5 shadow-sm hover:shadow-md hover:border-burgundy/20 transition-all duration-300"
              >
                <div className="space-y-2">
                  <p className="font-serif font-black text-charcoal text-base leading-snug group-hover:text-burgundy transition-colors duration-300">
                    {src.title}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">
                    {src.author} · {src.year}
                  </p>
                  <p className="text-sm text-charcoal/50 font-sans leading-relaxed">{src.note}</p>
                </div>
              </a>
            ))}
          </div>

          <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/20">
            {t.sources.note}
          </p>
        </div>
      </motion.section>

      <footer className="py-40 text-center text-charcoal/20 border-t border-black/5 mx-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-burgundy/[0.02] blur-[120px] rounded-full pointer-events-none" />
        <div className="flex justify-center items-center gap-6 mb-12">
          <Globe size={28} className="text-burgundy/40" />
          <span className="font-serif italic tracking-tight text-charcoal/60 text-3xl">
            {t.footer.project}
          </span>
        </div>
        <p className="text-xs font-sans font-black uppercase tracking-[0.3em] max-w-md mx-auto leading-relaxed opacity-40">
          {t.footer.copyright}
          <br />
          <span className="text-burgundy font-serif lowercase italic text-base mt-6 block tracking-normal opacity-100">
            {t.footer.tagline}
          </span>
        </p>
      </footer>

      {/* STICKY PLATE COUNTER */}
      <AnimatePresence>
        {plate.length > 0 && !isPlateOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.4, duration: 1.2 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]"
          >
            <motion.button
              onClick={() => setIsPlateOpen(true)}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="bg-charcoal text-alabaster px-10 py-5 rounded-[2rem] shadow-2xl flex items-center gap-5 cursor-pointer border border-white/10"
            >
              <div className="relative">
                <ShoppingBag size={22} className="text-burgundy" />
                <span className="absolute -top-2 -right-2 bg-burgundy text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-sans font-black">
                  {totalItems}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[9px] font-sans font-black uppercase tracking-[0.2em] opacity-40">
                  {t.scanner.yourPlate}
                </span>
                <span className="text-base font-serif italic tracking-tight">
                  {totalCO2.toFixed(1)} kg CO2
                </span>
              </div>
              <ChevronUp size={16} className="text-white/30 ml-1" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
