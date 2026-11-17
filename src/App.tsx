/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useEffect, useRef, useState} from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  ClipboardCopy,
  Globe,
  MapPin,
  MessageCircle,
  PhoneCall,
  RefreshCw,
  ShieldCheck,
  Star,
  Wrench,
} from 'lucide-react';
import technicianPhoto from './assets/images/plumber_technician_portrait_1794917542138.jpg';
import {
  DEFAULT_CONFIG,
  LanguageCode,
  SERVICE_OPTIONS,
  ServiceTagId,
  buildTelHref,
  buildWhatsappHref,
  copyTextReliably,
  getReviewForSelection,
  getSafeGoogleUrl,
  resolveGoogleReviewRedirectUrl,
} from './data/businessConfig';

const OFFICIAL_LOGO_URL =
  'https://static.wixstatic.com/media/0b58e2_9185adf5a99c48e6abc5e9cff8a1c9c0~mv2.png';

const UI_COPY: Record<
  LanguageCode,
  {
    tagline: string;
    yourReview: string;
    copyBtn: string;
    toastMsg: string;
    openNow: string;
    quickActionsTitle: string;
    callLabel: string;
    whatsappLabel: string;
    websiteLabel: string;
    mapsLabel: string;
    googleLabel: string;
    verifiedBadge: string;
    techTitle: string;
    techLocation: string;
  }
> = {
  en: {
    tagline: 'Reliable Plumbing Services at Your Doorstep',
    yourReview: 'YOUR REVIEW',
    copyBtn: 'COPY & PASTE ON GOOGLE',
    toastMsg: "Review Copied! Now just tap 'Paste' on Google",
    openNow: 'Open Google',
    quickActionsTitle: 'Quick Contact & Directions',
    callLabel: 'Call',
    whatsappLabel: 'WhatsApp',
    websiteLabel: 'Website',
    mapsLabel: 'Maps',
    googleLabel: 'Google',
    verifiedBadge: '4.9 Verified Expert',
    techTitle: 'Plumber Wallace Service Team',
    techLocation: 'Local Service Area · 24/7 Doorstep Plumbing Support',
  },
  hi: {
    tagline: 'आपके दरवाजे पर भरोसेमंद प्लंबिंग सेवा',
    yourReview: 'आपकी समीक्षा',
    copyBtn: 'कॉपी करें और GOOGLE पर पेस्ट करें',
    toastMsg: "रिव्यू कॉपी हो गया! अब Google पर 'Paste' दबाएं",
    openNow: 'Google खोलें',
    quickActionsTitle: 'त्वरित संपर्क और लोकेशन',
    callLabel: 'कॉल',
    whatsappLabel: 'व्हाट्सएप',
    websiteLabel: 'वेबसाइट',
    mapsLabel: 'मैप्स',
    googleLabel: 'गूगल',
    verifiedBadge: '4.9 सत्यापित विशेषज्ञ',
    techTitle: 'Plumber Wallace सर्विस टीम',
    techLocation: 'स्थानीय सेवा क्षेत्र · 24/7 होम प्लंबिंग सपोर्ट',
  },
};

export default function App() {
  const config = DEFAULT_CONFIG;

  const [lang, setLang] = useState<LanguageCode>('en');
  const [selectedTag, setSelectedTag] = useState<ServiceTagId>('Pipe Leakage Repair');
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [hoverStars, setHoverStars] = useState<number | null>(null);
  const [reviewIndex, setReviewIndex] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>(() =>
    getReviewForSelection('en', 'Pipe Leakage Repair', 5, 0)
  );
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [logoFailed, setLogoFailed] = useState<boolean>(false);
  const [photoFailed, setPhotoFailed] = useState<boolean>(false);

  const redirectTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current);
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const applyTemplate = (
    nextLang: LanguageCode,
    nextTag: ServiceTagId,
    nextStars: number,
    nextIdx: number
  ) => {
    setReviewText(getReviewForSelection(nextLang, nextTag, nextStars, nextIdx));
  };

  const handleSelectTag = (tagId: ServiceTagId) => {
    setSelectedTag(tagId);
    setReviewIndex(0);
    applyTemplate(lang, tagId, selectedStars, 0);
  };

  const handleSelectStar = (stars: number) => {
    setSelectedStars(stars);
    setReviewIndex(0);
    applyTemplate(lang, selectedTag, stars, 0);
  };

  const handleLanguageChange = (nextLang: LanguageCode) => {
    setLang(nextLang);
    setReviewIndex(0);
    applyTemplate(nextLang, selectedTag, selectedStars, 0);
  };

  const handleRefreshReview = () => {
    const nextIdx = reviewIndex + 1;
    setReviewIndex(nextIdx);
    applyTemplate(lang, selectedTag, selectedStars, nextIdx);
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 260);
  };

  const directReviewTargetUrl = resolveGoogleReviewRedirectUrl(config);

  const openUrlInNewTab = (url: string) => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleCopyCelebrateAndRedirect = () => {
    const trimmed = reviewText.trim().replace(/^⭐+\s*[-–—]?\s*/, '');
    const starFooter = `${'⭐'.repeat(selectedStars)} (${selectedStars}/5 Stars)`;
    const hasTrailingStars = /⭐+\s*\(\d\/5 Stars\)\s*$/.test(trimmed);
    const formattedReview = hasTrailingStars ? trimmed : `${trimmed}\n\n${starFooter}`;
    copyTextReliably(formattedReview);

    try {
      confetti({
        particleCount: 95,
        spread: 80,
        origin: {y: 0.65},
        colors: ['#f59e0b', '#fb923c', '#22c55e', '#38bdf8', '#facc15'],
        disableForReducedMotion: true,
      });
    } catch {
      // Ignore confetti canvas errors
    }

    setShowToast(true);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setShowToast(false);
    }, 5000);

    if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current);
    redirectTimerRef.current = window.setTimeout(() => {
      openUrlInNewTab(directReviewTargetUrl);
    }, 700);
  };

  const activeStars = hoverStars ?? selectedStars;
  const copy = UI_COPY[lang];
  const whatsappHref = buildWhatsappHref(config);
  const telHref = buildTelHref(config.phoneNumber);
  const safeMapsUrl = getSafeGoogleUrl(config.googleMapsUrl);

  return (
    <div className="min-h-screen bg-[#040B16] text-slate-100 sm:py-6 sm:px-4 flex flex-col items-center justify-start">
      {/* Floating Toast Banner */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[396px] rounded-2xl bg-emerald-950/95 border border-emerald-400/40 px-4 py-3.5 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-semibold text-emerald-100">
              {copy.toastMsg}
            </span>
          </div>
          <a
            href={directReviewTargetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-amber-300 hover:text-amber-200 underline underline-offset-2 whitespace-nowrap shrink-0"
          >
            {copy.openNow}
          </a>
        </div>
      )}

      {/* Mobile-Centric Frame Container (max-w 420px across mobile, tablet, and desktop) */}
      <div className="w-full max-w-[420px] min-h-screen sm:min-h-0 flex flex-col bg-[#071120] bg-[radial-gradient(ellipse_at_top,_rgba(249,115,22,0.14)_0%,_rgba(14,32,61,0.6)_42%,_#071120_100%)] sm:rounded-[28px] sm:border sm:border-white/10 sm:shadow-[0_24px_80px_rgba(0,0,0,0.65)] overflow-hidden">
        {/* Compact Top Bar */}
        <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-[#071120]/85 backdrop-blur-md">
          <div className="px-4 h-14 flex items-center justify-between gap-4">
            <a
              href="#top"
              className="font-display text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
            >
              {config.brandName}
            </a>

            <div className="flex items-center shrink-0">
              <a
                href={telHref}
                className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-display font-bold text-xs inline-flex items-center justify-center transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                Call Now
              </a>
            </div>
          </div>
        </header>

        <main id="top" className="flex-1 w-full px-4 py-6 space-y-6">
          {/* 1. Custom Mid-Size Fixed Logo & Header Section */}
          <section
            aria-label="Business Profile Header"
            className="flex flex-col items-center text-center"
          >
            <div className="mb-4 w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-[#0F213B] border-2 border-amber-400/75 ring-4 ring-amber-400/15 shadow-[0_14px_38px_rgba(245,158,11,0.2)] p-2.5 flex items-center justify-center overflow-hidden">
              {!logoFailed ? (
                <img
                  src={OFFICIAL_LOGO_URL}
                  alt="Plumber Wallace official brand logo"
                  referrerPolicy="no-referrer"
                  onError={() => setLogoFailed(true)}
                  className="w-full h-full object-contain rounded-2xl"
                />
              ) : (
                <Wrench className="w-12 h-12 text-amber-400" aria-hidden="true" />
              )}
            </div>

            <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">
              {config.brandName}
            </h1>
            <p className="mt-1.5 text-sm text-slate-300 max-w-xs">
              {lang === 'en' ? config.tagline : copy.tagline}
            </p>

            {/* Rating Display: 5 stars + 4.9 */}
            <div className="mt-3 flex items-center justify-center gap-2 text-sm">
              <div className="flex items-center gap-0.5" aria-hidden="true">
                {Array.from({length: 5}).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <span className="font-bold text-white tabular-nums">
                {config.ratingScore}
              </span>
            </div>
          </section>

          {/* 2. Dynamic Language-Based Non-Scrolling Service Tags Grid */}
          <section aria-label="Select Plumbing Service">
            <div className="flex flex-wrap justify-center gap-2">
              {SERVICE_OPTIONS.map((option) => {
                const isSelected = selectedTag === option.id;
                const label = option[lang];
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelectTag(option.id)}
                    aria-pressed={isSelected}
                    className={`min-h-[38px] px-3.5 py-2 rounded-full text-xs font-semibold border transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-[#0F213B] text-slate-200 border-white/10 hover:border-amber-400/50 hover:bg-[#142B4C]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 3. Language Toggle Switcher */}
          <section aria-label="Language Switcher" className="flex justify-center">
            <div
              role="group"
              aria-label="Choose review language"
              className="inline-flex p-1 rounded-xl bg-[#0F213B] border border-white/10"
            >
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                aria-pressed={lang === 'en'}
                className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  lang === 'en'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                ENGLISH
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('hi')}
                aria-pressed={lang === 'hi'}
                className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  lang === 'hi'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                हिंदी (HINDI)
              </button>
            </div>
          </section>

          {/* 4. Smart Review Box (Interactive 5-Star + Copy & Paste + Confetti) */}
          <section
            id="smart-review"
            className="rounded-2xl bg-[#0D1E38] border border-white/10 p-5 shadow-2xl shadow-black/35"
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <h2 className="font-display text-xs sm:text-sm font-bold tracking-wider text-amber-400">
                  {copy.yourReview}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 text-xs font-bold tabular-nums">
                  <span>{selectedStars.toFixed(1)}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                </span>
              </div>

              <button
                type="button"
                onClick={handleRefreshReview}
                aria-label="Generate a fresh review"
                title="Generate another review"
                className="min-h-[44px] min-w-[44px] rounded-xl bg-[#152B4D] hover:bg-[#1B3761] border border-white/10 text-amber-400 inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <RefreshCw
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isRefreshing ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* Interactive Clickable 5-Star Selector */}
            <div
              className="flex items-center gap-1 mb-4"
              role="group"
              aria-label="Select star rating for review preview"
            >
              {[1, 2, 3, 4, 5].map((starValue) => {
                const isFilled = starValue <= activeStars;
                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => handleSelectStar(starValue)}
                    onMouseEnter={() => setHoverStars(starValue)}
                    onMouseLeave={() => setHoverStars(null)}
                    aria-label={`Select ${starValue} out of 5 stars`}
                    aria-pressed={selectedStars === starValue}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-white/5 active:scale-95 transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    <Star
                      className={`w-7 h-7 transition-colors duration-150 ${
                        isFilled
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-600 fill-transparent'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <label htmlFor="smart-review-textarea" className="sr-only">
              Pre-written customer review text
            </label>
            <textarea
              id="smart-review-textarea"
              rows={5}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full rounded-xl bg-[#081222] border border-white/15 p-3.5 text-sm text-slate-100 leading-relaxed focus:outline-none focus:border-amber-400 resize-none"
            />

            {/* Full-Width Gradient Button: COPY & PASTE ON GOOGLE */}
            <button
              type="button"
              onClick={handleCopyCelebrateAndRedirect}
              className="mt-4 w-full min-h-[54px] px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:via-amber-400 hover:to-orange-400 active:scale-[0.98] text-slate-950 font-display font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F213B]"
            >
              {showToast ? (
                <Check className="w-5 h-5 shrink-0" aria-hidden="true" />
              ) : (
                <ClipboardCopy className="w-5 h-5 shrink-0" aria-hidden="true" />
              )}
              <span className="whitespace-nowrap">{copy.copyBtn}</span>
              <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>
          </section>

          {/* 5. Quick Action Circular Icons Grid */}
          <section
            id="quick-actions"
            className="rounded-2xl bg-[#0D1E38] border border-white/10 p-5"
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 text-center">
              {copy.quickActionsTitle}
            </h3>

            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center">
              {/* Call */}
              <a
                href={telHref}
                className="group flex flex-col items-center gap-1.5 focus-visible:outline-none"
              >
                <span className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#152B4D] border border-white/10 group-hover:border-orange-400/70 group-hover:bg-orange-500/15 group-active:scale-95 flex items-center justify-center text-orange-400 transition-all duration-150 group-focus-visible:ring-2 group-focus-visible:ring-amber-400">
                  <PhoneCall className="w-5 h-5" aria-hidden="true" />
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-200 group-hover:text-orange-300 transition-colors whitespace-nowrap">
                  {copy.callLabel}
                </span>
              </a>

              {/* WhatsApp */}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-1.5 focus-visible:outline-none"
              >
                <span className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#152B4D] border border-white/10 group-hover:border-emerald-400/70 group-hover:bg-emerald-500/15 group-active:scale-95 flex items-center justify-center text-emerald-400 transition-all duration-150 group-focus-visible:ring-2 group-focus-visible:ring-emerald-400">
                  <MessageCircle className="w-5 h-5" aria-hidden="true" />
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors whitespace-nowrap">
                  {copy.whatsappLabel}
                </span>
              </a>

              {/* Website */}
              <a
                href="#"
                className="group flex flex-col items-center gap-1.5 focus-visible:outline-none"
              >
                <span className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#152B4D] border border-white/10 group-hover:border-violet-400/70 group-hover:bg-violet-500/15 group-active:scale-95 flex items-center justify-center text-violet-400 transition-all duration-150 group-focus-visible:ring-2 group-focus-visible:ring-violet-400">
                  <Globe className="w-5 h-5" aria-hidden="true" />
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-200 group-hover:text-violet-300 transition-colors whitespace-nowrap">
                  {copy.websiteLabel}
                </span>
              </a>

              {/* Maps */}
              <a
                href={safeMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-1.5 focus-visible:outline-none"
              >
                <span className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#152B4D] border border-white/10 group-hover:border-amber-400/70 group-hover:bg-amber-500/15 group-active:scale-95 flex items-center justify-center text-amber-400 transition-all duration-150 group-focus-visible:ring-2 group-focus-visible:ring-amber-400">
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors whitespace-nowrap">
                  {copy.mapsLabel}
                </span>
              </a>

              {/* Google */}
              <a
                href={directReviewTargetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-1.5 focus-visible:outline-none"
              >
                <span className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#152B4D] border border-white/10 group-hover:border-sky-400/70 group-hover:bg-sky-500/15 group-active:scale-95 flex items-center justify-center text-sky-300 transition-all duration-150 group-focus-visible:ring-2 group-focus-visible:ring-sky-400">
                  <Star className="w-5 h-5" aria-hidden="true" />
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-200 group-hover:text-sky-300 transition-colors whitespace-nowrap">
                  {copy.googleLabel}
                </span>
              </a>
            </div>
          </section>

          {/* 6. Professional Plumber Photo Card (Bottom Above Footer) */}
          <section
            aria-label="Verified Service Technician"
            className="rounded-2xl bg-[#0D1E38] border border-white/10 overflow-hidden shadow-xl shadow-black/30"
          >
            <div className="relative h-56 bg-[#0B192E]">
              {!photoFailed ? (
                <img
                  src={technicianPhoto}
                  alt="Smiling verified Plumber Wallace technician with professional plumbing tools"
                  referrerPolicy="no-referrer"
                  onError={() => setPhotoFailed(true)}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#13294B] to-[#081222]">
                  <Wrench className="w-10 h-10 text-amber-400 mb-2" aria-hidden="true" />
                  <span className="font-display text-sm font-semibold text-white">
                    {config.brandName}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F213B] via-[#0F213B]/25 to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#081222]/85 border border-emerald-400/40 text-xs font-semibold text-emerald-300 backdrop-blur-md shadow-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                <span className="tabular-nums">{copy.verifiedBadge}</span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-display text-base font-bold text-white">
                {copy.techTitle}
              </h3>
              <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                <span>{copy.techLocation}</span>
              </p>
            </div>
          </section>
        </main>

        {/* Clean Production Footer */}
        <footer className="w-full border-t border-white/10 bg-[#070F1D] py-4 px-4 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} {config.brandName}. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
