import React, { useState } from 'react';
import {
  AlertCircle,
  CalendarHeart,
  CheckCircle2,
  GraduationCap,
  HeartHandshake,
  Mail,
  MessageCircle,
  Send,
  Sparkles,
} from 'lucide-react';
import {
  BUSINESS_INFO,
  ENQUIRY_CATEGORIES,
  type EnquiryCategoryConfig,
  type EnquiryCategoryId,
} from '../data/siteData';
import {
  type ContactMessageRecord,
  buildCategoryEnquiryWhatsAppUrl,
  getEnquiryCategoryConfig,
  submitContactMessageToServer,
  validateContactMessage,
} from '../utils/bookingLogic';

interface EnquiryCategoriesSectionProps {
  variant?: 'home' | 'contact';
  selectedCategory?: EnquiryCategoryId;
  onSelectCategory?: (categoryId: EnquiryCategoryId) => void;
  showEmbeddedForm?: boolean;
  onSaveContactMessage?: (record: ContactMessageRecord) => void;
}

const CategoryIcon: React.FC<{ id: EnquiryCategoryId; className?: string }> = ({
  id,
  className = 'w-5 h-5',
}) => {
  if (id === 'trust') {
    return <HeartHandshake className={className} aria-hidden="true" />;
  }
  if (id === 'academy') {
    return <GraduationCap className={className} aria-hidden="true" />;
  }
  return <Sparkles className={className} aria-hidden="true" />;
};

export const EnquiryCategoriesSection: React.FC<EnquiryCategoriesSectionProps> = ({
  variant = 'home',
  selectedCategory: controlledCategory,
  onSelectCategory,
  showEmbeddedForm = false,
  onSaveContactMessage,
}) => {
  const [internalCategory, setInternalCategory] = useState<EnquiryCategoryId>('trust');
  const activeCategoryId = controlledCategory ?? internalCategory;
  const activeCategory: EnquiryCategoryConfig = getEnquiryCategoryConfig(activeCategoryId);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedRecord, setSavedRecord] = useState<ContactMessageRecord | null>(null);

  const handleChooseCategory = (categoryId: EnquiryCategoryId) => {
    setInternalCategory(categoryId);
    setSavedRecord(null);
    setError(null);
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    } else if (showEmbeddedForm) {
      const formEl = document.getElementById('home-category-enquiry-form');
      formEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);

    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      message: form.message,
      category: activeCategoryId,
    };

    const check = validateContactMessage(payload);
    if (!check.valid) {
      setError(check.error || 'Please check your enquiry details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const record = await submitContactMessageToServer({
        ...payload,
        message: `[${activeCategory.title}] ${form.message.trim()}`,
      });
      onSaveContactMessage?.(record);
      setSavedRecord(record);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to submit your enquiry right now. Please try WhatsApp or phone.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isHome = variant === 'home';

  return (
    <section
      aria-labelledby="enquiry-categories-heading"
      className={
        isHome
          ? 'py-12 sm:py-14 bg-[#FAF5EF] border-t border-[#C8A15A]/25'
          : 'w-full'
      }
    >
      <div className={isHome ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8' : 'space-y-6'}>
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <span className="text-xs font-bold tracking-[0.18em] uppercase text-[#6B173D] block">
            THREE SEPARATE ENQUIRY DESKS
          </span>
          <h2
            id="enquiry-categories-heading"
            className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#201B1D] text-balance"
          >
            Choose Your Enquiry Category
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6265] leading-relaxed">
            Select the dedicated desk for Foundation &amp; Charitable Trust, Beauty Academy courses, or Beauty Studio treatments so your WhatsApp chat or enquiry form reaches the right team directly.
          </p>
        </div>

        {/* Three Separated Enquiry Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {ENQUIRY_CATEGORIES.map((category) => {
            const isSelected = activeCategoryId === category.id;
            const whatsappHref = buildCategoryEnquiryWhatsAppUrl(category.id);

            return (
              <article
                key={category.id}
                data-testid={`enquiry-card-${category.id}`}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-150 bg-white border ${
                  isSelected
                    ? 'border-[#6B173D] ring-2 ring-[#6B173D]/15 shadow-md'
                    : 'border-[#C8A15A]/45 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#4A0D29] border border-[#C8A15A]/60 flex items-center justify-center shrink-0">
                      <CategoryIcon id={category.id} className="w-5 h-5 text-[#E6C98F]" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] px-2.5 py-1 rounded-md bg-[#FAF5EF] text-[#6B173D] border border-[#C8A15A]/40">
                      Category {category.code}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-[#6B173D]">
                      {category.businessName}
                    </div>
                    <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#201B1D] leading-snug">
                      {category.title}
                    </h3>
                  </div>

                  <ul className="space-y-2 pt-2 border-t border-[#C8A15A]/25">
                    {category.purposes.map((purpose) => (
                      <li
                        key={purpose}
                        className="flex items-start gap-2 text-xs sm:text-sm text-[#4A0D29]/90"
                      >
                        <CheckCircle2
                          className="w-4 h-4 text-[#C8A15A] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{purpose}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-[#C8A15A]/25 flex flex-col gap-2.5">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`whatsapp-btn-${category.id}`}
                    aria-label={`${category.whatsappButtonLabel} for ${category.businessName} (opens in a new tab)`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#E6C98F] shrink-0" aria-hidden="true" />
                    <span>{category.whatsappButtonLabel}</span>
                  </a>

                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleChooseCategory(category.id)}
                    className={`w-full inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#F6EFE7] border-[#6B173D] text-[#4A0D29]'
                        : 'bg-[#FAF5EF] hover:bg-[#F3E9DF] border-[#C8A15A]/50 text-[#201B1D]'
                    }`}
                  >
                    <CalendarHeart className="w-4 h-4 text-[#6B173D] shrink-0" aria-hidden="true" />
                    <span>{category.formButtonLabel}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Embedded Category Enquiry Form (for Home view) */}
        {showEmbeddedForm && (
          <div
            id="home-category-enquiry-form"
            className="max-w-4xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-[#C8A15A]/45 shadow-sm space-y-5"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#C8A15A]/25">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B173D] block">
                  {activeCategory.businessName}
                </span>
                <h3 className="font-serif-luxury text-2xl font-bold text-[#201B1D] mt-0.5">
                  {activeCategory.formHeading}
                </h3>
              </div>

              <div
                className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 bg-[#FAF5EF] p-1 rounded-xl border border-[#C8A15A]/35 shrink-0"
                role="tablist"
                aria-label="Enquiry Category Form Selector"
              >
                {ENQUIRY_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={activeCategoryId === cat.id}
                    onClick={() => handleChooseCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap text-center ${
                      activeCategoryId === cat.id
                        ? 'bg-[#6B173D] text-white shadow-sm'
                        : 'text-[#4A0D29] hover:bg-[#F3E9DF]'
                    }`}
                  >
                    {cat.code}. {cat.shortTitle}
                  </button>
                ))}
              </div>
            </div>

            {savedRecord ? (
              <div className="py-4 text-center space-y-4">
                <CheckCircle2 className="w-11 h-11 text-[#6B173D] mx-auto" />
                <div className="text-xs font-semibold text-[#6B173D]">
                  Saved · Ref ID: {savedRecord.reference_id}
                </div>
                <h4 className="font-serif-luxury text-xl font-bold text-[#201B1D]">
                  {activeCategory.title} Received
                </h4>
                <p className="text-xs sm:text-sm text-[#6E6265] max-w-md mx-auto">
                  Thank you, {savedRecord.name}. Your enquiry for {activeCategory.businessName} has been recorded and our team will reach out shortly.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a
                    href={buildCategoryEnquiryWhatsAppUrl(activeCategoryId, {
                      name: savedRecord.name,
                      phone: savedRecord.phone,
                      message: savedRecord.message.replace(/^\[[^\]]+\]\s*/, ''),
                      referenceId: savedRecord.reference_id,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#E6C98F]" />
                    <span>Also Send on WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSavedRecord(null);
                      setForm({ name: '', phone: '', email: '', message: '' });
                    }}
                    className="px-4 py-2.5 rounded-xl border border-[#C8A15A]/45 text-xs sm:text-sm font-medium text-[#201B1D] hover:bg-[#FAF5EF] cursor-pointer"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {error && (
                  <div
                    role="alert"
                    className="p-3 rounded-xl bg-[#6B173D]/10 border border-[#6B173D]/40 text-xs sm:text-sm text-[#4A0D29] flex items-center gap-2 font-medium"
                  >
                    <AlertCircle className="w-4 h-4 text-[#6B173D] shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="home-enq-name"
                      className="block text-xs font-semibold text-[#201B1D] mb-1"
                    >
                      Full Name *
                    </label>
                    <input
                      id="home-enq-name"
                      type="text"
                      required
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border border-[#C8A15A]/45 bg-[#FAF5EF] px-3.5 py-2.5 text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="home-enq-phone"
                      className="block text-xs font-semibold text-[#201B1D] mb-1"
                    >
                      Phone Number *
                    </label>
                    <input
                      id="home-enq-phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-xl border border-[#C8A15A]/45 bg-[#FAF5EF] px-3.5 py-2.5 text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="home-enq-email"
                      className="block text-xs font-semibold text-[#201B1D] mb-1"
                    >
                      Email Address (Optional)
                    </label>
                    <input
                      id="home-enq-email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-xl border border-[#C8A15A]/45 bg-[#FAF5EF] px-3.5 py-2.5 text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="home-enq-details"
                    className="block text-xs font-semibold text-[#201B1D] mb-1"
                  >
                    Enquiry Details ({activeCategory.shortTitle}) *
                  </label>
                  <textarea
                    id="home-enq-details"
                    rows={3}
                    required
                    placeholder={activeCategory.detailsPlaceholder}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-xl border border-[#C8A15A]/45 bg-[#FAF5EF] px-3.5 py-2.5 text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 bg-[#6B173D] hover:bg-[#4A0D29] disabled:opacity-60 text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#E6C98F]" />
                    <span>
                      {isSubmitting
                        ? 'Submitting...'
                        : `Submit ${activeCategory.shortTitle}`}
                    </span>
                  </button>

                  <a
                    href={buildCategoryEnquiryWhatsAppUrl(activeCategoryId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#FAF5EF] hover:bg-[#F3E9DF] text-[#4A0D29] border border-[#C8A15A]/50 text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#6B173D]" />
                    <span>{activeCategory.whatsappButtonLabel}</span>
                  </a>

                  {BUSINESS_INFO.email && (
                    <a
                      href={`mailto:${BUSINESS_INFO.email}?subject=${encodeURIComponent(activeCategory.title)}`}
                      className="inline-flex items-center gap-2 bg-white hover:bg-[#FAF5EF] text-[#201B1D] border border-[#C8A15A]/45 text-xs sm:text-sm font-medium px-4 py-3 rounded-xl transition-colors"
                    >
                      <Mail className="w-4 h-4 text-[#6B173D]" />
                      <span>Email {BUSINESS_INFO.email}</span>
                    </a>
                  )}
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
