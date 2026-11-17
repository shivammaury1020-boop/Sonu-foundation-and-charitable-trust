import React, { useState } from 'react';
import {
  Calendar,
  GraduationCap,
  Award,
  CheckCircle2,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  HeartHandshake,
  Send,
  AlertCircle,
  Edit3,
  ShieldCheck,
} from 'lucide-react';
import {
  BUSINESS_CLAIMS_CONFIG,
  BUSINESS_INFO,
  COURSES,
  GALLERY_ITEMS,
  GalleryCategory,
  GalleryItem,
  LOCATIONS,
  OWNER_PROFILE,
  PageId,
  SERVICES,
  VERIFIED_REVIEWS,
} from '../data/siteData';
import {
  ContactMessageInput,
  ContactMessageRecord,
  buildWhatsAppGeneralUrl,
  submitContactMessageToServer,
  validateContactMessage,
} from '../utils/bookingLogic';
import { ConnectWithUsSection } from './ConnectWithUsSection';

interface PageNavProps {
  onNavigate: (page: PageId, param?: string) => void;
  onQuickBookLocation?: (locationId: string) => void;
}

/* ==================== ABOUT PAGE ==================== */
export const AboutPageView: React.FC<PageNavProps> = ({ onNavigate }) => {
  return (
    <div className="py-10 sm:py-14 bg-[#FAF5EF] space-y-14">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden border border-[#C8A15A]/45 shadow-lg">
              <img
                src="/assets/aistudio/Hands-On_Salon_Beauty_Training_Class_836f26eb.png"
                alt="Hands-on salon and beauty training class with SBS students and instructor in Vadodara"
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-96 object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold tracking-[0.18em] uppercase text-[#6B173D]">
              ABOUT OUR FOUNDATION
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#201B1D] leading-tight">
              Building confidence, capability and a stronger future for women
            </h1>
            <p className="text-sm sm:text-base text-[#6E6265] leading-relaxed">
              Sonu Foundation and Charitable Trust is a community-focused initiative rooted in compassion, dignity and practical opportunity. Our work supports women through educational guidance, vocational skill development, and social support that helps them move forward with confidence.
            </p>
            <p className="text-sm sm:text-base text-[#6E6265] leading-relaxed">
              Through skill-oriented training and community engagement, we help learners access meaningful opportunities in beauty, wellness, tailoring and future-focused livelihood pathways. The foundation remains committed to uplifting women and families through education, training and supportive community work in Vadodara, Gujarat.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="bg-white p-4 rounded-2xl border border-[#C8A15A]/35 text-center">
                <div className="font-serif-luxury text-2xl font-bold text-[#6B173D] tabular-nums">{LOCATIONS.length}</div>
                <div className="text-xs text-[#6E6265]">Locations</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#C8A15A]/35 text-center">
                <div className="font-serif-luxury text-2xl font-bold text-[#6B173D] tabular-nums">{COURSES.length}</div>
                <div className="text-xs text-[#6E6265]">Training Pathways</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#C8A15A]/35 text-center">
                <div className="font-serif-luxury text-2xl font-bold text-[#6B173D] tabular-nums">3</div>
                <div className="text-xs text-[#6E6265]">Program Focus</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#C8A15A]/35 text-center">
                <div className="font-serif-luxury text-base font-bold text-[#6B173D] mt-1">Purpose</div>
                <div className="text-xs text-[#6E6265]">Driven</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-sm font-semibold px-6 py-3.5 rounded-xl shadow-sm cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#E6C98F]" />
                <span>Contact Our Foundation</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('academy')}
                className="inline-flex items-center gap-2 bg-white hover:bg-[#F3E9DF] text-[#201B1D] border border-[#C8A15A]/45 text-sm font-semibold px-6 py-3.5 rounded-xl cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-[#6B173D]" />
                <span>Explore Our Programs</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F6EFE7] rounded-3xl p-6 sm:p-10 border border-[#C8A15A]/35 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h2 className="font-serif-luxury text-xl font-bold text-[#4A0D29]">
              01. Professional Salon Care
            </h2>
            <p className="text-sm text-[#6E6265] leading-relaxed">
              From customized skin-care facials and keratin hair treatments to bridal makeup and nail extensions, every service uses quality salon products and strict hygiene protocols.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="font-serif-luxury text-xl font-bold text-[#4A0D29]">
              02. Career-Focused Academy
            </h2>
            <p className="text-sm text-[#6E6265] leading-relaxed">
              Our academy empowers students through classroom theory, live demonstrations, and hands-on practice sessions across 9 beauty courses. {BUSINESS_INFO.certificationDisclaimer}
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="font-serif-luxury text-xl font-bold text-[#4A0D29]">
              03. Community Commitment
            </h2>
            <p className="text-sm text-[#6E6265] leading-relaxed">
              Through Sonu Foundation &amp; Charitable Trust, we support vocational skill awareness and women’s self-reliance initiatives in our community.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ==================== GALLERY PAGE ==================== */
export const GalleryPageView: React.FC<PageNavProps> = ({ onNavigate }) => {
  const [category, setCategory] = useState<GalleryCategory>('All');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState<boolean>(false);

  const categories: GalleryCategory[] = [
    'All',
    'Salon',
    'Makeup',
    'Hair',
    'Nails',
    'Academy',
    'Students',
    'Certificates',
    'Videos',
  ];

  const items =
    category === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === category);

  const currentItem: GalleryItem | null =
    activeIndex !== null && items[activeIndex] ? items[activeIndex] : null;

  const handleNext = () => {
    if (activeIndex === null) return;
    setZoomed(false);
    setActiveIndex((activeIndex + 1) % items.length);
  };

  const handlePrev = () => {
    if (activeIndex === null) return;
    setZoomed(false);
    setActiveIndex((activeIndex - 1 + items.length) % items.length);
  };

  return (
    <div className="py-10 sm:py-14 bg-[#FAF5EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-[0.18em] uppercase text-[#6B173D]">
            REAL STUDIO &amp; ACADEMY PORTFOLIO
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#201B1D]">
            Photo &amp; Video Gallery
          </h1>
          <p className="text-sm sm:text-base text-[#6E6265]">
            Explore real photographs of our Vadodara beauty studio interior, bridal makeup artistry, hair and nail work, academy training sessions, and student certificate ceremonies.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div
          className="flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="Gallery category filter"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={category === cat}
              onClick={() => {
                setCategory(cat);
                setActiveIndex(null);
              }}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                category === cat
                  ? 'bg-[#6B173D] text-white border-[#6B173D] shadow-sm'
                  : 'bg-white text-[#201B1D] border-[#C8A15A]/40 hover:border-[#6B173D]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#C8A15A]/35 shadow-sm hover:shadow-md overflow-hidden flex flex-col justify-between transition-all"
            >
              <button
                type="button"
                onClick={() => {
                  setZoomed(false);
                  setActiveIndex(idx);
                }}
                className="relative w-full h-60 bg-[#201B1D] overflow-hidden block text-left group focus:outline-none"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover ${
                    item.src.includes('8_7b92f75e')
                      ? 'object-top'
                      : item.src.includes('b3134fa2') || item.src.includes('3ef1e822')
                      ? 'object-[center_65%]'
                      : 'object-center'
                  } group-hover:scale-105 transition-transform duration-300`}
                />
                {item.isVideo && item.videoSrc && (
                  <video
                    src={item.videoSrc}
                    poster={item.src}
                    muted
                    loop
                    autoPlay
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                  />
                )}
                {item.isVideo && (
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <span className="w-12 h-12 rounded-full bg-[#6B173D]/90 text-white flex items-center justify-center shadow-lg border border-[#C8A15A]/60">
                      <Play className="w-5 h-5 fill-current" />
                    </span>
                  </div>
                )}
              </button>

              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B173D]">
                    {item.category}
                  </span>
                  <h2 className="font-serif-luxury text-base font-bold text-[#201B1D]">
                    {item.title}
                  </h2>
                  <p className="text-xs text-[#6E6265] mt-0.5">{item.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setZoomed(false);
                    setActiveIndex(idx);
                  }}
                  aria-label={`Open ${item.title} in lightbox`}
                  className="p-2 rounded-lg bg-[#FAF5EF] hover:bg-[#F3E9DF] text-[#6B173D] shrink-0 cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal with Zoom, Video Playback & Swipe/Arrow Navigation */}
        {currentItem && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={currentItem.title}
            onClick={() => setActiveIndex(null)}
          >
            <div
              className="max-w-4xl w-full bg-[#FAF5EF] rounded-2xl overflow-hidden border border-[#C8A15A] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Controls */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#4A0D29] text-white">
                <div className="truncate pr-4">
                  <span className="text-xs text-[#E6C98F] font-semibold mr-2">
                    {currentItem.category}
                  </span>
                  <span className="font-serif-luxury text-sm sm:text-base font-bold">
                    {currentItem.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!currentItem.isVideo && (
                    <button
                      type="button"
                      onClick={() => setZoomed(!zoomed)}
                      aria-label={zoomed ? 'Zoom Out' : 'Zoom In'}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                    >
                      {zoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveIndex(null)}
                    aria-label="Close lightbox"
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Media Viewport */}
              <div className="relative bg-[#161214] flex items-center justify-center min-h-[300px] sm:min-h-[420px] max-h-[72vh] overflow-auto">
                {currentItem.isVideo && currentItem.videoSrc ? (
                  <video
                    src={currentItem.videoSrc}
                    poster={currentItem.src}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="w-full max-h-[68vh] object-contain"
                  />
                ) : (
                  <img
                    src={currentItem.src}
                    alt={currentItem.title}
                    className={`transition-transform duration-200 ${
                      zoomed
                        ? 'scale-150 cursor-zoom-out'
                        : 'max-h-[68vh] w-auto object-contain cursor-zoom-in'
                    }`}
                    onClick={() => setZoomed(!zoomed)}
                  />
                )}

                {items.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#4A0D29]/85 hover:bg-[#6B173D] text-white flex items-center justify-center shadow-md cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#4A0D29]/85 hover:bg-[#6B173D] text-white flex items-center justify-center shadow-md cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Bottom Caption */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF5EF]">
                <p className="text-xs sm:text-sm text-[#6E6265]">{currentItem.subtitle}</p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveIndex(null);
                    onNavigate('book');
                  }}
                  className="inline-flex items-center gap-1.5 bg-[#6B173D] text-white text-xs font-semibold px-4 py-2 rounded-lg shrink-0 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#E6C98F]" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ==================== REVIEWS PAGE ==================== */
export const ReviewsPageView: React.FC<PageNavProps> = ({ onNavigate }) => {
  return (
    <div className="py-10 sm:py-14 bg-[#FAF5EF]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-[0.18em] uppercase text-[#6B173D]">
            CLIENT FEEDBACK • VADODARA
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#201B1D]">
            Client Reviews &amp; Feedback
          </h1>
          <p className="text-sm sm:text-base text-[#6E6265]">
            We display only verified client testimonials and never publish fabricated customer reviews.
          </p>
        </div>

        {/* Verified Reviews List (when verified reviews are configured) */}
        {VERIFIED_REVIEWS.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {VERIFIED_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C8A15A]/45 shadow-sm flex flex-col sm:flex-row items-center gap-6"
              >
                {rev.avatar && (
                  <img
                    src={rev.avatar}
                    alt={rev.customerName}
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-[#C8A15A] shrink-0"
                  />
                )}
                <div className="space-y-3 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1 text-[#C8A15A]">
                    {Array.from({ length: rev.rating }).map((_, idx) => (
                      <Star key={idx} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="font-serif-luxury text-lg sm:text-xl text-[#201B1D] italic leading-relaxed">
                    “{rev.text}”
                  </p>
                  <div>
                    <div className="font-serif-luxury text-xl font-bold text-[#201B1D]">
                      {rev.customerName}
                    </div>
                    <div className="text-xs text-[#6E6265]">
                      {rev.serviceName} · {rev.verifiedLabel}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Google Reviews & Feedback CTA Card */}
        <div className="bg-[#F6EFE7] rounded-3xl p-6 sm:p-8 border border-[#C8A15A]/40 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B173D]">
            <ShieldCheck className="w-4 h-4 text-[#C8A15A]" />
            <span>Verified Google Maps Reviews</span>
          </div>
          <h2 className="font-serif-luxury text-2xl font-bold text-[#201B1D]">
            Read &amp; Share Genuine Reviews on Google Maps
          </h2>
          <p className="text-sm text-[#6E6265] max-w-xl mx-auto">
            Visited Sonu’s Beauty Studio &amp; Academy recently? Read authentic reviews from real clients on Google Maps, share your own feedback, or book your next beauty appointment with us today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={BUSINESS_INFO.googleReviewsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#FAF5EF] text-[#4A0D29] border border-[#C8A15A]/50 text-sm font-semibold px-6 py-3 rounded-xl shadow-sm"
            >
              <Star className="w-4 h-4 text-[#C8A15A] fill-current" />
              <span>View on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#F3E9DF] text-[#6B173D] border border-[#6B173D]/40 text-sm font-semibold px-6 py-3 rounded-xl shadow-sm cursor-pointer"
            >
              <span>Share Your Feedback</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('book')}
              className="inline-flex items-center gap-2 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-sm cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#E6C98F]" />
              <span>Book Your Appointment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==================== LOCATIONS PAGE ==================== */
export const LocationsPageView: React.FC<PageNavProps> = ({
  onNavigate,
  onQuickBookLocation,
}) => {
  return (
    <div className="py-10 sm:py-14 bg-[#FAF5EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-[0.18em] uppercase text-[#6B173D]">
            TWO SEPARATE LOCATIONS IN VADODARA, GUJARAT
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#201B1D]">
            Our Locations
          </h1>
          <p className="text-sm sm:text-base text-[#6E6265]">
            Visit either of our Sonu’s Beauty Studio &amp; Academy branches in Vadodara for salon treatments or academy admissions. Location 1 (Dabhoi-Waghodia Ring Road) and Location 2 (GPS: 22.305021, 73.210297) are separate branches.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {LOCATIONS.map((loc) => (
            <div
              key={loc.id}
              className="bg-white rounded-3xl border border-[#C8A15A]/45 shadow-md overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider text-[#6B173D]">
                  <span>{loc.badge}</span>
                  {loc.coordinates && (
                    <span className="tabular-nums bg-[#FAF5EF] px-2.5 py-1 rounded-md border border-[#C8A15A]/35">
                      GPS: {loc.coordinates}
                    </span>
                  )}
                </div>
                <h2 className="font-serif-luxury text-2xl font-bold text-[#201B1D]">
                  {loc.name}
                </h2>
                <div className="space-y-2 text-sm text-[#6E6265]">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#6B173D] shrink-0 mt-1" />
                    <div>
                      {loc.addressLines.map((line, i) => (
                        <div key={i} className="text-[#201B1D] font-medium">
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#6B173D] shrink-0" />
                    <a
                      href={`tel:${BUSINESS_INFO.phoneRaw}`}
                      className="text-[#201B1D] hover:text-[#6B173D] font-medium tabular-nums"
                    >
                      {loc.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#C8A15A] shrink-0" />
                    <span>{loc.hours}</span>
                  </div>
                </div>

                {/* Embedded Map */}
                <div className="rounded-2xl overflow-hidden border border-[#C8A15A]/35 h-56 bg-[#F3E9DF]">
                  <iframe
                    title={loc.name}
                    src={loc.mapEmbedUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              <div className="px-6 sm:px-8 pb-6 pt-4 bg-[#FAF5EF] border-t border-[#C8A15A]/25 flex flex-wrap items-center gap-3">
                <a
                  href={loc.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl shadow-sm transition-colors"
                >
                  <MapPin className="w-4 h-4 text-[#E6C98F]" />
                  <span>Get Directions</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    if (onQuickBookLocation) {
                      onQuickBookLocation(loc.id);
                    } else {
                      onNavigate('book');
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-white hover:bg-[#F3E9DF] text-[#6B173D] border border-[#6B173D]/40 text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book at {loc.id === 'location-1' ? 'Location 1' : 'Location 2'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ==================== CONTACT PAGE ==================== */
export const ContactPageView: React.FC<{
  onNavigate: (page: PageId) => void;
  onSaveContactMessage: (record: ContactMessageRecord) => void;
}> = ({ onNavigate, onSaveContactMessage }) => {
  const [form, setForm] = useState<ContactMessageInput>({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedRecord, setSavedRecord] = useState<ContactMessageRecord | null>(null);
  const [activeMapLocIndex, setActiveMapLocIndex] = useState<0 | 1>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);
    const check = validateContactMessage(form);
    if (!check.valid) {
      setError(check.error || 'Please check your form details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const record = await submitContactMessageToServer(form);
      onSaveContactMessage(record);
      setSavedRecord(record);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to reach the server to save your message. Please try again or message us on WhatsApp.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeMapLocation = LOCATIONS[activeMapLocIndex];

  return (
    <div className="py-10 sm:py-14 bg-[#FAF5EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#6B173D]">
            WE ARE HERE FOR YOU · VADODARA
          </p>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#201B1D] text-balance">
            Contact Sonu’s Beauty Studio &amp; Academy
          </h1>
          <p className="text-sm sm:text-base text-[#6E6265] leading-relaxed">
            Reach out directly for bridal artistry consultations, salon appointments, or beauty academy admissions in Vadodara.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Owner Portrait Card + Direct Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Owner's Professional Portrait Card */}
            <article className="bg-white rounded-2xl border border-[#C8A15A]/45 shadow-sm overflow-hidden group transition-all duration-200 hover:shadow-md">
              <div className="relative aspect-[4/3] w-full bg-[#F6EFE7] overflow-hidden">
                <img
                  src={OWNER_PROFILE.photoUrl}
                  alt={OWNER_PROFILE.photoAlt}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-[50%_14%] transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                />
              </div>

              <div className="p-6 space-y-2.5">
                <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#6B173D]">
                  {OWNER_PROFILE.designation}
                </p>
                <h2 className="font-serif-luxury text-2xl sm:text-[1.7rem] font-bold text-[#201B1D] leading-snug">
                  {OWNER_PROFILE.name}
                </h2>
                <p className="text-xs font-medium text-[#4A0D29]/85">
                  {OWNER_PROFILE.organization}
                </p>
                <p className="text-sm text-[#6E6265] leading-relaxed pt-2.5 border-t border-[#C8A15A]/25">
                  {OWNER_PROFILE.summary}
                </p>
              </div>
            </article>

            {/* Direct Contact Details Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#C8A15A]/40 shadow-sm space-y-5">
              <h2 className="font-serif-luxury text-2xl font-bold text-[#201B1D]">
                Direct Contact Details
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#6B173D] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="text-xs text-[#6E6265] block">Phone &amp; WhatsApp</span>
                    <a
                      href={`tel:${BUSINESS_INFO.phoneRaw}`}
                      className="font-bold text-[#201B1D] hover:text-[#6B173D] tabular-nums transition-colors"
                    >
                      {BUSINESS_INFO.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#6B173D] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="text-xs text-[#6E6265] block">Business Email</span>
                    {BUSINESS_INFO.email ? (
                      <a
                        href={`mailto:${BUSINESS_INFO.email}`}
                        className="font-bold text-[#201B1D] hover:text-[#6B173D] break-all transition-colors"
                      >
                        {BUSINESS_INFO.email}
                      </a>
                    ) : (
                      <span className="text-xs sm:text-sm font-medium text-[#6E6265]">
                        Official email will be updated shortly — reach us via WhatsApp, Phone, or this form.
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#C8A15A] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="text-xs text-[#6E6265] block">Opening Hours</span>
                    <span className="font-semibold text-[#201B1D]">{BUSINESS_INFO.hours}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#C8A15A]/25 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => onNavigate('book')}
                  className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4 text-[#E6C98F] shrink-0" />
                  <span>Book Appointment</span>
                </button>
                <a
                  href={buildWhatsAppGeneralUrl(
                    'Hello Sonu Foundation and Charitable Trust, I would like to get in touch.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 bg-[#FAF5EF] hover:bg-[#F3E9DF] text-[#4A0D29] border border-[#C8A15A]/50 text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 text-[#6B173D] shrink-0" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form + Studio Locations & Google Maps */}
          <div className="lg:col-span-7 space-y-6">
            {savedRecord ? (
              <div className="bg-white rounded-2xl p-8 border border-[#C8A15A]/45 shadow-sm text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#6B173D] mx-auto" />
                <div className="text-xs font-semibold text-[#6B173D]">
                  Saved to Database · Ref ID: {savedRecord.reference_id}
                </div>
                <h2 className="font-serif-luxury text-2xl font-bold text-[#201B1D]">
                  Message Saved &amp; Received
                </h2>
                <p className="text-sm text-[#6E6265] max-w-md mx-auto">
                  Thank you for contacting Sonu’s Beauty Studio &amp; Academy. Your message has been recorded in our database and our team will respond to your enquiry shortly.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <a
                    href={buildWhatsAppGeneralUrl(
                      `Hello Sonu Foundation and Charitable Trust, my name is ${savedRecord.name} (Ref: ${savedRecord.reference_id}). ${savedRecord.message}`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#E6C98F]" />
                    <span>Also Send via WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSavedRecord(null);
                      setForm({ name: '', phone: '', email: '', message: '' });
                    }}
                    className="px-5 py-3 rounded-xl border border-[#C8A15A]/45 text-sm font-medium text-[#201B1D] hover:bg-[#FAF5EF] transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-white rounded-2xl p-6 sm:p-8 border border-[#C8A15A]/40 shadow-sm space-y-4"
              >
                <div>
                  <h2 className="font-serif-luxury text-2xl font-bold text-[#201B1D]">
                    Send Us a Message
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6E6265] mt-1">
                    Share your appointment request, bridal inquiry, or course question and our studio team will reply promptly.
                  </p>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl bg-[#6B173D]/10 border border-[#6B173D]/40 text-xs sm:text-sm text-[#4A0D29] flex items-center gap-2 font-medium"
                  >
                    <AlertCircle className="w-4 h-4 text-[#6B173D] shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-[#201B1D] mb-1">
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border border-[#C8A15A]/45 bg-[#FAF5EF] px-3.5 py-2.5 text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-semibold text-[#201B1D] mb-1">
                      Phone Number *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-xl border border-[#C8A15A]/45 bg-[#FAF5EF] px-3.5 py-2.5 text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-[#201B1D] mb-1">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-[#C8A15A]/45 bg-[#FAF5EF] px-3.5 py-2.5 text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-[#201B1D] mb-1">
                    Your Message *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    placeholder="How can we help you?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-xl border border-[#C8A15A]/45 bg-[#FAF5EF] px-3.5 py-2.5 text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 bg-[#6B173D] hover:bg-[#4A0D29] disabled:opacity-60 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#E6C98F]" />
                    <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('courses')}
                    className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl border border-[#C8A15A]/50 bg-[#FAF5EF] hover:bg-[#F3E9DF] text-xs sm:text-sm font-semibold text-[#4A0D29] transition-colors cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4 text-[#6B173D]" />
                    <span>Explore Courses</span>
                  </button>
                </div>
              </form>
            )}

            {/* Studio Locations & Interactive Google Map */}
            <div className="bg-white rounded-2xl p-6 border border-[#C8A15A]/40 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#201B1D]">
                    Our Vadodara Studio &amp; Academy Locations
                  </h2>
                  <p className="text-xs text-[#6E6265] mt-0.5">
                    Select a campus below to view the address and Google Maps directions.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#FAF5EF] border border-[#C8A15A]/35 self-start sm:self-auto">
                  {LOCATIONS.map((loc, idx) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setActiveMapLocIndex(idx === 0 ? 0 : 1)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        activeMapLocIndex === idx
                          ? 'bg-[#6B173D] text-white shadow-sm'
                          : 'text-[#4A0D29] hover:bg-[#F3E9DF]'
                      }`}
                    >
                      Location {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                <div className="md:col-span-5 bg-[#FAF5EF] rounded-xl p-4 border border-[#C8A15A]/30 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="font-serif-luxury text-base font-bold text-[#4A0D29]">
                      {activeMapLocation.name}
                    </div>
                    <p className="text-xs text-[#6E6265] leading-relaxed">
                      {activeMapLocation.addressLines.join(' ')}
                    </p>
                    <p className="text-xs text-[#6E6265] pt-1">
                      <span className="font-semibold text-[#201B1D]">Hours:</span> {activeMapLocation.hours}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-[#C8A15A]/20">
                    <a
                      href={activeMapLocation.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#E6C98F]" />
                      <span>Get Directions</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() => onNavigate('locations')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B173D] hover:underline px-2 py-2 cursor-pointer"
                    >
                      <span>All Branch Details</span>
                    </button>
                  </div>
                </div>

                <div className="md:col-span-7 rounded-xl overflow-hidden border border-[#C8A15A]/35 bg-[#F6EFE7] min-h-[210px]">
                  <iframe
                    src={activeMapLocation.mapEmbedUrl}
                    title={`Google Maps location for ${activeMapLocation.name}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full min-h-[210px] border-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connect With Us Official Social Profiles */}
        <ConnectWithUsSection variant="contact" />
      </div>
    </div>
  );
};

/* ==================== SONU FOUNDATION & CHARITABLE TRUST PAGE ==================== */
export const FoundationPageView: React.FC<PageNavProps> = ({ onNavigate }) => {
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [foundationContent, setFoundationContent] = useState({
    mission:
      'To empower individuals through practical vocational awareness, beauty & grooming skill literacy, and supportive community initiatives in Vadodara.',
    vision:
      'A self-reliant community where aspiring learners gain dignity, confidence, and livelihood skills through accessible guidance and mentorship.',
    initiatives:
      'Skill orientation sessions, grooming & hygiene awareness workshops, and guidance for aspiring beauty practitioners.',
    communityWork:
      'Supporting local learners with practical learning guidance, career orientation in beauty & wellness, and community outreach in Vadodara, Gujarat.',
  });

  return (
    <div className="py-10 sm:py-14 bg-[#FAF5EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-[#6B173D] to-[#4A0D29] text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#C8A15A]/45 shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase text-[#E6C98F]">
              <HeartHandshake className="w-4 h-4" />
              <span>COMMUNITY INITIATIVE • VADODARA, GUJARAT</span>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingContent(!isEditingContent)}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 text-[#E6C98F] px-3.5 py-1.5 rounded-lg border border-[#C8A15A]/40 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingContent ? 'Save Content View' : 'Customize Section Text'}</span>
            </button>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#FAF5EF]">
            Sonu Foundation &amp; Charitable Trust
          </h1>
          <p className="text-sm sm:text-base text-[#FAF5EF]/85 max-w-2xl leading-relaxed">
            Dedicated to skill development, confidence building, and community support alongside Sonu’s Beauty Studio &amp; Academy in Vadodara, Gujarat.
          </p>
        </div>

        {/* Mission, Vision, Initiatives, Community Work */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { key: 'mission' as const, title: 'Our Mission' },
            { key: 'vision' as const, title: 'Our Vision' },
            { key: 'initiatives' as const, title: 'Key Initiatives' },
            { key: 'communityWork' as const, title: 'Community Work' },
          ].map((block) => (
            <div
              key={block.key}
              className="bg-white rounded-2xl p-6 border border-[#C8A15A]/40 shadow-sm space-y-2.5"
            >
              <h2 className="font-serif-luxury text-2xl font-bold text-[#4A0D29]">
                {block.title}
              </h2>
              {isEditingContent ? (
                <textarea
                  rows={3}
                  aria-label={block.title}
                  value={foundationContent[block.key]}
                  onChange={(e) =>
                    setFoundationContent({
                      ...foundationContent,
                      [block.key]: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-[#C8A15A]/50 bg-[#FAF5EF] p-3 text-sm text-[#201B1D]"
                />
              ) : (
                <p className="text-sm sm:text-base text-[#6E6265] leading-relaxed">
                  {foundationContent[block.key]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Gallery */}
        <div className="space-y-4">
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#201B1D]">
            Training &amp; Community Moments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <img
              src="/assets/aistudio/05011b94a59e542fb701293ac388243d6819147811e7a17153452a10c6525cf8_f2701bd4.png"
              alt="Award recognition at Vadodara Grand Celebrity Award and Creative Seminar"
              referrerPolicy="no-referrer"
              className="w-full h-56 object-cover object-[center_30%] rounded-2xl border border-[#C8A15A]/40"
            />
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-11-04_at_7.13.59_AM_cde79219.jpeg"
              alt="Graduating learners with certificates"
              referrerPolicy="no-referrer"
              className="w-full h-56 object-cover rounded-2xl border border-[#C8A15A]/40"
            />
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-11-04_at_7.39.12_AM_41590311.jpeg"
              alt="Skill certification group"
              referrerPolicy="no-referrer"
              className="w-full h-56 object-cover rounded-2xl border border-[#C8A15A]/40"
            />
          </div>
          <p className="text-xs text-[#6E6265] italic">
            Program schedules, workshop availability, and trust registration details are provided directly upon enquiry.
          </p>
        </div>

        {/* Contact Foundation */}
        <div className="bg-[#F6EFE7] rounded-2xl p-6 sm:p-8 border border-[#C8A15A]/45 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="font-serif-luxury text-2xl font-bold text-[#201B1D]">
              Connect with Sonu Foundation &amp; Charitable Trust
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6265]">
              Vadodara, Gujarat · Phone: {BUSINESS_INFO.phoneDisplay}
              {BUSINESS_INFO.email ? ` · Email: ${BUSINESS_INFO.email}` : ''}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={buildWhatsAppGeneralUrl(
                'Hello Sonu Foundation and Charitable Trust, I would like to connect regarding your community and skill initiatives.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl"
            >
              <MessageCircle className="w-4 h-4 text-[#E6C98F]" />
              <span>Connect on WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 bg-white text-[#201B1D] border border-[#C8A15A]/50 text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl cursor-pointer"
            >
              <span>Contact Page</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==================== PRIVACY POLICY & TERMS PAGES ==================== */
export const PrivacyPolicyPageView: React.FC<PageNavProps> = ({ onNavigate }) => (
  <div className="py-12 bg-[#FAF5EF]">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl p-6 sm:p-10 border border-[#C8A15A]/40 shadow-sm space-y-5">
      <span className="text-xs font-bold uppercase tracking-wider text-[#6B173D]">
        LEGAL &amp; DATA PRIVACY
      </span>
      <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#201B1D]">
        Privacy Policy
      </h1>
      <p className="text-sm text-[#6E6265] leading-relaxed">
        Sonu’s Beauty Studio &amp; Academy (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) respects your privacy and is committed to protecting the personal contact details you share when booking an appointment or submitting a course enquiry.
      </p>
      <div className="space-y-3 text-sm text-[#201B1D]/90 leading-relaxed">
        <h2 className="font-serif-luxury text-xl font-bold text-[#4A0D29]">
          1. Information We Collect
        </h2>
        <p>
          When you request an appointment, submit a course enquiry, or contact us, we collect your name, phone number, WhatsApp number, email address, preferred branch location, and service/course preferences.
        </p>
        <h2 className="font-serif-luxury text-xl font-bold text-[#4A0D29]">
          2. How We Use Your Information
        </h2>
        <p>
          Your information is used strictly to coordinate and confirm your salon appointments, answer course admission enquiries, and provide customer support at our Vadodara locations. We never sell or rent your personal contact details to third parties.
        </p>
        <h2 className="font-serif-luxury text-xl font-bold text-[#4A0D29]">
          3. Contact Us
        </h2>
        <p>
          For any privacy-related questions, please contact Sonu’s Beauty Studio &amp; Academy at {BUSINESS_INFO.phoneDisplay}
          {BUSINESS_INFO.email ? ` or ${BUSINESS_INFO.email}` : ''}.
        </p>
      </div>
      <div className="pt-4">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="px-5 py-2.5 rounded-xl bg-[#6B173D] text-white text-xs font-semibold cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    </div>
  </div>
);

export const TermsPageView: React.FC<PageNavProps> = ({ onNavigate }) => (
  <div className="py-12 bg-[#FAF5EF]">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl p-6 sm:p-10 border border-[#C8A15A]/40 shadow-sm space-y-5">
      <span className="text-xs font-bold uppercase tracking-wider text-[#6B173D]">
        STUDIO &amp; ACADEMY GUIDELINES
      </span>
      <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#201B1D]">
        Terms &amp; Conditions
      </h1>
      <div className="space-y-3 text-sm text-[#201B1D]/90 leading-relaxed">
        <h2 className="font-serif-luxury text-xl font-bold text-[#4A0D29]">
          1. Appointments &amp; Confirmation
        </h2>
        <p>
          Submitting an online appointment request generates a booking reference with status &ldquo;Pending Confirmation&rdquo;. Final slot confirmation is provided by Sonu’s Beauty Studio &amp; Academy via phone or WhatsApp based on stylist and studio availability at your chosen Vadodara branch.
        </p>
        <h2 className="font-serif-luxury text-xl font-bold text-[#4A0D29]">
          2. Service Consultations &amp; Pricing
        </h2>
        <p>
          Service durations and pricing depend on hair length, density, skin requirements, and bridal package customization. Exact quotes are confirmed prior to starting your treatment. The 10% New Client offer applies to a client’s first salon service upon appointment confirmation.
        </p>
        <h2 className="font-serif-luxury text-xl font-bold text-[#4A0D29]">
          3. Academy Courses &amp; Certification
        </h2>
        <p>
          Course admission, batch timings, practical attendance, and certification requirements are shared during admission counselling at Sonu’s Beauty Studio &amp; Academy, Vadodara.
        </p>
      </div>
      <div className="pt-4">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="px-5 py-2.5 rounded-xl bg-[#6B173D] text-white text-xs font-semibold cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    </div>
  </div>
);
