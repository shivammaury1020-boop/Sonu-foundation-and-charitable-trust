import React, { useState } from 'react';
import {
  Calendar,
  ArrowRight,
  Crown,
  Leaf,
  ShieldCheck,
  GraduationCap,
  Award,
  Gem,
  Headphones,
  CheckCircle2,
  Star,
  MapPin,
  Phone,
  Clock,
  HeartHandshake,
  Play,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import {
  BUSINESS_CLAIMS_CONFIG,
  BUSINESS_INFO,
  COURSES,
  GALLERY_ITEMS,
  GalleryCategory,
  LOCATIONS,
  OWNER_PROFILE,
  PageId,
  SERVICES,
  TIME_SLOTS,
  VERIFIED_REVIEWS,
  WEBSITE_SERVICE_NAVIGATION,
} from '../data/siteData';
import { buildCategoryEnquiryWhatsAppUrl } from '../utils/bookingLogic';
import { ConnectWithUsSection } from './ConnectWithUsSection';
import { EnquiryCategoriesSection } from './EnquiryCategoriesSection';

interface HomeViewProps {
  onNavigate: (page: PageId, param?: string) => void;
  onQuickBookStart: (prefill: {
    location_id?: string;
    service_id?: string;
    appointment_date?: string;
    appointment_time?: string;
  }) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onQuickBookStart }) => {
  const [galleryTab, setGalleryTab] = useState<GalleryCategory>('All');
  const [quickLocation, setQuickLocation] = useState<string>('location-1');
  const [quickService, setQuickService] = useState<string>('');
  const [quickDate, setQuickDate] = useState<string>('');
  const [quickTime, setQuickTime] = useState<string>('');
  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    videoSrc?: string;
    title: string;
    subtitle: string;
  } | null>(null);

  const popularServices = SERVICES.filter((s) => s.featuredOnHome).slice(0, 6);

  const filteredHomeGallery =
    galleryTab === 'All'
      ? GALLERY_ITEMS.slice(0, 5)
      : GALLERY_ITEMS.filter((item) => item.category === galleryTab).slice(0, 5);

  const todayIso = new Date().toISOString().split('T')[0];

  const handleQuickBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickBookStart({
      location_id: quickLocation,
      service_id: quickService,
      appointment_date: quickDate,
      appointment_time: quickTime,
    });
  };

  return (
    <div className="space-y-0">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#FAF5EF] via-[#F7EFE6] to-[#F3E9DF] border-b border-[#C8A15A]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            <div className="lg:col-span-6 space-y-5 z-10">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.18em] text-[#6B173D] uppercase">
                <span className="text-[#C8A15A]" aria-hidden="true">★</span>
                <span>Women empowerment • skill development</span>
              </div>

              <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-[62px] font-bold leading-[1.08] tracking-tight text-[#201B1D] text-balance">
                Empowering Women.
                <span className="block text-[#6B173D] mt-1">Transforming Lives.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#201B1D]/85 max-w-xl leading-relaxed font-normal">
                Building skills, creating opportunities and supporting a better future through education, vocational training and community initiatives.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('academy')}
                  className="inline-flex items-center gap-2.5 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-sm sm:text-base font-medium px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer whitespace-nowrap"
                >
                  <GraduationCap className="w-4 h-4 text-[#E6C98F]" aria-hidden="true" />
                  <span>Explore Our Programs</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="inline-flex items-center gap-2 bg-[#FAF5EF] hover:bg-[#F3E9DF] text-[#201B1D] border border-[#6B173D]/40 text-sm sm:text-base font-medium px-6 py-3.5 rounded-xl transition-all duration-150 cursor-pointer whitespace-nowrap"
                >
                  <span>Contact Our Foundation</span>
                  <ArrowRight className="w-4 h-4 text-[#6B173D]" aria-hidden="true" />
                </button>
              </div>

              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-[#C8A15A]/30 max-w-xl">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left pr-2 sm:border-r border-[#C8A15A]/25">
                  <HeartHandshake className="w-6 h-6 text-[#C8A15A] mb-1.5" strokeWidth={1.6} aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-semibold text-[#201B1D] leading-tight">Community Care</span>
                  <span className="text-[11px] text-[#6E6265] mt-0.5">Support &amp; Guidance</span>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left pr-2 sm:border-r border-[#C8A15A]/25">
                  <Leaf className="w-6 h-6 text-[#C8A15A] mb-1.5" strokeWidth={1.6} aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-semibold text-[#201B1D] leading-tight">Skill Building</span>
                  <span className="text-[11px] text-[#6E6265] mt-0.5">Practical Training</span>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left pr-2 sm:border-r border-[#C8A15A]/25">
                  <ShieldCheck className="w-6 h-6 text-[#C8A15A] mb-1.5" strokeWidth={1.6} aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-semibold text-[#201B1D] leading-tight">Confidence</span>
                  <span className="text-[11px] text-[#6E6265] mt-0.5">Purpose &amp; Dignity</span>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <GraduationCap className="w-6 h-6 text-[#C8A15A] mb-1.5" strokeWidth={1.6} aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-semibold text-[#201B1D] leading-tight">Training Access</span>
                  <span className="text-[11px] text-[#6E6265] mt-0.5">Vocational Learning</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#C8A15A]/40 shadow-xl bg-[#F3E9DF]">
                <img
                  src="/assets/aistudio/Smiling_Salon_Team_with_Red_Roses_ff53a29d.png"
                  alt="Sonu’s Beauty Studio & Academy team and students smiling together inside the Vadodara studio"
                  referrerPolicy="no-referrer"
                  className="w-full h-[320px] sm:h-[420px] lg:h-[560px] object-cover object-center block"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR PROGRAMS */}
      <section id="programs" className="scroll-mt-[6.5rem] py-12 sm:py-16 bg-[#FAF5EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <div className="flex items-center justify-center gap-4">
              <span className="hidden sm:block w-20 h-[1px] bg-[#C8A15A]" aria-hidden="true" />
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#201B1D]">
                Programs &amp; Skills
              </h2>
              <span className="hidden sm:block w-20 h-[1px] bg-[#C8A15A]" aria-hidden="true" />
            </div>
            <p className="text-sm sm:text-base text-[#6E6265] mt-2 leading-relaxed">
              Practical learning opportunities focused on confidence, livelihood readiness, and community upliftment through beauty, tailoring, and digital skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {[
              {
                title: 'Beauty & Makeup Classes',
                description:
                  'Focused on practical beauty and makeup learning, grooming confidence, and client-ready finishing skills. Final batches and timings are confirmed directly with the foundation team.',
                image: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_11.45.28_PM_9e75cfdf.jpeg',
                alt: 'Models styled in traditional Navratri Garba makeup, hairstyling, and festive attire by Sonu’s Beauty Studio & Academy',
                action: () => onNavigate('courses'),
              },
              {
                title: 'Sewing & Tailoring Classes',
                description:
                  'Hands-on tailoring and sewing guidance that supports self-reliance, creative confidence, and practical livelihood preparation for learners in the community.',
                image: '/assets/academy/gallery-classroom-session.png',
                alt: 'Students learning sewing and tailoring in a practical training session',
                action: () => onNavigate('courses'),
              },
              {
                title: 'Computer Classes',
                description:
                  'Digital literacy and practical computer learning for everyday productivity, office confidence, and stronger access to modern opportunities.',
                image: '/assets/academy/academy-instructor.png',
                alt: 'Instructor guiding learners in a computer and digital skills session',
                action: () => onNavigate('courses'),
              },
            ].map((program) => (
              <div
                key={program.title}
                className="group bg-white rounded-2xl border border-[#C8A15A]/35 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden"
              >
                <div className="relative w-full h-56 overflow-hidden bg-[#F3E9DF]">
                  <img
                    src={program.image}
                    alt={program.alt}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif-luxury text-2xl font-bold text-[#201B1D] group-hover:text-[#6B173D] transition-colors leading-snug">
                      {program.title}
                    </h3>
                    <p className="text-sm text-[#6E6265] mt-2 leading-relaxed">{program.description}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#C8A15A]/20">
                    <button
                      type="button"
                      onClick={program.action}
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-sm font-medium py-2.5 px-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <span>Enquire Now</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 text-center">
            <button
              type="button"
              onClick={() => onNavigate('courses')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B173D] hover:text-[#4A0D29] underline underline-offset-4 cursor-pointer"
            >
              <span>Explore all skill development options</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. ABOUT SECTION & 7. BEAUTY ACADEMY SECTION (Matching Reference 3-Column Editorial Layout) */}
      <section className="py-10 sm:py-14 bg-[#F6EFE7] border-y border-[#C8A15A]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-stretch">
            {/* LEFT: Studio & Academy Tour Video */}
            <div className="lg:col-span-5 flex">
              <div className="w-full rounded-2xl overflow-hidden border border-[#C8A15A]/40 shadow-md bg-[#201B1D]">
                <video
                  src="/assets/aistudio/WhatsApp_Video_2026-11-12_at_11.46.20_PM_bed0012e.mp4"
                  poster="/assets/aistudio/7_25ba3f99.jpeg"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label="Sonu’s Beauty Studio & Academy tour and basic to advance beautician courses video"
                  className="w-full h-full min-h-[320px] max-h-[500px] object-contain bg-[#201B1D] block"
                />
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-between py-1">
              <div className="space-y-3">
                <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#C8A15A]">
                  ABOUT OUR FOUNDATION
                </span>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#4A0D29] leading-tight">
                  Empowering women through livelihood, learning and community support
                </h2>
                <p className="text-xs sm:text-sm text-[#201B1D]/85 leading-relaxed">
                  Sonu Foundation and Charitable Trust works alongside the academy to create opportunities for women through skill development, occupational learning, and practical guidance for a stronger and more confident future.
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2 py-4 my-3 border-y border-[#C8A15A]/30 text-center">
                <div className="pr-1 border-r border-[#C8A15A]/25">
                  <MapPin className="w-4 h-4 text-[#C8A15A] mx-auto mb-1" />
                  <div className="font-serif-luxury text-lg sm:text-xl font-bold text-[#201B1D] tabular-nums">
                    {LOCATIONS.length}
                  </div>
                  <div className="text-[10px] text-[#6E6265] leading-tight">Community Locations</div>
                </div>

                <div className="pr-1 border-r border-[#C8A15A]/25">
                  <Crown className="w-4 h-4 text-[#C8A15A] mx-auto mb-1" />
                  <div className="font-serif-luxury text-lg sm:text-xl font-bold text-[#201B1D] tabular-nums">
                    {COURSES.length}
                  </div>
                  <div className="text-[10px] text-[#6E6265] leading-tight">Skill Pathways</div>
                </div>

                <div className="pr-1 border-r border-[#C8A15A]/25">
                  <GraduationCap className="w-4 h-4 text-[#C8A15A] mx-auto mb-1" />
                  <div className="font-serif-luxury text-lg sm:text-xl font-bold text-[#201B1D] tabular-nums">
                    3
                  </div>
                  <div className="text-[10px] text-[#6E6265] leading-tight">Core Programs</div>
                </div>

                <div>
                  <ShieldCheck className="w-4 h-4 text-[#C8A15A] mx-auto mb-1" />
                  <div className="font-serif-luxury text-xs sm:text-sm font-bold text-[#201B1D] leading-tight mt-0.5">
                    Purpose
                  </div>
                  <div className="text-[10px] text-[#6E6265] leading-tight">Driven</div>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-xs sm:text-sm font-medium px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  <span>Learn More About Us</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* RIGHT: Beauty Academy Burgundy Showcase Card */}
            <div className="lg:col-span-3 flex">
              <div className="w-full rounded-2xl bg-gradient-to-br from-[#6B173D] to-[#4A0D29] text-[#FAF5EF] p-5 border border-[#C8A15A]/45 shadow-lg flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1.5">
                    <GraduationCap className="w-6 h-6 text-[#E6C98F]" />
                    <span className="font-serif-luxury text-xl font-bold text-[#FAF5EF]">
                      Beauty Academy
                    </span>
                  </div>
                  <h3 className="font-serif-luxury text-base font-semibold text-[#E6C98F] leading-snug">
                    Build Your Career in the Beauty Industry
                  </h3>
                  <p className="text-xs text-[#FAF5EF]/80 mt-1">
                    Professional training, practical learning and guidance across 9 beauty academy courses.
                  </p>

                  {/* Cream Checklist Card + Real Academy Portrait */}
                  <div className="mt-3.5 bg-[#FAF5EF] text-[#201B1D] rounded-xl p-3 shadow-sm flex items-center gap-2">
                    <ul className="space-y-1.5 text-[11px] font-medium flex-1">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A15A] shrink-0" />
                        <span>Professional Training</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A15A] shrink-0" />
                        <span>Hands-on Practice</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A15A] shrink-0" />
                        <span>Expert Guidance</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A15A] shrink-0" />
                        <span>Practical Sessions</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A15A] shrink-0" />
                        <span>Course Certificate</span>
                      </li>
                    </ul>
                    <img
                      src="/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.38__1__b3134fa2.jpeg"
                      alt="Women empowerment and skill-training session at Sonu Foundation and Charitable Trust"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-20 h-28 object-cover object-top rounded-lg border border-[#C8A15A]/40 shrink-0"
                    />
                  </div>
                  <p className="text-[10px] text-[#E6C98F]/85 mt-2 leading-snug">
                    {BUSINESS_INFO.certificationDisclaimer}
                  </p>
                </div>

                <div className="mt-4 relative z-10">
                  <button
                    type="button"
                    onClick={() => onNavigate('courses')}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#DFB973] to-[#C8A15A] hover:from-[#E6C98F] hover:to-[#C8A15A] text-[#201B1D] text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span>Explore Courses</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Founder & Proprietor Showcase Card */}
          <div className="mt-7 bg-[#FAF5EF] rounded-2xl border border-[#C8A15A]/45 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 items-center">
            <div className="md:col-span-4 lg:col-span-3 bg-[#EFE6DC]">
              <div className="aspect-[4/4] md:aspect-[4/3] w-full overflow-hidden">
                <img
                  src={OWNER_PROFILE.photoUrl}
                  alt={OWNER_PROFILE.photoAlt}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            <div className="md:col-span-8 lg:col-span-9 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="inline-block text-[11px] font-bold tracking-[0.16em] uppercase text-[#6B173D] bg-white px-2.5 py-1 rounded-md border border-[#C8A15A]/40">
                  {OWNER_PROFILE.proprietorDesignation}
                </span>
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#201B1D]">
                  {OWNER_PROFILE.name}
                </h3>
                <p className="text-xs font-semibold text-[#6E6265]">
                  {OWNER_PROFILE.organization}
                </p>
                <p className="text-xs sm:text-sm text-[#201B1D]/80 leading-relaxed max-w-2xl">
                  {OWNER_PROFILE.summary}
                </p>
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Meet the Founder</span>
                  <ArrowRight className="w-4 h-4 text-[#E6C98F]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. WHY CHOOSE US — Horizontal 6-Feature Section */}
      <section className="py-8 bg-[#FAF5EF] border-b border-[#C8A15A]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 items-center">
            <div className="col-span-2 sm:col-span-3 lg:col-span-1 text-center lg:text-left">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#201B1D]">
                Why Choose Us?
              </h2>
            </div>

            <div className="flex flex-col items-center text-center px-2 lg:border-l border-[#C8A15A]/30">
              <Award className="w-6 h-6 text-[#6B173D] mb-1.5" strokeWidth={1.7} />
              <span className="text-xs font-bold text-[#201B1D]">Experienced Team</span>
              <span className="text-[11px] text-[#6E6265]">Skilled &amp; Professional</span>
            </div>

            <div className="flex flex-col items-center text-center px-2 lg:border-l border-[#C8A15A]/30">
              <Gem className="w-6 h-6 text-[#6B173D] mb-1.5" strokeWidth={1.7} />
              <span className="text-xs font-bold text-[#201B1D]">Premium Products</span>
              <span className="text-[11px] text-[#6E6265]">Quality Brands</span>
            </div>

            <div className="flex flex-col items-center text-center px-2 lg:border-l border-[#C8A15A]/30">
              <ShieldCheck className="w-6 h-6 text-[#6B173D] mb-1.5" strokeWidth={1.7} />
              <span className="text-xs font-bold text-[#201B1D]">Hygiene &amp; Safety</span>
              <span className="text-[11px] text-[#6E6265]">Clean &amp; Sanitized</span>
            </div>

            <div className="flex flex-col items-center text-center px-2 lg:border-l border-[#C8A15A]/30">
              <Calendar className="w-6 h-6 text-[#6B173D] mb-1.5" strokeWidth={1.7} />
              <span className="text-xs font-bold text-[#201B1D]">Easy Booking</span>
              <span className="text-[11px] text-[#6E6265]">Online Appointment</span>
            </div>

            <div className="flex flex-col items-center text-center px-2 lg:border-l border-[#C8A15A]/30">
              <GraduationCap className="w-6 h-6 text-[#6B173D] mb-1.5" strokeWidth={1.7} />
              <span className="text-xs font-bold text-[#201B1D]">Training Academy</span>
              <span className="text-[11px] text-[#6E6265]">Learn • Practice • Grow</span>
            </div>

            <div className="flex flex-col items-center text-center px-2 lg:border-l border-[#C8A15A]/30">
              <Headphones className="w-6 h-6 text-[#6B173D] mb-1.5" strokeWidth={1.7} />
              <span className="text-xs font-bold text-[#201B1D]">Customer Support</span>
              <span className="text-[11px] text-[#6E6265]">Always Here For You</span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. GALLERY SECTION */}
      <section className="py-12 bg-[#FAF5EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 mb-5">
            <span className="hidden sm:block w-24 h-[1px] bg-[#C8A15A]" aria-hidden="true" />
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#201B1D]">
              Gallery
            </h2>
            <span className="hidden sm:block w-24 h-[1px] bg-[#C8A15A]" aria-hidden="true" />
          </div>

          {/* Filter Tabs + View Full Gallery CTA */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Gallery category filters">
              {(['All', 'Salon', 'Makeup', 'Hair', 'Academy', 'Students', 'Certificates', 'Videos'] as GalleryCategory[]).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={galleryTab === cat}
                    onClick={() => setGalleryTab(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer whitespace-nowrap ${
                      galleryTab === cat
                        ? 'bg-[#6B173D] text-white border-[#6B173D] shadow-sm'
                        : 'bg-white text-[#201B1D] border-[#C8A15A]/35 hover:border-[#6B173D]'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              onClick={() => onNavigate('gallery')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium bg-white text-[#6B173D] border border-[#6B173D]/40 hover:bg-[#F3E9DF] transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 5-Column Showcase Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredHomeGallery.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setLightboxImage({
                    src: item.src,
                    videoSrc: item.videoSrc,
                    title: item.title,
                    subtitle: item.subtitle,
                  })
                }
                className="group relative rounded-xl overflow-hidden border border-[#C8A15A]/35 bg-[#F3E9DF] h-40 sm:h-36 shadow-sm hover:shadow-md transition-all text-left focus:outline-none"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className={`w-full h-full ${
                    item.isCertificate ? 'object-cover object-center' : 'object-cover'
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <span className="text-xs font-semibold text-white leading-tight">{item.title}</span>
                </div>
                {item.isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="w-9 h-9 rounded-full bg-[#6B173D]/90 text-white flex items-center justify-center shadow">
                      <Play className="w-4 h-4 fill-current" />
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 10. APPOINTMENT BOOKING & 11. REVIEWS (Side-by-Side as in Reference Image) */}
      <section className="py-10 bg-[#FAF5EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* LEFT: Book Your Appointment Quick Widget */}
            <div className="lg:col-span-6 bg-gradient-to-br from-[#6B173D] to-[#4A0D29] text-white rounded-2xl p-6 sm:p-7 border border-[#C8A15A]/40 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-[#C8A15A]/40 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-[#E6C98F]" />
                  </div>
                  <div>
                    <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white leading-tight">
                      Book Your Appointment
                    </h2>
                    <p className="text-xs sm:text-sm text-[#FAF5EF]/85">
                      Choose a location, service, date &amp; time and let us take care of the rest.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleQuickBookSubmit} className="mt-5 space-y-3">
                  {/* Location Radio Pills */}
                  <div className="grid grid-cols-2 gap-2">
                    {LOCATIONS.map((loc, idx) => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => setQuickLocation(loc.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border text-left transition-all cursor-pointer ${
                          quickLocation === loc.id
                            ? 'bg-[#E6C98F] text-[#201B1D] border-[#E6C98F]'
                            : 'bg-white/10 text-white border-white/25 hover:bg-white/15'
                        }`}
                      >
                        Branch {idx + 1}: {idx === 0 ? 'Somatalav, Waghodia Rd' : 'Adaniyapul, Fatepura'}
                      </button>
                    ))}
                  </div>

                  {/* Service, Date, Time Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label htmlFor="home-quick-service" className="sr-only">
                        Select Service
                      </label>
                      <select
                        id="home-quick-service"
                        value={quickService}
                        onChange={(e) => setQuickService(e.target.value)}
                        className="w-full bg-[#FAF5EF] text-[#201B1D] text-xs sm:text-sm font-medium rounded-xl px-3 py-3 border border-[#C8A15A]/40 focus:outline-none"
                      >
                        <option value="">Select Service</option>
                        {SERVICES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="home-quick-date" className="sr-only">
                        Select Date
                      </label>
                      <input
                        id="home-quick-date"
                        type="date"
                        min={todayIso}
                        value={quickDate}
                        onChange={(e) => setQuickDate(e.target.value)}
                        className="w-full bg-[#FAF5EF] text-[#201B1D] text-xs sm:text-sm font-medium rounded-xl px-3 py-2.5 border border-[#C8A15A]/40 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="home-quick-time" className="sr-only">
                        Select Time
                      </label>
                      <select
                        id="home-quick-time"
                        value={quickTime}
                        onChange={(e) => setQuickTime(e.target.value)}
                        className="w-full bg-[#FAF5EF] text-[#201B1D] text-xs sm:text-sm font-medium rounded-xl px-3 py-3 border border-[#C8A15A]/40 focus:outline-none"
                      >
                        <option value="">Select Time</option>
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#E6C98F] via-[#D8B26E] to-[#C8A15A] hover:from-[#EDD5A3] hover:to-[#C8A15A] text-[#201B1D] font-bold text-sm py-3.5 px-6 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <span>Book Appointment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT: Client Reviews & Google Feedback Card */}
            <div className="lg:col-span-6 bg-[#F6EFE7] rounded-2xl p-6 sm:p-7 border border-[#C8A15A]/35 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#201B1D]">
                  Client Reviews &amp; Feedback
                </h2>
                <span className="flex-1 h-[1px] bg-[#C8A15A]/50" aria-hidden="true" />
              </div>

              {VERIFIED_REVIEWS.length > 0 ? (
                VERIFIED_REVIEWS.map((rev) => (
                  <div key={rev.id} className="flex flex-col sm:flex-row items-center gap-5 my-auto">
                    {rev.avatar && (
                      <img
                        src={rev.avatar}
                        alt={rev.customerName}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[#C8A15A] shadow-sm shrink-0"
                      />
                    )}
                    <div className="text-center sm:text-left space-y-2">
                      <p className="text-sm sm:text-base text-[#201B1D] italic leading-relaxed">
                        “{rev.text}”
                      </p>
                      <div className="flex items-center justify-center sm:justify-start gap-1 text-[#C8A15A]">
                        {Array.from({ length: rev.rating }).map((_, idx) => (
                          <Star key={idx} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <div>
                        <div className="font-serif-luxury text-lg font-bold text-[#201B1D]">
                          {rev.customerName}
                        </div>
                        <div className="text-xs text-[#6E6265]">
                          {rev.serviceName} · {rev.verifiedLabel}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="my-auto bg-[#FAF5EF] rounded-xl p-5 border border-[#C8A15A]/35 space-y-3">
                  <div className="flex items-center gap-2 text-[#6B173D] text-xs font-bold uppercase tracking-wider">
                    <Star className="w-4 h-4 text-[#C8A15A] fill-current" />
                    <span>Authentic Client Feedback Only</span>
                  </div>
                  <p className="text-sm text-[#201B1D] leading-relaxed">
                    We do not publish fabricated customer testimonials. You can view genuine client ratings and reviews directly on Google Maps or share your salon and academy experience with our team.
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <a
                      href={BUSINESS_INFO.googleReviewsSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
                    >
                      <span>View Reviews on Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => onNavigate('contact')}
                      className="inline-flex items-center gap-1.5 bg-white hover:bg-[#F3E9DF] text-[#4A0D29] border border-[#C8A15A]/45 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                    >
                      <span>Share Feedback</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-5 pt-3 border-t border-[#C8A15A]/25 flex items-center justify-between text-xs">
                <span className="text-[#6E6265]">
                  {BUSINESS_CLAIMS_CONFIG.onlineRating && BUSINESS_CLAIMS_CONFIG.happyClientsCount
                    ? `${BUSINESS_CLAIMS_CONFIG.onlineRating} Online Rating · ${BUSINESS_CLAIMS_CONFIG.happyClientsCount} Happy Clients`
                    : 'Sonu Foundation and Charitable Trust · Vadodara'}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('reviews')}
                    className="font-semibold text-[#6B173D] hover:underline cursor-pointer"
                  >
                    Client Reviews Page →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. OUR LOCATIONS (Both Verified Vadodara Locations) */}
      <section className="py-12 bg-[#F6EFE7] border-t border-[#C8A15A]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#6B173D]">
              VISIT US IN VADODARA
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#201B1D] mt-1">
              Our Locations
            </h2>
            <p className="text-sm sm:text-base text-[#6E6265] mt-1.5">
              Conveniently serving clients and academy students across Branch 1 (Somatalav, Waghodia Road) and Branch 2 (Adaniyapul, Fatepura) in Vadodara, Gujarat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LOCATIONS.map((loc) => (
              <div
                key={loc.id}
                className="bg-[#FAF5EF] rounded-2xl p-6 border border-[#C8A15A]/40 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B173D] font-semibold">
                    <span>{loc.badge}</span>
                    {loc.coordinates && (
                      <span className="tabular-nums bg-[#F3E9DF] px-2.5 py-0.5 rounded-md border border-[#C8A15A]/35">
                        GPS: {loc.coordinates}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif-luxury text-xl font-bold text-[#201B1D]">
                    {loc.name}
                  </h3>
                  <div className="flex items-start gap-2.5 text-sm text-[#6E6265] min-h-[60px]">
                    <MapPin className="w-4 h-4 text-[#6B173D] shrink-0 mt-1" />
                    <div>
                      {loc.addressLines.map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#201B1D] pt-1">
                    <a
                      href={`tel:${BUSINESS_INFO.phoneRaw}`}
                      className="inline-flex items-center gap-1.5 hover:text-[#6B173D] font-medium tabular-nums"
                    >
                      <Phone className="w-4 h-4 text-[#6B173D]" />
                      <span>{loc.phone}</span>
                    </a>
                    <span className="inline-flex items-center gap-1.5 text-[#6E6265]">
                      <Clock className="w-4 h-4 text-[#C8A15A]" />
                      <span>{loc.hours}</span>
                    </span>
                  </div>

                  {/* Interactive Branch Map Preview */}
                  <div className="rounded-xl overflow-hidden border border-[#C8A15A]/35 h-52 bg-[#F3E9DF] mt-2">
                    <iframe
                      title={`Interactive map for ${loc.name}`}
                      src={loc.mapEmbedUrl}
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#C8A15A]/25 flex flex-wrap items-center gap-3">
                  <a
                    href={loc.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#E6C98F]" />
                    <span>Get Directions</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>
                  <button
                    type="button"
                    onClick={() => onQuickBookStart({ location_id: loc.id })}
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-[#F3E9DF] text-[#6B173D] border border-[#6B173D]/35 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book at {loc.id === 'location-1' ? 'Branch 1' : 'Branch 2'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. SONU FOUNDATION & CHARITABLE TRUST */}
      <section className="py-12 bg-[#FAF5EF] border-t border-[#C8A15A]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#F6EFE7] to-[#F3E9DF] rounded-2xl p-6 sm:p-8 lg:p-10 border border-[#C8A15A]/45 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-[#6B173D]">
                  <HeartHandshake className="w-4 h-4 text-[#C8A15A]" />
                  <span>COMMUNITY &amp; SKILL EMPOWERMENT</span>
                </div>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#201B1D]">
                  Sonu Foundation &amp; Charitable Trust
                </h2>
                <p className="text-sm sm:text-base text-[#6E6265] leading-relaxed max-w-2xl">
                  Alongside Sonu’s Beauty Studio &amp; Academy, <strong className="text-[#201B1D]">Sonu Foundation &amp; Charitable Trust</strong> is committed to supporting practical skill development, self-reliance, and community awareness in Vadodara.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-wrap lg:justify-end gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('foundation')}
                  className="inline-flex items-center gap-2 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-sm font-medium px-5 py-3 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  <span>Explore Foundation &amp; Trust</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14. THREE SEPARATE ENQUIRY CATEGORIES (Trust, Academy & Beauty Studio) */}
      <EnquiryCategoriesSection variant="home" showEmbeddedForm={true} />

      {/* 15. CONNECT WITH US (Official Social Media Profiles) */}
      <ConnectWithUsSection variant="home" />

      {/* 16. FINAL CTA SECTION */}
      <section className="py-14 sm:py-16 bg-gradient-to-r from-[#6B173D] via-[#581232] to-[#4A0D29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#FAF5EF] text-balance">
            Ready to Feel Your Best?
          </h2>
          <p className="text-base sm:text-lg text-[#FAF5EF]/85 max-w-2xl mx-auto">
            Book your appointment or explore professional beauty courses at Sonu’s Beauty Studio &amp; Academy.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E6C98F] to-[#C8A15A] hover:from-[#F0D7A3] hover:to-[#C8A15A] text-[#201B1D] text-sm sm:text-base font-bold px-7 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Contact Our Foundation</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('academy')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-[#C8A15A]/50 text-sm sm:text-base font-semibold px-7 py-3.5 rounded-xl transition-all cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-[#E6C98F]" />
              <span>Explore Our Programs</span>
            </button>
            <a
              href={buildCategoryEnquiryWhatsAppUrl('trust')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-transparent hover:bg-white/10 text-[#E6C98F] border border-[#E6C98F]/40 text-sm sm:text-base font-medium px-6 py-3.5 rounded-xl transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Trust Enquiry</span>
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Homepage Gallery Preview */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxImage.title}
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="max-w-3xl w-full bg-[#FAF5EF] rounded-2xl overflow-hidden border border-[#C8A15A] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxImage.videoSrc ? (
              <video
                src={lightboxImage.videoSrc}
                poster={lightboxImage.src}
                controls
                autoPlay
                loop
                playsInline
                className="w-full max-h-[70vh] object-contain bg-[#201B1D]"
              />
            ) : (
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title}
                className="w-full max-h-[70vh] object-contain bg-[#201B1D]"
              />
            )}
            <div className="p-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#201B1D]">
                  {lightboxImage.title}
                </h3>
                <p className="text-xs text-[#6E6265]">{lightboxImage.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="px-4 py-2 rounded-lg bg-[#6B173D] text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
