import { BUSINESS_INFO, COURSES, LOCATIONS, SERVICES, TIME_SLOTS } from '../data/siteData.ts';

export type BookingStatus =
  | 'Pending Confirmation'
  | 'Confirmed'
  | 'Rescheduled'
  | 'Rejected';

export type WhatsAppDeliveryStatus =
  | 'Not Sent'
  | 'Not Configured'
  | 'Sent'
  | 'Failed';

export interface BookingInput {
  location_id: string;
  service_id: string;
  appointment_date: string;
  appointment_time: string;
  customer_name: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  message: string;
}

export interface BookingStatusHistoryEntry {
  id: string;
  booking_id: string;
  previous_status: BookingStatus | null;
  new_status: BookingStatus;
  changed_by: string;
  notes: string;
  whatsapp_status?: WhatsAppDeliveryStatus;
  created_at: string;
}

export interface BookingRecord extends BookingInput {
  id: string;
  booking_id: string;
  location_name: string;
  service_name: string;
  status: BookingStatus;
  created_at: string;
  updated_at?: string;
  storage_backend?: 'supabase' | 'server-db';
  whatsapp_message_id?: string | null;
  whatsapp_status?: WhatsAppDeliveryStatus;
  whatsapp_timestamp?: string | null;
  whatsapp_error?: string | null;
  admin_notes?: string;
}

export interface BlockedDateRecord {
  id: string;
  location_id: 'all' | 'location-1' | 'location-2';
  blocked_date: string;
  reason: string;
  created_by: string;
  created_at: string;
}

export interface CourseEnquiryInput {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  course: string;
  preferred_location: string;
  message: string;
}

export interface CourseEnquiryRecord extends CourseEnquiryInput {
  id: string;
  enquiry_id: string;
  status: 'Received' | 'Contacted' | 'Enrolled';
  created_at: string;
  storage_backend?: 'supabase' | 'server-db';
}

export interface ContactMessageInput {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export interface ContactMessageRecord extends ContactMessageInput {
  id: string;
  reference_id: string;
  status: 'Received' | 'Replied';
  created_at: string;
  storage_backend?: 'supabase' | 'server-db';
}

export interface PublicSlotAvailabilityResponse {
  location_id: string;
  date: string;
  timezone: 'Asia/Kolkata';
  businessHours: {
    open: string;
    close: string;
    label: string;
  };
  isDateBlocked: boolean;
  blockedReason: string | null;
  bookedSlots: string[];
  availableSlots: string[];
  blockedDates: BlockedDateRecord[];
}

export interface AdminDashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  rescheduledBookings: number;
  rejectedBookings: number;
  totalCourseEnquiries: number;
  totalContactMessages: number;
  blockedDatesCount: number;
  whatsappConfigured: boolean;
  storageBackend: 'supabase' | 'local-dev-fallback';
  timezone: 'Asia/Kolkata';
}

export const STUDIO_TIMEZONE = 'Asia/Kolkata' as const;
export const BUSINESS_HOURS_CONFIG = {
  openHour: 10,
  openMinute: 0,
  closeHour: 20,
  closeMinute: 0,
  lastSlotHour: 19,
  lastSlotMinute: 30,
  label: '10:00 AM – 8:00 PM IST (Monday – Sunday)',
} as const;

export function sanitizeInput(value: string | undefined | null): string {
  if (!value) return '';
  return String(value)
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim();
}

export function normalizePhoneDigits(phone: string): string {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length > 10 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
}

export function formatE164WhatsAppPhone(phone: string): string {
  const digits = normalizePhoneDigits(phone);
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return String(phone || '').replace(/\D/g, '');
}

export function isValidIndianOrGlobalPhone(phone: string): boolean {
  const cleaned = String(phone || '').replace(/[\s\-()]/g, '');
  return /^(\+91|91|0)?[6-9]\d{9,10}$/.test(cleaned);
}

export function isValidEmail(email: string): boolean {
  if (!email || !email.trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Returns the current date (YYYY-MM-DD) and minutes since midnight in Asia/Kolkata timezone.
 */
export function getKolkataDateTimeParts(referenceDate?: Date): {
  dateStr: string;
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
} {
  const now = referenceDate ? new Date(referenceDate) : new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: STUDIO_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const map: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== 'literal') {
      map[part.type] = part.value;
    }
  }

  const year = Number(map.year);
  const month = Number(map.month);
  const day = Number(map.day);
  const hours = Number(map.hour === '24' ? '0' : map.hour);
  const minutes = Number(map.minute);
  const dateStr = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return { dateStr, year, month, day, hours, minutes };
}

/**
 * Parses a slot label such as "10:00 AM" or "07:30 PM" into minutes from midnight.
 */
export function parseTimeSlotToMinutes(slotLabel: string): number | null {
  const match = String(slotLabel || '')
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return null;
  if (period === 'AM' && hours === 12) hours = 0;
  if (period === 'PM' && hours !== 12) hours += 12;

  return hours * 60 + minutes;
}

export function isSlotWithinBusinessHours(slotLabel: string): boolean {
  if (!TIME_SLOTS.includes(slotLabel)) return false;
  const mins = parseTimeSlotToMinutes(slotLabel);
  if (mins === null) return false;
  const openMins =
    BUSINESS_HOURS_CONFIG.openHour * 60 + BUSINESS_HOURS_CONFIG.openMinute;
  const lastSlotMins =
    BUSINESS_HOURS_CONFIG.lastSlotHour * 60 + BUSINESS_HOURS_CONFIG.lastSlotMinute;
  return mins >= openMins && mins <= lastSlotMins;
}

export function isDateNotInPast(dateStr: string, referenceDate?: Date): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [y, m, d] = dateStr.split('-').map(Number);
  const candidate = new Date(Date.UTC(y, m - 1, d));
  if (
    candidate.getUTCFullYear() !== y ||
    candidate.getUTCMonth() !== m - 1 ||
    candidate.getUTCDate() !== d
  ) {
    return false;
  }

  const kolkataNow = getKolkataDateTimeParts(referenceDate);
  return dateStr >= kolkataNow.dateStr;
}

export function isDateBlockedForLocation(
  dateStr: string,
  locationId: string,
  blockedDates: BlockedDateRecord[] = []
): { blocked: boolean; reason?: string } {
  const match = blockedDates.find(
    (b) =>
      b.blocked_date === dateStr &&
      (b.location_id === 'all' || b.location_id === locationId)
  );
  if (match) {
    return {
      blocked: true,
      reason: match.reason || 'Studio is closed on this date.',
    };
  }
  return { blocked: false };
}

export function isActiveBookingStatus(status: BookingStatus | string): boolean {
  return (
    status === 'Pending Confirmation' ||
    status === 'Confirmed' ||
    status === 'Rescheduled'
  );
}

export function getBookedSlotsForDateAndLocation(
  dateStr: string,
  locationId: string,
  existingBookings: BookingRecord[] = [],
  excludeBookingId?: string
): string[] {
  const taken = new Set<string>();
  for (const b of existingBookings) {
    if (excludeBookingId && (b.id === excludeBookingId || b.booking_id === excludeBookingId)) {
      continue;
    }
    if (
      b.location_id === locationId &&
      b.appointment_date === dateStr &&
      isActiveBookingStatus(b.status)
    ) {
      taken.add(b.appointment_time);
    }
  }
  return Array.from(taken);
}

export function validateBookingStep(
  step: number,
  input: BookingInput,
  referenceDate?: Date,
  blockedDates: BlockedDateRecord[] = []
): { valid: boolean; error?: string } {
  if (step === 1) {
    const exists = LOCATIONS.some((l) => l.id === input.location_id);
    if (!input.location_id || !exists) {
      return { valid: false, error: 'Please select a location.' };
    }
    return { valid: true };
  }

  if (step === 2) {
    const exists = SERVICES.some((s) => s.id === input.service_id);
    if (!input.service_id || !exists) {
      return { valid: false, error: 'Please select a service.' };
    }
    return { valid: true };
  }

  if (step === 3) {
    if (!input.appointment_date) {
      return { valid: false, error: 'Please select a valid appointment date.' };
    }
    if (!isDateNotInPast(input.appointment_date, referenceDate)) {
      return {
        valid: false,
        error: 'Appointment date cannot be in the past (Asia/Kolkata timezone).',
      };
    }
    const blockCheck = isDateBlockedForLocation(
      input.appointment_date,
      input.location_id,
      blockedDates
    );
    if (blockCheck.blocked) {
      return {
        valid: false,
        error: `Selected date is unavailable: ${blockCheck.reason}`,
      };
    }
    return { valid: true };
  }

  if (step === 4) {
    if (!input.appointment_time || !isSlotWithinBusinessHours(input.appointment_time)) {
      return {
        valid: false,
        error: 'Please select a valid appointment time within studio business hours (10:00 AM – 8:00 PM IST).',
      };
    }
    return { valid: true };
  }

  if (step === 5) {
    const name = sanitizeInput(input.customer_name);
    if (!name || name.length < 2) {
      return { valid: false, error: 'Please enter your full name.' };
    }
    if (!isValidIndianOrGlobalPhone(input.phone)) {
      return { valid: false, error: 'Please check your phone number.' };
    }
    if (
      input.whatsapp_number &&
      input.whatsapp_number.trim() &&
      !isValidIndianOrGlobalPhone(input.whatsapp_number)
    ) {
      return { valid: false, error: 'Please check your WhatsApp number.' };
    }
    if (input.email && input.email.trim() && !isValidEmail(input.email)) {
      return { valid: false, error: 'Please enter a valid email address.' };
    }
    return { valid: true };
  }

  return { valid: true };
}

export function validateFullBooking(
  input: BookingInput,
  existingBookings: BookingRecord[] = [],
  referenceDate?: Date,
  blockedDates: BlockedDateRecord[] = []
): { valid: boolean; error?: string; code?: 'DUPLICATE' | 'SLOT_UNAVAILABLE' | 'VALIDATION' } {
  for (let step = 1; step <= 5; step++) {
    const res = validateBookingStep(step, input, referenceDate, blockedDates);
    if (!res.valid) return { ...res, code: 'VALIDATION' };
  }

  const normalizedPhone = normalizePhoneDigits(input.phone);

  // 1. Check exact duplicate submission from same customer
  const isDuplicate = existingBookings.some((b) => {
    const existingPhone = normalizePhoneDigits(b.phone);
    return (
      isActiveBookingStatus(b.status) &&
      existingPhone === normalizedPhone &&
      b.service_id === input.service_id &&
      b.appointment_date === input.appointment_date &&
      b.appointment_time === input.appointment_time &&
      b.location_id === input.location_id
    );
  });

  if (isDuplicate) {
    return {
      valid: false,
      code: 'DUPLICATE',
      error:
        'An identical appointment request for this service, date, time, and location has already been submitted.',
    };
  }

  // 2. Check slot protection (prevent two customers from booking the same unavailable slot at the same location, date & time)
  const isSlotTaken = existingBookings.some((b) => {
    return (
      isActiveBookingStatus(b.status) &&
      b.location_id === input.location_id &&
      b.appointment_date === input.appointment_date &&
      b.appointment_time === input.appointment_time
    );
  });

  if (isSlotTaken) {
    return {
      valid: false,
      code: 'SLOT_UNAVAILABLE',
      error:
        'This appointment time slot is already booked at the selected studio branch. Please select another time slot.',
    };
  }

  return { valid: true };
}

export function generateBookingId(
  seedDate: Date = new Date(),
  randomSuffix?: string,
  existingBookingIds: string[] = []
): string {
  const kolkata = getKolkataDateTimeParts(seedDate);
  const yyyy = String(kolkata.year);
  const mm = String(kolkata.month).padStart(2, '0');
  const dd = String(kolkata.day).padStart(2, '0');
  const existingSet = new Set(existingBookingIds);

  if (randomSuffix) {
    return `SBS-${yyyy}${mm}${dd}-${randomSuffix}`;
  }

  for (let attempt = 0; attempt < 25; attempt++) {
    const suffix = Math.floor(1000 + Math.random() * 9000)
      .toString()
      .slice(0, 4);
    const candidate = `SBS-${yyyy}${mm}${dd}-${suffix}`;
    if (!existingSet.has(candidate)) {
      return candidate;
    }
  }

  const fallback = `${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;
  return `SBS-${yyyy}${mm}${dd}-${fallback}`;
}

export function formatWhatsAppBookingMessage(booking: {
  customer_name: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  location_name: string;
  booking_id: string;
}): string {
  return [
    'Hello Sonu Foundation and Charitable Trust,',
    'I have submitted an appointment request on your website.',
    `Booking ID: ${booking.booking_id}`,
    `Name: ${booking.customer_name}`,
    `Service: ${booking.service_name}`,
    `Date: ${booking.appointment_date}`,
    `Time: ${booking.appointment_time}`,
    `Location: ${booking.location_name}`,
    'Status: Pending Confirmation (awaiting team confirmation)',
    'Please confirm my appointment slot. Thank you.',
  ].join('\n');
}

export function formatAdminConfirmedWhatsAppMessage(booking: {
  customer_name: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  location_name: string;
  booking_id: string;
  status: BookingStatus;
}): string {
  return [
    `Hello ${booking.customer_name},`,
    `Greetings from Sonu Foundation and Charitable Trust!`,
    `Your appointment status is now: *${booking.status}*.`,
    `Booking ID: ${booking.booking_id}`,
    `Service: ${booking.service_name}`,
    `Date: ${booking.appointment_date}`,
    `Time: ${booking.appointment_time} IST`,
    `Branch: ${booking.location_name}`,
    `For any assistance, call or WhatsApp us at ${BUSINESS_INFO.phoneDisplay}.`,
  ].join('\n');
}

export function buildWhatsAppBookingUrl(booking: {
  customer_name: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  location_name: string;
  booking_id: string;
}): string {
  const text = formatWhatsAppBookingMessage(booking);
  return `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function buildWhatsAppGeneralUrl(customMessage: string): string {
  return `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(customMessage)}`;
}

export function validateCourseEnquiry(
  input: CourseEnquiryInput,
  existingEnquiries: CourseEnquiryRecord[] = []
): { valid: boolean; error?: string } {
  const name = sanitizeInput(input.name);
  if (!name || name.length < 2) {
    return { valid: false, error: 'Please enter the student name.' };
  }
  if (!isValidIndianOrGlobalPhone(input.phone)) {
    return { valid: false, error: 'Please check your phone number.' };
  }
  if (input.whatsapp && input.whatsapp.trim() && !isValidIndianOrGlobalPhone(input.whatsapp)) {
    return { valid: false, error: 'Please check your WhatsApp number.' };
  }
  if (input.email && input.email.trim() && !isValidEmail(input.email)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }
  const course = sanitizeInput(input.course);
  const validCourseNames = COURSES.map((c) => c.name);
  if (!course || !validCourseNames.includes(course)) {
    return { valid: false, error: 'Please select a valid academy course.' };
  }
  const loc = sanitizeInput(input.preferred_location);
  if (!loc) {
    return { valid: false, error: 'Please select a preferred location.' };
  }

  const normalizedPhone = normalizePhoneDigits(input.phone);
  const isDuplicate = existingEnquiries.some((e) => {
    return (
      normalizePhoneDigits(e.phone) === normalizedPhone &&
      e.course === course &&
      e.preferred_location === loc &&
      sanitizeInput(e.message) === sanitizeInput(input.message)
    );
  });

  if (isDuplicate) {
    return {
      valid: false,
      error: 'An identical enquiry for this course has already been submitted.',
    };
  }

  return { valid: true };
}

export function validateContactMessage(
  input: ContactMessageInput,
  existingMessages: ContactMessageRecord[] = []
): { valid: boolean; error?: string } {
  const name = sanitizeInput(input.name);
  if (!name || name.length < 2) {
    return { valid: false, error: 'Please enter your full name.' };
  }
  if (!isValidIndianOrGlobalPhone(input.phone)) {
    return { valid: false, error: 'Please check your phone number.' };
  }
  if (input.email && input.email.trim() && !isValidEmail(input.email)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }
  const message = sanitizeInput(input.message);
  if (!message || message.length < 3) {
    return { valid: false, error: 'Please enter your message.' };
  }

  const normalizedPhone = normalizePhoneDigits(input.phone);
  const isDuplicate = existingMessages.some((m) => {
    return (
      normalizePhoneDigits(m.phone) === normalizedPhone &&
      sanitizeInput(m.message) === message
    );
  });

  if (isDuplicate) {
    return {
      valid: false,
      error: 'This exact message has already been submitted.',
    };
  }

  return { valid: true };
}

/* ==================== PUBLIC & ADMIN API CLIENT FUNCTIONS ==================== */

export async function fetchSlotAvailabilityFromServer(
  locationId: string,
  dateStr: string
): Promise<PublicSlotAvailabilityResponse> {
  const params = new URLSearchParams({
    location_id: locationId,
    date: dateStr,
  });
  const response = await fetch(`/api/slots?${params.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to load slot availability.');
  }
  return (await response.json()) as PublicSlotAvailabilityResponse;
}

export async function submitBookingToServer(input: BookingInput): Promise<BookingRecord> {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(input),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    booking?: BookingRecord;
    error?: string;
  };

  if (!response.ok || !payload.booking) {
    throw new Error(
      payload.error || 'Could not save your booking to the database. Please try again.'
    );
  }

  return payload.booking;
}

export async function submitCourseEnquiryToServer(
  input: CourseEnquiryInput
): Promise<CourseEnquiryRecord> {
  const response = await fetch('/api/course-enquiries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(input),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    enquiry?: CourseEnquiryRecord;
    error?: string;
  };

  if (!response.ok || !payload.enquiry) {
    throw new Error(
      payload.error || 'Could not save your course enquiry. Please try again.'
    );
  }

  return payload.enquiry;
}

export async function submitContactMessageToServer(
  input: ContactMessageInput
): Promise<ContactMessageRecord> {
  const response = await fetch('/api/contact-messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(input),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    contactMessage?: ContactMessageRecord;
    error?: string;
  };

  if (!response.ok || !payload.contactMessage) {
    throw new Error(
      payload.error || 'Could not submit your message. Please try again.'
    );
  }

  return payload.contactMessage;
}
