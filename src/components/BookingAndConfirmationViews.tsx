import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  AlertCircle,
  Info,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import {
  BUSINESS_INFO,
  LOCATIONS,
  PageId,
  SERVICE_CATEGORY_GROUPS,
  SERVICES,
  ServiceCategory,
  TIME_SLOTS,
} from '../data/siteData';
import {
  
  type BlockedDateRecord,
  BookingInput,
  BookingRecord,
  BUSINESS_HOURS_CONFIG,
  buildWhatsAppBookingUrl,
  fetchSlotAvailabilityFromServer,
  getKolkataDateTimeParts,
  submitBookingToServer,
  validateBookingStep,
  validateFullBooking,
} from '../utils/bookingLogic';

interface BookingViewProps {
  initialPrefill?: Partial<BookingInput>;
  onBookingCreated: (record: BookingRecord) => void;
  onNavigate: (page: PageId) => void;
}

export const BookAppointmentPageView: React.FC<BookingViewProps> = ({
  initialPrefill,
  onBookingCreated,
}) => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<BookingInput>({
    location_id: initialPrefill?.location_id || '',
    service_id: initialPrefill?.service_id || '',
    appointment_date: initialPrefill?.appointment_date || '',
    appointment_time: initialPrefill?.appointment_time || '',
    customer_name: initialPrefill?.customer_name || '',
    phone: initialPrefill?.phone || '',
    whatsapp_number: initialPrefill?.whatsapp_number || '',
    email: initialPrefill?.email || '',
    message: initialPrefill?.message || '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'All' | ServiceCategory>('All');

  // Non-PII slot availability state fetched from /api/slots
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDateRecord[]>([]);
  const [isDateBlocked, setIsDateBlocked] = useState(false);
  const [blockedReason, setBlockedReason] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const todayKolkataIso = getKolkataDateTimeParts().dateStr;

  const selectedLocation = LOCATIONS.find((l) => l.id === form.location_id);
  const selectedService = SERVICES.find((s) => s.id === form.service_id);

  // Fetch non-PII slot availability when location or date changes
  useEffect(() => {
    if (!form.location_id) return;
    let active = true;
    setLoadingSlots(true);
    fetchSlotAvailabilityFromServer(form.location_id, form.appointment_date)
      .then((res) => {
        if (!active) return;
        setBookedSlots(res.bookedSlots || []);
        setBlockedDates(res.blockedDates || []);
        setIsDateBlocked(Boolean(res.isDateBlocked));
        setBlockedReason(res.blockedReason || null);
        setLoadingSlots(false);
      })
      .catch(() => {
        if (!active) return;
        setLoadingSlots(false);
      });
    return () => {
      active = false;
    };
  }, [form.location_id, form.appointment_date]);

  const stepsList = [
    { num: 1, label: 'Location' },
    { num: 2, label: 'Service' },
    { num: 3, label: 'Date' },
    { num: 4, label: 'Time' },
    { num: 5, label: 'Details' },
    { num: 6, label: 'Review' },
  ];

  const handleNextStep = () => {
    setError(null);
    const check = validateBookingStep(step, form, undefined, blockedDates);
    if (!check.valid) {
      setError(check.error || 'Please complete this step before continuing.');
      return;
    }
    if (step === 3 && isDateBlocked) {
      setError(`Selected date is unavailable: ${blockedReason || 'Studio closed on this date.'}`);
      return;
    }
    if (step === 4 && bookedSlots.includes(form.appointment_time)) {
      setError(
        'This appointment time slot is already booked at the selected studio branch. Please select another time slot.'
      );
      return;
    }
    setStep((prev) => Math.min(prev + 1, 6));
  };

  const handlePrevStep = () => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);

    const fullCheck = validateFullBooking(form, [], undefined, blockedDates);
    if (!fullCheck.valid) {
      setError(fullCheck.error || 'Please check your appointment details.');
      return;
    }

    if (bookedSlots.includes(form.appointment_time)) {
      setError(
        'This appointment time slot is already booked at the selected studio branch. Please select another time slot.'
      );
      return;
    }

    const loc = LOCATIONS.find((l) => l.id === form.location_id);
    const srv = SERVICES.find((s) => s.id === form.service_id);
    if (!loc || !srv) {
      setError('Please select a valid location and service.');
      return;
    }

    setIsSubmitting(true);
    try {
      const savedRecord = await submitBookingToServer(form);
      setIsSubmitting(false);
      onBookingCreated(savedRecord);
    } catch (err: unknown) {
      setIsSubmitting(false);
      // Refresh slot availability if slot was just taken
      if (form.location_id && form.appointment_date) {
        fetchSlotAvailabilityFromServer(form.location_id, form.appointment_date)
          .then((res) => {
            setBookedSlots(res.bookedSlots || []);
            setBlockedDates(res.blockedDates || []);
          })
          .catch(() => {});
      }
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save booking to database. Please try again.'
      );
    }
  };

  return (
    <div className="py-10 sm:py-14 bg-[#FAF5EF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold tracking-[0.18em] uppercase text-[#6B173D]">
            PROGRAM ENQUIRY • SONU FOUNDATION AND CHARITABLE TRUST
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#201B1D]">
            Book Your Appointment
          </h1>
          <p className="text-sm sm:text-base text-[#6E6265]">
            Select your preferred Vadodara studio branch, service, date, and time ({BUSINESS_HOURS_CONFIG.label}). Bookings are saved as <strong className="text-[#4A0D29]">Pending Confirmation</strong> until confirmed by the studio.
          </p>
        </div>

        {/* Stepper Bar */}
        <div className="bg-white rounded-2xl p-4 border border-[#C8A15A]/35 shadow-sm">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {stepsList.map((s) => {
              const isCurrent = step === s.num;
              const isDone = step > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    if (s.num < step) {
                      setError(null);
                      setStep(s.num);
                    }
                  }}
                  className={`flex items-center justify-center sm:justify-start gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isCurrent
                      ? 'bg-[#6B173D] text-white shadow-sm'
                      : isDone
                      ? 'bg-[#F3E9DF] text-[#4A0D29] cursor-pointer'
                      : 'bg-[#FAF5EF] text-[#6E6265]'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-[11px] tabular-nums">
                    {isDone ? '✓' : s.num}
                  </span>
                  <span className="truncate">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Step Card */}
        <form
          onSubmit={handleFinalSubmit}
          noValidate
          className="bg-white rounded-2xl p-6 sm:p-8 border border-[#C8A15A]/40 shadow-md space-y-6"
        >
          {error && (
            <div
              role="alert"
              className="p-4 rounded-xl bg-[#6B173D]/10 border border-[#6B173D]/40 text-sm text-[#4A0D29] flex items-center gap-2.5 font-semibold"
            >
              <AlertCircle className="w-5 h-5 text-[#6B173D] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Select Location */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B173D]">
                  Step 1 of 6
                </span>
                <h2 className="font-serif-luxury text-2xl font-bold text-[#201B1D]">
                  Select Your Preferred Branch
                </h2>
                <p className="text-xs sm:text-sm text-[#6E6265]">
                  Choose Branch 1 (Waghodia Road) or Branch 2 (Adaniyapul, Fatepura) in Vadodara for your appointment.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LOCATIONS.map((loc) => {
                  const selected = form.location_id === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        setForm({ ...form, location_id: loc.id });
                        setError(null);
                      }}
                      className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        selected
                          ? 'border-[#6B173D] bg-[#FAF5EF] shadow-md'
                          : 'border-[#C8A15A]/35 bg-white hover:border-[#6B173D]/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-bold text-[#6B173D] uppercase tracking-wider">
                            {loc.badge}
                          </span>
                          {selected && <CheckCircle2 className="w-5 h-5 text-[#6B173D] shrink-0" />}
                        </div>
                        <h3 className="font-serif-luxury text-lg font-bold text-[#201B1D]">
                          {loc.name}
                        </h3>
                        <div className="text-xs text-[#6E6265] mt-2 space-y-0.5">
                          {loc.addressLines.map((l, i) => (
                            <div key={i}>{l}</div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#C8A15A]/20 text-xs text-[#4A0D29] font-medium flex flex-wrap items-center justify-between gap-2">
                        <span>{loc.hours}</span>
                        <span className="tabular-nums">{loc.phone}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Select Service */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B173D]">
                  Step 2 of 6
                </span>
                <h2 className="font-serif-luxury text-2xl font-bold text-[#201B1D]">
                  Select Your Service
                </h2>
                <p className="text-xs sm:text-sm text-[#6E6265]">
                  Choose from our 36 actual studio services across 7 specialized categories.
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-1.5">
                {(['All', ...SERVICE_CATEGORY_GROUPS.map((g) => g.category)] as const).map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#6B173D] text-white'
                          : 'bg-[#FAF5EF] text-[#201B1D] border border-[#C8A15A]/30 hover:border-[#6B173D]/40'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[420px] overflow-y-auto pr-1">
                {SERVICES.filter(
                  (srv) => selectedCategory === 'All' || srv.category === selectedCategory
                ).map((srv) => {
                  const selected = form.service_id === srv.id;
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => {
                        setForm({ ...form, service_id: srv.id });
                        setError(null);
                      }}
                      className={`flex items-start gap-3.5 p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        selected
                          ? 'border-[#6B173D] bg-[#FAF5EF] shadow-sm'
                          : 'border-[#C8A15A]/30 bg-white hover:border-[#6B173D]/50'
                      }`}
                    >
                      <img
                        src={srv.image}
                        alt={srv.name}
                        className="w-16 h-16 rounded-lg object-cover shrink-0 border border-[#C8A15A]/30"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-bold text-[#6B173D]">
                            {srv.category}
                          </span>
                          {selected && <CheckCircle2 className="w-4 h-4 text-[#6B173D] shrink-0" />}
                        </div>
                        <h3 className="font-serif-luxury text-base font-bold text-[#201B1D] truncate">
                          {srv.name}
                        </h3>
                        <p className="text-xs text-[#6E6265] line-clamp-1">{srv.shortDescription}</p>
                        <span className="text-[11px] text-[#4A0D29] font-medium">
                          {srv.priceLabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Select Date */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B173D]">
                  Step 3 of 6
                </span>
                <h2 className="font-serif-luxury text-2xl font-bold text-[#201B1D]">
                  Select Appointment Date
                </h2>
                <p className="text-xs sm:text-sm text-[#6E6265]">
                  Studio Hours: {BUSINESS_HOURS_CONFIG.label} (Timezone: Asia/Kolkata).
                </p>
              </div>

              <div className="max-w-sm">
                <label
                  htmlFor="booking-date-input"
                  className="block text-xs font-semibold text-[#201B1D] mb-1.5"
                >
                  Preferred Date *
                </label>
                <input
                  id="booking-date-input"
                  type="date"
                  min={todayKolkataIso}
                  value={form.appointment_date}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      appointment_date: e.target.value,
                      appointment_time: '',
                    });
                    setError(null);
                  }}
                  className="w-full rounded-xl border-2 border-[#C8A15A]/50 bg-[#FAF5EF] px-4 py-3 text-base font-medium text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
                />
              </div>

              {isDateBlocked && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs sm:text-sm text-amber-900 font-medium">
                  Note: This date is marked closed/unavailable ({blockedReason}). Please choose another date.
                </div>
              )}

              {blockedDates.length > 0 && (
                <div className="text-xs text-[#6E6265] bg-[#FAF5EF] p-3.5 rounded-xl border border-[#C8A15A]/30">
                  <strong className="text-[#4A0D29] block mb-1">
                    Upcoming Closed / Blocked Dates at this Branch:
                  </strong>
                  <div className="flex flex-wrap gap-2">
                    {blockedDates.map((bd) => (
                      <span
                        key={bd.id}
                        className="px-2.5 py-1 rounded-md bg-white border border-[#C8A15A]/40 text-[#4A0D29] font-medium tabular-nums"
                      >
                        {bd.blocked_date} ({bd.reason})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Select Time */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B173D]">
                    Step 4 of 6
                  </span>
                  <h2 className="font-serif-luxury text-2xl font-bold text-[#201B1D]">
                    Select Preferred Time Slot
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6E6265]">
                    Choose an available time slot between 10:00 AM and 7:30 PM IST for{' '}
                    <strong className="text-[#4A0D29]">{form.appointment_date}</strong>.
                  </p>
                </div>
                {loadingSlots && (
                  <span className="text-xs font-medium text-[#6B173D]">
                    Checking slot availability...
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {TIME_SLOTS.map((slot) => {
                  const isTaken = bookedSlots.includes(slot);
                  const selected = form.appointment_time === slot && !isTaken;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isTaken}
                      onClick={() => {
                        if (isTaken) return;
                        setForm({ ...form, appointment_time: slot });
                        setError(null);
                      }}
                      className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all tabular-nums flex items-center justify-center gap-1.5 ${
                        isTaken
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                          : selected
                          ? 'bg-[#6B173D] text-white border-[#6B173D] shadow-sm cursor-pointer'
                          : 'bg-[#FAF5EF] text-[#201B1D] border-[#C8A15A]/40 hover:border-[#6B173D] cursor-pointer'
                      }`}
                    >
                      <span>{slot}</span>
                      {isTaken && (
                        <span className="text-[10px] font-bold uppercase no-underline text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                          Booked
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {bookedSlots.length > 0 && (
                <p className="text-xs text-[#6E6265] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#6B173D]" />
                  <span>
                    Slots marked <strong>Booked</strong> are already reserved at{' '}
                    {selectedLocation?.shortLabel} on {form.appointment_date}.
                  </span>
                </p>
              )}
            </div>
          )}

          {/* STEP 5: Your Details */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B173D]">
                  Step 5 of 6
                </span>
                <h2 className="font-serif-luxury text-2xl font-bold text-[#201B1D]">
                  Your Contact Details
                </h2>
                <p className="text-xs sm:text-sm text-[#6E6265]">
                  Enter your contact details so our studio team can confirm your appointment slot via phone or WhatsApp.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bk-name" className="block text-xs font-semibold text-[#201B1D] mb-1">
                    Full Name *
                  </label>
                  <input
                    id="bk-name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={form.customer_name}
                    onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                    className="w-full rounded-xl border border-[#C8A15A]/50 bg-[#FAF5EF] px-3.5 py-2.5 text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
                  />
                </div>

                <div>
                  <label htmlFor="bk-phone" className="block text-xs font-semibold text-[#201B1D] mb-1">
                    Phone Number *
                  </label>
                  <input
                    id="bk-phone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl border border-[#C8A15A]/50 bg-[#FAF5EF] px-3.5 py-2.5 text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
                  />
                </div>

                <div>
                  <label htmlFor="bk-whatsapp" className="block text-xs font-semibold text-[#201B1D] mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    id="bk-whatsapp"
                    type="tel"
                    placeholder="Same as phone or enter WhatsApp number"
                    value={form.whatsapp_number}
                    onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                    className="w-full rounded-xl border border-[#C8A15A]/50 bg-[#FAF5EF] px-3.5 py-2.5 text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
                  />
                </div>

                <div>
                  <label htmlFor="bk-email" className="block text-xs font-semibold text-[#201B1D] mb-1">
                    Email Address
                  </label>
                  <input
                    id="bk-email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-[#C8A15A]/50 bg-[#FAF5EF] px-3.5 py-2.5 text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bk-message" className="block text-xs font-semibold text-[#201B1D] mb-1">
                  Additional Message / Special Requests
                </label>
                <textarea
                  id="bk-message"
                  rows={3}
                  placeholder="Any specific notes (e.g., bridal consultation, skin sensitivity, preferred branch timing)..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-xl border border-[#C8A15A]/50 bg-[#FAF5EF] px-3.5 py-2.5 text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-[#6E6265] pt-1">
                <ShieldCheck className="w-4 h-4 text-[#6B173D] shrink-0" />
                <span>
                  Your contact details are encrypted and accessible only to authorized studio administrators.
                </span>
              </div>
            </div>
          )}

          {/* STEP 6: Review Appointment & Submit Request */}
          {step === 6 && (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B173D]">
                  Step 6 of 6 — Review &amp; Submit
                </span>
                <h2 className="font-serif-luxury text-2xl font-bold text-[#201B1D]">
                  Review Your Appointment Request
                </h2>
                <p className="text-xs sm:text-sm text-[#6E6265]">
                  Please verify your selected branch location, service, date, and contact details before submitting.
                </p>
              </div>

              <div className="bg-[#FAF5EF] rounded-2xl p-5 border border-[#C8A15A]/40 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-[#6E6265] block">Selected Location</span>
                  <strong className="text-[#201B1D]">{selectedLocation?.name}</strong>
                  <span className="block text-xs text-[#6E6265] mt-0.5">
                    {selectedLocation?.addressLines.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#6E6265] block">Selected Service</span>
                  <strong className="text-[#6B173D]">{selectedService?.name}</strong>
                  <span className="block text-xs text-[#6E6265] mt-0.5">
                    {selectedService?.priceLabel}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#6E6265] block">Appointment Date &amp; Time (IST)</span>
                  <strong className="text-[#201B1D] tabular-nums">
                    {form.appointment_date} at {form.appointment_time}
                  </strong>
                </div>
                <div>
                  <span className="text-xs text-[#6E6265] block">Client Details</span>
                  <strong className="text-[#201B1D]">{form.customer_name}</strong>
                  <span className="block text-xs text-[#6E6265] tabular-nums">
                    Phone: {form.phone}
                    {form.whatsapp_number ? ` · WhatsApp: ${form.whatsapp_number}` : ''}
                  </span>
                </div>
                {form.message && (
                  <div className="sm:col-span-2 pt-2 border-t border-[#C8A15A]/20">
                    <span className="text-xs text-[#6E6265] block">Additional Notes</span>
                    <p className="text-xs sm:text-sm text-[#201B1D]">{form.message}</p>
                  </div>
                )}
              </div>

              <div className="bg-[#F6EFE7] rounded-xl p-4 border border-[#C8A15A]/45 flex items-start gap-3 text-xs sm:text-sm text-[#4A0D29]">
                <Info className="w-5 h-5 text-[#6B173D] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Pending Confirmation Notice</strong>
                  <span>
                    Submitting this form reserves your requested time slot with status <strong>Pending Confirmation</strong>. Your appointment is confirmed once Sonu’s Beauty Studio &amp; Academy reviews and confirms your booking.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step Navigation Buttons */}
          <div className="pt-4 border-t border-[#C8A15A]/25 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#C8A15A]/50 bg-[#FAF5EF] hover:bg-[#F3E9DF] text-xs sm:text-sm font-semibold text-[#201B1D] cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <button
                key="continue-step-btn"
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-2 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                key="submit-booking-btn"
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-sm font-bold px-7 py-3.5 rounded-xl shadow-md transition-colors cursor-pointer disabled:opacity-60"
              >
                <CheckCircle2 className="w-4 h-4 text-[#E6C98F]" />
                <span>{isSubmitting ? 'Saving Booking Request...' : 'Submit Booking Request'}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export const BookingConfirmationPageView: React.FC<{
  booking: BookingRecord | null;
  onNavigate: (page: PageId) => void;
}> = ({ booking, onNavigate }) => {
  if (!booking) {
    return (
      <div className="py-16 bg-[#FAF5EF] text-center max-w-xl mx-auto px-4 space-y-4">
        <h1 className="font-serif-luxury text-3xl font-bold text-[#201B1D]">
          No Recent Booking Found
        </h1>
        <p className="text-sm text-[#6E6265]">
          Please complete the appointment request form to receive your unique booking reference ID.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('book')}
          className="inline-flex items-center gap-2 bg-[#6B173D] text-white text-sm font-semibold px-6 py-3 rounded-xl cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>
    );
  }

  const whatsappBookingUrl = buildWhatsAppBookingUrl({
    customer_name: booking.customer_name,
    service_name: booking.service_name,
    appointment_date: booking.appointment_date,
    appointment_time: booking.appointment_time,
    location_name: booking.location_name,
    booking_id: booking.booking_id,
  });

  return (
    <div className="py-12 sm:py-16 bg-[#FAF5EF]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#C8A15A]/50 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#6B173D]/10 text-[#6B173D] flex items-center justify-center mx-auto border border-[#C8A15A]/40">
            <Clock className="w-8 h-8 text-[#6B173D]" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#F3E9DF] text-[#6B173D] border border-[#C8A15A]/50 text-xs font-bold tracking-[0.14em] uppercase">
              STATUS: {booking.status.toUpperCase()}
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#201B1D]">
              Appointment Request Saved — Pending Confirmation
            </h1>
            <p className="text-sm sm:text-base text-[#6E6265] max-w-lg mx-auto">
              Your appointment request has been saved with Booking ID <strong className="text-[#6B173D] font-mono">{booking.booking_id}</strong>. Please note that your booking is <strong>Pending Confirmation</strong> until our salon administrator reviews and confirms your time slot.
            </p>
          </div>

          {/* Booking Details Summary Table */}
          <div className="bg-[#FAF5EF] rounded-2xl p-5 sm:p-6 border border-[#C8A15A]/40 text-left space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-[#C8A15A]/20 pb-2.5">
              <span className="text-[#6E6265]">Booking ID</span>
              <span className="font-mono font-bold text-[#6B173D] tabular-nums">
                {booking.booking_id}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-[#C8A15A]/20 pb-2.5">
              <span className="text-[#6E6265]">Customer Name</span>
              <span className="font-semibold text-[#201B1D]">{booking.customer_name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#C8A15A]/20 pb-2.5">
              <span className="text-[#6E6265]">Service</span>
              <span className="font-semibold text-[#201B1D] text-right">{booking.service_name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#C8A15A]/20 pb-2.5">
              <span className="text-[#6E6265]">Location</span>
              <span className="font-semibold text-[#201B1D] text-right">{booking.location_name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#C8A15A]/20 pb-2.5">
              <span className="text-[#6E6265]">Date</span>
              <span className="font-semibold text-[#201B1D] tabular-nums">
                {booking.appointment_date}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-[#C8A15A]/20 pb-2.5">
              <span className="text-[#6E6265]">Time (IST)</span>
              <span className="font-semibold text-[#201B1D] tabular-nums">
                {booking.appointment_time}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-[#C8A15A]/20 pb-2.5">
              <span className="text-[#6E6265]">Phone</span>
              <span className="font-semibold text-[#201B1D] tabular-nums">{booking.phone}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[#6E6265]">Current Status</span>
              <span className="font-bold text-[#6B173D] bg-[#F3E9DF] px-3 py-0.5 rounded-full border border-[#C8A15A]/40">
                {booking.status}
              </span>
            </div>
          </div>

          <div className="bg-[#F6EFE7] rounded-2xl p-4 border border-[#C8A15A]/45 text-left text-xs sm:text-sm text-[#4A0D29] space-y-1">
            <strong className="block font-bold">How WhatsApp Slot Confirmation Works:</strong>
            <p className="text-[#6E6265]">
              When our studio administrator reviews and confirms your booking, a confirmation is triggered to your submitted WhatsApp number. You can also click the button below to message our studio directly on WhatsApp ({BUSINESS_INFO.whatsappDisplay}) with your booking reference.
            </p>
          </div>

          {/* Direct Click-to-WhatsApp Workflow Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={whatsappBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-sm font-bold px-6 py-3.5 rounded-xl shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#E6C98F]" />
              <span>Send Booking Details on WhatsApp ({BUSINESS_INFO.whatsappDisplay})</span>
            </a>

            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FAF5EF] hover:bg-[#F3E9DF] text-[#201B1D] border border-[#C8A15A]/50 text-sm font-semibold px-6 py-3.5 rounded-xl transition-colors cursor-pointer"
            >
              <span>Back to Website</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
