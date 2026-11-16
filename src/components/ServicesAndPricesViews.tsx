import React, { useState, useEffect } from 'react';
import {
  Calendar,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  GraduationCap,
} from 'lucide-react';
import {
  PageId,
  SERVICES,
  SERVICE_CATEGORIES,
  SERVICE_CATEGORY_GROUPS,
  ServiceCategory,
  ServiceItem,
} from '../data/siteData';
import { buildWhatsAppGeneralUrl } from '../utils/bookingLogic';

interface ServicesViewProps {
  initialCategory?: string;
  onNavigate: (page: PageId, param?: string) => void;
  onBookService: (serviceId: string) => void;
}

export const ServicesPageView: React.FC<ServicesViewProps> = ({
  initialCategory,
  onNavigate,
  onBookService,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | ServiceCategory>(() => {
    if (
      initialCategory &&
      SERVICE_CATEGORIES.includes(initialCategory as ServiceCategory)
    ) {
      return initialCategory as ServiceCategory;
    }
    return 'All';
  });

  useEffect(() => {
    if (
      initialCategory &&
      SERVICE_CATEGORIES.includes(initialCategory as ServiceCategory)
    ) {
      setSelectedCategory(initialCategory as ServiceCategory);
    } else if (!initialCategory) {
      setSelectedCategory('All');
    }
  }, [initialCategory]);

  const groupsToShow =
    selectedCategory === 'All'
      ? SERVICE_CATEGORY_GROUPS
      : SERVICE_CATEGORY_GROUPS.filter((g) => g.category === selectedCategory);

  return (
    <div className="py-10 sm:py-14 bg-[#FAF5EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-[0.18em] uppercase text-[#6B173D]">
            SONU’S BEAUTY STUDIO &amp; ACADEMY • VADODARA
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#201B1D]">
            Our Salon Services
          </h1>
          <p className="text-sm sm:text-base text-[#6E6265]">
            Explore our complete range of Beauty &amp; Waxing, Hand &amp; Foot Care, Massage &amp; Spa, Hair Cut &amp; Chemical Treatments, Makeup, Hairstyling, and Nail Services.
          </p>
        </div>

        {/* Website Service Navigation Bar (7 Service Categories + 8. Beauty Academy) */}
        <div
          className="flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="Service categories"
        >
          {(['All', ...SERVICE_CATEGORIES] as ('All' | ServiceCategory)[]).map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium border transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#6B173D] text-white border-[#6B173D] shadow-sm'
                  : 'bg-white text-[#201B1D] border-[#C8A15A]/40 hover:border-[#6B173D]'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onNavigate('academy')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border border-[#C8A15A] bg-[#F3E9DF] text-[#4A0D29] hover:bg-[#6B173D] hover:text-white transition-all cursor-pointer whitespace-nowrap"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Beauty Academy</span>
          </button>
        </div>

        {/* Organized Service Categories & Dedicated Service Cards */}
        <div className="space-y-12">
          {groupsToShow.map((group) => {
            const categoryServices = SERVICES.filter(
              (s) => s.category === group.category
            );
            return (
              <section key={group.category} className="space-y-5">
                {/* Category Header Banner */}
                <div className="bg-[#F6EFE7] rounded-2xl p-5 sm:p-6 border border-[#C8A15A]/35 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#6B173D]">
                      CATEGORY {group.sectionCode} · {group.category}
                    </span>
                    <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#201B1D]">
                      {group.heading}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#6E6265]">
                      {group.tagline}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-w-md">
                    {group.serviceNames.map((sName) => (
                      <span
                        key={sName}
                        className="text-xs font-medium bg-white text-[#4A0D29] px-3 py-1 rounded-lg border border-[#C8A15A]/35"
                      >
                        {sName}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dedicated Service Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryServices.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white rounded-2xl border border-[#C8A15A]/35 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        <button
                          type="button"
                          onClick={() => onNavigate('service-details', service.id)}
                          className="w-full h-48 overflow-hidden bg-[#F3E9DF] block text-left"
                        >
                          <img
                            src={service.image}
                            alt={service.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                          />
                        </button>
                        <div className="p-5 space-y-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-[#6B173D]">
                              {service.category}
                            </span>
                            <span className="font-semibold text-[#4A0D29] bg-[#FAF5EF] px-2.5 py-0.5 rounded-md border border-[#C8A15A]/30">
                              {service.priceLabel}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => onNavigate('service-details', service.id)}
                            className="text-left block"
                          >
                            <h3 className="font-serif-luxury text-xl font-bold text-[#201B1D] hover:text-[#6B173D] transition-colors">
                              {service.name}
                            </h3>
                          </button>
                          <p className="text-xs sm:text-sm text-[#6E6265] leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </div>

                      <div className="px-5 pb-5 pt-3 border-t border-[#C8A15A]/20 grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => onNavigate('service-details', service.id)}
                          className="inline-flex items-center justify-center gap-1.5 bg-[#FAF5EF] hover:bg-[#F3E9DF] text-[#201B1D] border border-[#C8A15A]/45 text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors cursor-pointer"
                        >
                          <span>View Details</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onBookService(service.id)}
                          className="inline-flex items-center justify-center gap-1.5 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5 text-[#E6C98F]" />
                          <span>Book / Enquire</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const ServiceDetailsPageView: React.FC<{
  serviceId?: string;
  onNavigate: (page: PageId, param?: string) => void;
  onBookService: (serviceId: string) => void;
}> = ({ serviceId, onNavigate, onBookService }) => {
  const service: ServiceItem =
    SERVICES.find((s) => s.id === serviceId) || SERVICES[0];

  const relatedServices = SERVICES.filter(
    (s) => s.id !== service.id && s.category === service.category
  ).slice(0, 3);
  const fallbackRelated =
    relatedServices.length > 0
      ? relatedServices
      : SERVICES.filter((s) => s.id !== service.id).slice(0, 3);

  return (
    <div className="py-10 sm:py-14 bg-[#FAF5EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back button */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate('services', service.category)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#6B173D] hover:text-[#4A0D29] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {service.category} Services</span>
          </button>
        </div>

        {/* Main Detail Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Large Image */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-[#C8A15A]/40 shadow-md bg-[#F3E9DF]">
              <img
                src={service.image}
                alt={service.name}
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-96 object-cover object-top"
              />
            </div>
          </div>

          {/* Right: Complete Information */}
          <div className="lg:col-span-7 space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#C8A15A]/35 shadow-sm">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E6265]">
                <span className="font-bold uppercase tracking-wider text-[#6B173D]">
                  {service.category}
                </span>
                <span>·</span>
                <span className="font-semibold text-[#4A0D29] bg-[#FAF5EF] px-2.5 py-0.5 rounded-md border border-[#C8A15A]/30">
                  {service.priceLabel}
                </span>
              </div>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#201B1D]">
                {service.name}
              </h1>
              <p className="text-sm sm:text-base text-[#6E6265] leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Service Highlights */}
            <div className="space-y-2.5 pt-2 border-t border-[#C8A15A]/20">
              <h2 className="font-serif-luxury text-lg font-bold text-[#201B1D]">
                What’s Included &amp; Service Highlights
              </h2>
              <ul className="space-y-2 text-sm text-[#201B1D]/90">
                {service.benefits.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C8A15A] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Process */}
            <div className="space-y-2.5 pt-2 border-t border-[#C8A15A]/20">
              <h2 className="font-serif-luxury text-lg font-bold text-[#201B1D]">
                Our Service Process
              </h2>
              <ol className="space-y-2 text-sm text-[#201B1D]/90">
                {service.process.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="font-bold text-[#6B173D] tabular-nums">
                      0{idx + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Important Notes */}
            <div className="bg-[#FAF5EF] rounded-xl p-4 border border-[#C8A15A]/30 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B173D]">
                <AlertCircle className="w-4 h-4 text-[#C8A15A]" />
                <span>Service &amp; Pricing Note</span>
              </div>
              <ul className="space-y-1 text-xs sm:text-sm text-[#6E6265]">
                {service.importantNotes.map((note, idx) => (
                  <li key={idx}>• {note}</li>
                ))}
              </ul>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onBookService(service.id)}
                className="inline-flex items-center gap-2 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-sm font-semibold px-6 py-3.5 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#E6C98F]" />
                <span>Book Appointment for {service.name}</span>
              </button>
              <a
                href={buildWhatsAppGeneralUrl(
                  `Hello Sonu Foundation and Charitable Trust, I would like to enquire about ${service.name}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FAF5EF] hover:bg-[#F3E9DF] text-[#4A0D29] border border-[#C8A15A]/50 text-sm font-semibold px-5 py-3.5 rounded-xl transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#6B173D]" />
                <span>Enquire on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Related Services */}
        <div className="pt-8 border-t border-[#C8A15A]/25 space-y-5">
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#201B1D]">
            More in {service.category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fallbackRelated.map((rel) => (
              <div
                key={rel.id}
                className="bg-white rounded-2xl p-5 border border-[#C8A15A]/30 shadow-sm flex flex-col justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={rel.image}
                    alt={rel.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-[#C8A15A]/30"
                  />
                  <div>
                    <span className="text-[11px] font-semibold text-[#6B173D]">
                      {rel.category}
                    </span>
                    <h3 className="font-serif-luxury text-base font-bold text-[#201B1D]">
                      {rel.name}
                    </h3>
                    <p className="text-xs text-[#6E6265] mt-0.5 line-clamp-2">
                      {rel.shortDescription}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#C8A15A]/20 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onNavigate('service-details', rel.id)}
                    className="text-xs font-semibold text-[#6B173D] hover:underline cursor-pointer"
                  >
                    View Details →
                  </button>
                  <button
                    type="button"
                    onClick={() => onBookService(rel.id)}
                    className="text-xs font-semibold bg-[#6B173D] text-white px-3.5 py-1.5 rounded-lg cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const PricesPageView: React.FC<ServicesViewProps> = ({ onNavigate, onBookService }) => {
  const [activeCategory, setActiveCategory] = useState<'All' | ServiceCategory>('All');

  const categoriesToShow =
    activeCategory === 'All' ? SERVICE_CATEGORIES : [activeCategory];

  return (
    <div className="py-10 sm:py-14 bg-[#FAF5EF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-[0.18em] uppercase text-[#6B173D]">
            SERVICE MENU &amp; CONSULTATION • VADODARA
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#201B1D]">
            Service Menu &amp; Price List
          </h1>
          <p className="text-sm sm:text-base text-[#6E6265]">
            Explore all actual salon services across our 7 categories. Pricing is shared as <strong className="text-[#4A0D29]">Price on Enquiry</strong> based on hair length, skin requirements, and bridal customization. New clients enjoy <strong className="text-[#6B173D]">10% OFF on their first service</strong>.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {(['All', ...SERVICE_CATEGORIES] as ('All' | ServiceCategory)[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#6B173D] text-white border-[#6B173D]'
                  : 'bg-white text-[#201B1D] border-[#C8A15A]/40 hover:border-[#6B173D]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Price List Tables by Category */}
        <div className="space-y-6">
          {categoriesToShow.map((cat) => {
            const items = SERVICES.filter((s) => s.category === cat);
            if (items.length === 0) return null;

            return (
              <div
                key={cat}
                className="bg-white rounded-2xl border border-[#C8A15A]/40 shadow-sm overflow-hidden"
              >
                <div className="bg-[#F6EFE7] px-6 py-4 border-b border-[#C8A15A]/30 flex items-center justify-between">
                  <h2 className="font-serif-luxury text-xl font-bold text-[#4A0D29]">
                    {cat}
                  </h2>
                  <span className="text-xs text-[#6E6265]">Sonu’s Beauty Studio &amp; Academy</span>
                </div>

                <div className="divide-y divide-[#C8A15A]/20">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF5EF]/60 transition-colors"
                    >
                      <div className="space-y-1 max-w-xl">
                        <button
                          type="button"
                          onClick={() => onNavigate('service-details', item.id)}
                          className="font-serif-luxury text-lg font-bold text-[#201B1D] hover:text-[#6B173D] text-left cursor-pointer"
                        >
                          {item.name}
                        </button>
                        <p className="text-xs sm:text-sm text-[#6E6265]">{item.shortDescription}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <span className="text-xs sm:text-sm font-semibold text-[#4A0D29] bg-[#FAF5EF] px-3.5 py-2 rounded-lg border border-[#C8A15A]/35">
                          {item.priceLabel}
                        </span>
                        <button
                          type="button"
                          onClick={() => onBookService(item.id)}
                          className="inline-flex items-center gap-1.5 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                        >
                          <span>Book Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Consultation Banner */}
        <div className="bg-gradient-to-r from-[#6B173D] to-[#4A0D29] text-white rounded-2xl p-6 sm:p-8 border border-[#C8A15A]/45 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif-luxury text-2xl font-bold text-[#FAF5EF]">
              Need a Custom Bridal or Group Package Quote?
            </h3>
            <p className="text-xs sm:text-sm text-[#FAF5EF]/85">
              Connect with our Vadodara studio team on WhatsApp or book your consultation online.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={buildWhatsAppGeneralUrl(
                'Hello Sonu Foundation and Charitable Trust, I would like to enquire about your service prices and training programs.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#E6C98F] hover:bg-[#C8A15A] text-[#201B1D] text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask Price on WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={() => onNavigate('book')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-[#C8A15A]/50 text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#E6C98F]" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
