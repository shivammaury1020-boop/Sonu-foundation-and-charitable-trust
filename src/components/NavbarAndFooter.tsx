import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Phone,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Mail,
  Clock,
  MessageCircle,
  Instagram,
  Facebook,
  Youtube,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import {
  BUSINESS_INFO,
  LOCATIONS,
  OFFICIAL_SOCIAL_PROFILES,
  PageId,
  SOCIAL_MEDIA_URLS,
  WEBSITE_SERVICE_NAVIGATION,
} from '../data/siteData';
import { buildWhatsAppGeneralUrl } from '../utils/bookingLogic';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId, param?: string) => void;
}

/**
 * Brand logo and organization name layout for Sonu Foundation and Charitable Trust.
 */
export const BrandLogo: React.FC<{
  variant?: 'light' | 'dark' | 'transparent';
  onClick?: () => void;
}> = ({ variant = 'dark', onClick }) => {
  const isDarkBg = variant === 'light';

  return (
    <button
      type="button"
      onClick={onClick}
      className="brand-logo group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A15A] rounded-lg cursor-pointer"
      aria-label="Sonu Foundation and Charitable Trust"
    >
      <div
        className={`brand-logo-mark flex items-center justify-center shrink-0 overflow-hidden transition-transform duration-200 group-hover:scale-[1.02] ${
          isDarkBg
            ? 'bg-transparent'
            : variant === 'transparent'
            ? 'bg-transparent'
            : 'bg-transparent'
        }`}
      >
        <img
          src="/assets/logo/sonu-client-logo.png"
          alt="Sonu Foundation and Charitable Trust logo"
          className="brand-logo-image"
          loading="eager"
          decoding="async"
        />
      </div>

      <div className="brand-wordmark">
        <span
          className={`brand-wordmark-line brand-wordmark-primary ${
            isDarkBg ? 'text-[#FAF5EF]' : 'text-[#201B1D]'
          }`}
        >
          Sonu Foundation
        </span>
        <span
          className={`brand-wordmark-line brand-wordmark-secondary ${
            isDarkBg ? 'text-[#FAF5EF]' : 'text-[#201B1D]'
          }`}
        >
          and Charitable Trust
        </span>
        <span
          className={`brand-tagline ${
            isDarkBg ? 'text-[#E6C98F]' : 'text-[#6B173D]'
          }`}
        >
          {BUSINESS_INFO.tagline.toUpperCase()}
        </span>
      </div>
    </button>
  );
};

export const TopHeader: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [academyMenuOpen, setAcademyMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (page: PageId, param?: string) => {
    setMobileMenuOpen(false);
    setServicesMenuOpen(false);
    setAcademyMenuOpen(false);
    onNavigate(page, param);
  };

  const navItems: { id: PageId; label: string; hasDropdown?: 'services' | 'academy' }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Our Foundation' },
    { id: 'foundation', label: 'Our Mission' },
    { id: 'courses', label: 'Programs & Courses' },
    { id: 'academy', label: 'Academy', hasDropdown: 'academy' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'locations', label: 'Our Locations' },
    { id: 'contact', label: 'Contact Us' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* 1. Thin Premium Burgundy Promotional Bar */}
      <div className="bg-[#591131] text-[#FAF5EF] border-b border-[#C8A15A]/25 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => handleNav('contact')}
            className="flex items-center gap-1.5 text-left truncate hover:text-[#E6C98F] transition-colors font-medium cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C8A15A] shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Building skills, creating opportunities, and supporting a better future.</span>
            <span className="sm:hidden">Empowering women through skill development.</span>
            <Sparkles className="w-3.5 h-3.5 text-[#C8A15A] shrink-0 hidden sm:inline" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {BUSINESS_INFO.email && (
              <a
                href={`mailto:${BUSINESS_INFO.email}`}
                className="hidden xl:flex items-center gap-1.5 text-[#FAF5EF]/90 hover:text-[#E6C98F] transition-colors whitespace-nowrap"
              >
                <Mail className="w-3.5 h-3.5 text-[#C8A15A]" aria-hidden="true" />
                <span>{BUSINESS_INFO.email}</span>
              </a>
            )}
            <button
              type="button"
              onClick={() => handleNav('locations')}
              className="hidden md:flex items-center gap-1 text-[#FAF5EF]/90 hover:text-[#E6C98F] transition-colors whitespace-nowrap cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#C8A15A]" aria-hidden="true" />
              <span>Vadodara, Gujarat</span>
            </button>
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="flex items-center gap-1 text-[#FAF5EF] hover:text-[#E6C98F] font-medium transition-colors whitespace-nowrap tabular-nums"
            >
              <Phone className="w-3.5 h-3.5 text-[#C8A15A]" aria-hidden="true" />
              <span>{BUSINESS_INFO.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Sticky Navigation Bar */}
      <div
        className={`bg-[#FAF5EF]/95 backdrop-blur-md border-b border-[#C8A15A]/25 transition-all duration-200 ${
          scrolled ? 'py-2 shadow-md' : 'py-3 sm:py-3.5'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
          <div className="grid items-center gap-3 lg:gap-4" style={{ gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 2.4fr) auto' }}>
            <div className="flex min-w-0 items-center justify-start">
              <BrandLogo variant="dark" onClick={() => handleNav('home')} />
            </div>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex min-w-0 items-center justify-center gap-1.5 xl:gap-2.5 2xl:gap-3 flex-nowrap overflow-hidden"
              aria-label="Main Navigation"
            >
              {navItems.map((item) => {
                const isActive =
                  currentPage === item.id ||
                  (item.id === 'services' && currentPage === 'service-details') ||
                  (item.id === 'academy' && (currentPage === 'courses' || currentPage === 'course-details'));

                if (item.hasDropdown === 'services') {
                  return (
                    <div
                      key={item.id}
                      className="relative"
                      onMouseEnter={() => setServicesMenuOpen(true)}
                      onMouseLeave={() => setServicesMenuOpen(false)}
                    >
                      <button
                        type="button"
                        onClick={() => handleNav('services')}
                        className={`flex items-center gap-1 text-[0.68rem] xl:text-[0.72rem] 2xl:text-[0.78rem] font-medium py-1.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                          isActive
                            ? 'text-[#6B173D] border-[#6B173D] font-semibold'
                            : 'text-[#201B1D] border-transparent hover:text-[#6B173D]'
                        }`}
                      >
                        <span>Services</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-75" aria-hidden="true" />
                      </button>
                      {servicesMenuOpen && (
                        <div className="absolute left-0 top-full pt-2 w-60 z-50">
                          <div className="bg-white rounded-xl shadow-lg border border-[#C8A15A]/30 py-2 text-sm">
                            <button
                              type="button"
                              onClick={() => handleNav('services')}
                              className="w-full text-left px-4 py-2 hover:bg-[#FAF5EF] text-[#201B1D] font-semibold border-b border-[#C8A15A]/20 cursor-pointer"
                            >
                              All Salon Services
                            </button>
                            {WEBSITE_SERVICE_NAVIGATION.map((navCat) => (
                              <button
                                key={navCat.label}
                                type="button"
                                onClick={() => handleNav(navCat.page, navCat.category)}
                                className="w-full text-left px-4 py-2 hover:bg-[#FAF5EF] text-[#6E6265] hover:text-[#6B173D] transition-colors cursor-pointer"
                              >
                                {navCat.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                if (item.hasDropdown === 'academy') {
                  return (
                    <div
                      key={item.id}
                      className="relative"
                      onMouseEnter={() => setAcademyMenuOpen(true)}
                      onMouseLeave={() => setAcademyMenuOpen(false)}
                    >
                      <button
                        type="button"
                        onClick={() => handleNav('academy')}
                        className={`flex items-center gap-1 text-[0.68rem] xl:text-[0.72rem] 2xl:text-[0.78rem] font-medium py-1.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                          isActive
                            ? 'text-[#6B173D] border-[#6B173D] font-semibold'
                            : 'text-[#201B1D] border-transparent hover:text-[#6B173D]'
                        }`}
                      >
                        <span>Academy</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-75" aria-hidden="true" />
                      </button>
                      {academyMenuOpen && (
                        <div className="absolute left-0 top-full pt-2 w-60 z-50">
                          <div className="bg-white rounded-xl shadow-lg border border-[#C8A15A]/30 py-2 text-sm">
                            <button
                              type="button"
                              onClick={() => handleNav('academy')}
                              className="w-full text-left px-4 py-2 hover:bg-[#FAF5EF] text-[#201B1D] font-medium cursor-pointer"
                            >
                              Beauty Academy Overview
                            </button>
                            <button
                              type="button"
                              onClick={() => handleNav('courses')}
                              className="w-full text-left px-4 py-2 hover:bg-[#FAF5EF] text-[#6E6265] hover:text-[#6B173D] cursor-pointer"
                            >
                              All 9 Certified Courses
                            </button>
                            <button
                              type="button"
                              onClick={() => handleNav('locations')}
                              className="w-full text-left px-4 py-2 hover:bg-[#FAF5EF] text-[#6E6265] hover:text-[#6B173D] cursor-pointer"
                            >
                              Our 2 Vadodara Locations
                            </button>
                            <button
                              type="button"
                              onClick={() => handleNav('foundation')}
                              className="w-full text-left px-4 py-2 hover:bg-[#FAF5EF] text-[#6E6265] hover:text-[#6B173D] cursor-pointer"
                            >
                              Sonu Foundation &amp; Trust
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNav(item.id)}
                    className={`text-[0.68rem] xl:text-[0.72rem] 2xl:text-[0.78rem] font-medium py-1.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'text-[#6B173D] border-[#6B173D] font-semibold'
                        : 'text-[#201B1D] border-transparent hover:text-[#6B173D]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Right CTA & Mobile Menu Toggle */}
            <div className="flex items-center justify-end gap-3 shrink-0 min-w-0">
              <button
                type="button"
                onClick={() => handleNav('contact')}
                className="hidden sm:inline-flex items-center justify-center gap-2 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-sm font-medium px-4 lg:px-5 py-2.5 rounded-xl shadow-sm transition-all duration-150 whitespace-nowrap cursor-pointer min-w-[13rem]"
              >
                <Calendar className="w-4 h-4 text-[#E6C98F]" aria-hidden="true" />
                <span>Contact Our Foundation</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[#C8A15A]/40 text-[#4A0D29] bg-white/80 hover:bg-white focus:outline-none cursor-pointer"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF5EF] border-t border-[#C8A15A]/30 px-4 pt-3 pb-6 shadow-xl">
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'home' as PageId, label: 'Home' },
                { id: 'about' as PageId, label: 'About Our Foundation' },
                { id: 'foundation' as PageId, label: 'Our Mission' },
                { id: 'courses' as PageId, label: 'Programs & Courses' },
                { id: 'academy' as PageId, label: 'Academy' },
                { id: 'gallery' as PageId, label: 'Gallery' },
                { id: 'locations' as PageId, label: 'Our Locations' },
                { id: 'contact' as PageId, label: 'Contact Us' },
              ].map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNav(link.id)}
                  className={`text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    currentPage === link.id
                      ? 'bg-[#6B173D] text-white'
                      : 'text-[#201B1D] hover:bg-[#F3E9DF]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#C8A15A]/30 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => handleNav('contact')}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#6B173D] text-white text-sm font-semibold py-3 px-4 rounded-xl shadow-sm cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#E6C98F]" />
                <span>Contact Our Foundation</span>
              </button>
              <a
                href={buildWhatsAppGeneralUrl(
                  'Hello Sonu Foundation and Charitable Trust, I would like to enquire about your community programs and training opportunities.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#F3E9DF] text-[#4A0D29] border border-[#C8A15A]/50 text-sm font-semibold py-3 px-4 rounded-xl"
              >
                <MessageCircle className="w-4 h-4 text-[#6B173D]" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export const LuxuryFooter: React.FC<{
  onNavigate: (page: PageId, param?: string) => void;
}> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#4A0D29] text-[#FAF5EF] border-t border-[#C8A15A]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-7">
          <div className="lg:col-span-3 space-y-4">
            <BrandLogo variant="light" onClick={() => onNavigate('home')} />
            <p className="text-sm text-[#FAF5EF]/80 leading-relaxed">
              Sonu Foundation and Charitable Trust is a women empowerment and community support initiative in Vadodara focused on practical skill development, education, and social upliftment.
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#E6C98F]">
                Connect With Us
              </div>
              <div className="grid grid-cols-1 gap-2">
                {OFFICIAL_SOCIAL_PROFILES.map((profile) => {
                  const IconComponent =
                    profile.platform === 'instagram'
                      ? Instagram
                      : profile.platform === 'facebook'
                      ? Facebook
                      : Youtube;
                  const isLinkActive = /^https?:\/\//i.test(profile.url);
                  if (!isLinkActive) {
                    return (
                      <div
                        key={profile.id}
                        aria-disabled="true"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-[#C8A15A]/25 bg-[#591131]/35 text-xs text-[#FAF5EF]/65 cursor-not-allowed"
                      >
                        <IconComponent className="w-4 h-4 text-[#E6C98F]/60 shrink-0" aria-hidden="true" />
                        <span className="min-w-0 flex-1 leading-tight">
                          <span className="text-[10px] uppercase tracking-wider text-[#E6C98F]/75 font-semibold block truncate">
                            {`${profile.platformLabel} · Pending Verification`}
                          </span>
                          <span className="font-medium text-[#FAF5EF]/75 block truncate">
                            {profile.accountName}
                          </span>
                        </span>
                      </div>
                    );
                  }
                  return (
                    <a
                      key={profile.id}
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${profile.platformLabel} – ${profile.accountName}${profile.handle ? ` (${profile.handle})` : ''} (opens in a new tab)`}
                      className="group flex items-center gap-2.5 px-3 py-2 rounded-lg border border-[#C8A15A]/40 bg-[#591131]/55 hover:bg-[#6B173D] hover:border-[#C8A15A] text-xs text-[#FAF5EF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6C98F]"
                    >
                      <IconComponent className="w-4 h-4 text-[#E6C98F] shrink-0" aria-hidden="true" />
                      <span className="min-w-0 flex-1 leading-tight">
                        <span className="text-[10px] uppercase tracking-wider text-[#E6C98F] font-semibold block truncate">
                          {profile.handle
                            ? `${profile.platformLabel} · ${profile.handle}`
                            : profile.platformLabel}
                        </span>
                        <span className="font-medium text-[#FAF5EF] block truncate">
                          {profile.accountName}
                        </span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#E6C98F]/70 group-hover:text-[#E6C98F] shrink-0" aria-hidden="true" />
                    </a>
                  );
                })}

                {/^https?:\/\//i.test(SOCIAL_MEDIA_URLS.youtubeChannel) ? (
                  <a
                    href={SOCIAL_MEDIA_URLS.youtubeChannel}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Subscribe on YouTube (${SOCIAL_MEDIA_URLS.youtubeHandle}) (opens in a new tab)`}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gradient-to-r from-[#E6C98F] to-[#C8A15A] hover:from-[#F0D7A3] hover:to-[#C8A15A] text-[#201B1D] text-xs font-bold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF5EF]"
                  >
                    <Youtube className="w-4 h-4 text-[#4A0D29] shrink-0" aria-hidden="true" />
                    <span>Subscribe on YouTube</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#E6C98F]/35 text-[#FAF5EF]/75 text-xs font-bold cursor-not-allowed"
                  >
                    <Youtube className="w-4 h-4 text-[#E6C98F]/75 shrink-0" aria-hidden="true" />
                    <span>YouTube Pending Verification</span>
                  </button>
                )}

                <a
                  href={buildWhatsAppGeneralUrl(
                    'Hello Sonu Foundation and Charitable Trust, I would like to connect with you.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp"
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[#C8A15A]/45 text-xs font-medium text-[#FAF5EF] hover:bg-[#6B173D] hover:border-[#C8A15A] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#E6C98F] shrink-0" aria-hidden="true" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h3 className="footer-section-heading text-[#E6C98F] tracking-wide">
              Quick Links
            </h3>
            <ul className="footer-link-list text-[#FAF5EF]/85">
              {[
                { id: 'home' as PageId, label: 'Home' },
                { id: 'about' as PageId, label: 'About Our Foundation' },
                { id: 'foundation' as PageId, label: 'Our Mission' },
                { id: 'courses' as PageId, label: 'Programs & Courses' },
                { id: 'academy' as PageId, label: 'Academy' },
                { id: 'gallery' as PageId, label: 'Gallery' },
                { id: 'locations' as PageId, label: 'Our Locations' },
                { id: 'contact' as PageId, label: 'Contact Us' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className="footer-nav-link hover:text-[#E6C98F] transition-colors text-left cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-serif-luxury text-base font-semibold text-[#E6C98F] tracking-wide">
              Our Services
            </h3>
            <ul className="space-y-1.5 text-sm text-[#FAF5EF]/85">
              {[
                'Makeup Services',
                'Hair Services',
                'Skin Services',
                'Nail Services',
                'Beauty Courses',
                'Skill Development',
              ].map((service) => (
                <li key={service}>
                  <button
                    type="button"
                    onClick={() => onNavigate('services')}
                    className="hover:text-[#E6C98F] transition-colors text-left cursor-pointer"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-serif-luxury text-base font-semibold text-[#E6C98F] tracking-wide">
              Foundation
            </h3>
            <ul className="space-y-2 text-sm text-[#FAF5EF]/85">
              <li>
                <button type="button" onClick={() => onNavigate('about')} className="hover:text-[#E6C98F] transition-colors text-left cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('foundation')} className="hover:text-[#E6C98F] transition-colors text-left cursor-pointer">
                  Our Mission
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('courses')} className="hover:text-[#E6C98F] transition-colors text-left cursor-pointer">
                  Courses &amp; Training
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('contact')} className="text-[#E6C98F] hover:underline font-medium transition-colors text-left cursor-pointer">
                  Enquire Now
                </button>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-serif-luxury text-base font-semibold text-[#E6C98F] tracking-wide">
              Contact Information
            </h3>
            <ul className="space-y-2.5 text-sm text-[#FAF5EF]/85">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C8A15A] shrink-0 mt-1" />
                <div>
                  <span className="block text-xs text-[#E6C98F] font-medium">Branch 1 · Waghodia Road</span>
                  <span>{LOCATIONS[0].addressLines.join(' ')}</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C8A15A] shrink-0 mt-1" />
                <div>
                  <span className="block text-xs text-[#E6C98F] font-medium">Branch 2 · Adaniyapul, Fatepura</span>
                  <span>{LOCATIONS[1].addressLines.join(' ')}</span>
                  <button
                    type="button"
                    onClick={() => onNavigate('locations')}
                    className="block mt-1 text-xs text-[#E6C98F] underline hover:text-white cursor-pointer"
                  >
                    View Our Locations →
                  </button>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C8A15A] shrink-0" />
                <a href={`tel:${BUSINESS_INFO.phoneRaw}`} className="hover:text-[#E6C98F] tabular-nums">
                  {BUSINESS_INFO.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C8A15A] shrink-0" />
                {BUSINESS_INFO.email ? (
                  <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-[#E6C98F] break-all">
                    {BUSINESS_INFO.email}
                  </a>
                ) : (
                  <span className="text-[#FAF5EF]/75 text-xs">Official email updating soon</span>
                )}
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C8A15A] shrink-0" />
                <span>{BUSINESS_INFO.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#C8A15A]/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF5EF]/75">
          <p>© 2026 Sonu Foundation and Charitable Trust. All Rights Reserved.</p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button type="button" onClick={() => onNavigate('privacy')} className="hover:text-[#E6C98F] transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <span aria-hidden="true">|</span>
            <button type="button" onClick={() => onNavigate('terms')} className="hover:text-[#E6C98F] transition-colors cursor-pointer">
              Terms &amp; Conditions
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const MobileStickyBar: React.FC<{
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}> = ({ currentPage, onNavigate }) => {
  if (
    currentPage === 'book' ||
    currentPage === 'booking-confirmation' ||
    currentPage === 'admin'
  ) {
    return null;
  }

  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF5EF]/95 backdrop-blur-md border-t border-[#C8A15A]/40 px-3 py-2 flex items-center gap-2 shadow-lg">
      <button
        type="button"
        onClick={() => onNavigate('book')}
        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#6B173D] text-white text-xs font-semibold py-2.5 px-3 rounded-lg shadow-sm whitespace-nowrap cursor-pointer"
      >
        <Calendar className="w-3.5 h-3.5 text-[#E6C98F]" />
        <span>Book Appointment</span>
      </button>
      <a
        href={buildWhatsAppGeneralUrl(
          'Hello Sonu Foundation and Charitable Trust, I would like to enquire about training, community programs, or support opportunities.'
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-1.5 bg-[#4A0D29] text-[#FAF5EF] border border-[#C8A15A]/50 text-xs font-semibold py-2.5 px-3.5 rounded-lg whitespace-nowrap"
      >
        <MessageCircle className="w-3.5 h-3.5 text-[#E6C98F]" />
        <span>WhatsApp</span>
      </a>
    </div>
  );
};
