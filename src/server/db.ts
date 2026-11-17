import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { LOCATIONS, SERVICES, TIME_SLOTS } from '../data/siteData.ts';
import {
  type AdminDashboardStats,
  type BlockedDateRecord,
  type BookingInput,
  type BookingRecord,
  type BookingStatus,
  type BookingStatusHistoryEntry,
  BUSINESS_HOURS_CONFIG,
  type ContactMessageInput,
  type ContactMessageRecord,
  type CourseEnquiryInput,
  type CourseEnquiryRecord,
  type PublicSlotAvailabilityResponse,
  STUDIO_TIMEZONE,
  generateBookingId,
  getBookedSlotsForDateAndLocation,
  isActiveBookingStatus,
  isDateBlockedForLocation,
  isDateNotInPast,
  isSlotWithinBusinessHours,
  sanitizeInput,
  validateContactMessage,
  validateCourseEnquiry,
  validateFullBooking,
} from '../utils/bookingLogic.ts';
import {
  type AdminUserPayload,
  getDefaultAdminCredentials,
  hashPassword,
  verifyPassword,
} from './auth.ts';
import {
  getWhatsAppCloudConfig,
  sendWhatsAppCloudConfirmation,
} from './whatsapp.ts';

export interface StoredAdminUser {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: 'admin' | 'super_admin';
  created_at: string;
  last_login_at?: string;
}

export interface StudioDatabaseShape {
  bookings: BookingRecord[];
  booking_status_history: BookingStatusHistoryEntry[];
  blocked_dates: BlockedDateRecord[];
  course_enquiries: CourseEnquiryRecord[];
  contact_messages: ContactMessageRecord[];
  admin_users: StoredAdminUser[];
}

const DEFAULT_DB_PATH = path.resolve(process.cwd(), 'data', 'studio-db.json');

/**
 * In-process async mutex queue to serialize read-validate-write operations
 * and prevent concurrent slot double-booking race conditions.
 */
let dbMutexChain: Promise<unknown> = Promise.resolve();

async function withDatabaseLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = dbMutexChain.then(fn, fn);
  dbMutexChain = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

export function isSupabaseConfigured(): {
  configured: boolean;
  url: string;
  serviceRoleKey: string;
} {
  // Never read VITE_ variables for service role keys so credentials stay strictly server-side
  const url = (process.env.SUPABASE_URL || '').trim();
  const serviceRoleKey = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''
  ).trim();

  const validUrl =
    url.startsWith('https://') &&
    !url.includes('MY_SUPABASE') &&
    !url.includes('your-project');
  const validKey =
    serviceRoleKey.length > 20 &&
    !serviceRoleKey.includes('MY_SUPABASE') &&
    !serviceRoleKey.includes('your-anon-key');

  return {
    configured: Boolean(validUrl && validKey),
    url: url.replace(/\/+$/, ''),
    serviceRoleKey,
  };
}

function assertStorageAvailable(): void {
  const supa = isSupabaseConfigured();
  if (
    !supa.configured &&
    process.env.NODE_ENV === 'production' &&
    process.env.REQUIRE_SUPABASE_IN_PRODUCTION === 'true'
  ) {
    throw new Error(
      'Production database not configured: Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment variables.'
    );
  }
}

function ensureDefaultAdminInList(admins: StoredAdminUser[]): StoredAdminUser[] {
  const defaults = getDefaultAdminCredentials();
  const existingIdx = admins.findIndex(
    (a) => a.email.toLowerCase() === defaults.email.toLowerCase()
  );
  if (existingIdx === -1) {
    return [
      {
        id: 'admin-default-1',
        email: defaults.email.toLowerCase(),
        name: defaults.name,
        password_hash: hashPassword(defaults.passwordPlain),
        role: 'super_admin',
        created_at: new Date().toISOString(),
      },
      ...admins,
    ];
  }
  return admins;
}

async function readLocalDb(dbFilePath = DEFAULT_DB_PATH): Promise<StudioDatabaseShape> {
  assertStorageAvailable();
  try {
    const raw = await fs.readFile(dbFilePath, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<StudioDatabaseShape>;
    return {
      bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [],
      booking_status_history: Array.isArray(parsed.booking_status_history)
        ? parsed.booking_status_history
        : [],
      blocked_dates: Array.isArray(parsed.blocked_dates) ? parsed.blocked_dates : [],
      course_enquiries: Array.isArray(parsed.course_enquiries)
        ? parsed.course_enquiries
        : [],
      contact_messages: Array.isArray(parsed.contact_messages)
        ? parsed.contact_messages
        : [],
      admin_users: ensureDefaultAdminInList(
        Array.isArray(parsed.admin_users) ? parsed.admin_users : []
      ),
    };
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException)?.code === 'ENOENT') {
      return {
        bookings: [],
        booking_status_history: [],
        blocked_dates: [],
        course_enquiries: [],
        contact_messages: [],
        admin_users: ensureDefaultAdminInList([]),
      };
    }
    throw new Error('Failed to read persistent database storage.');
  }
}

async function writeLocalDb(
  data: StudioDatabaseShape,
  dbFilePath = DEFAULT_DB_PATH
): Promise<void> {
  assertStorageAvailable();
  const dir = path.dirname(dbFilePath);
  await fs.mkdir(dir, { recursive: true });
  const tempFile = `${dbFilePath}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tempFile, dbFilePath);
}

async function supabaseRequest<T>(
  tableAndQuery: string,
  init: RequestInit
): Promise<T | null> {
  const supa = isSupabaseConfigured();
  if (!supa.configured) return null;

  const response = await fetch(`${supa.url}/rest/v1/${tableAndQuery}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      apikey: supa.serviceRoleKey,
      Authorization: `Bearer ${supa.serviceRoleKey}`,
      Prefer: 'return=representation',
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => 'Supabase operation failed');
    // Check if PostgreSQL unique index violation (23505) occurred for slot protection
    if (response.status === 409 || errText.includes('23505') || errText.includes('idx_bookings_active_slot_unique')) {
      throw new Error('SLOT_CONFLICT: This appointment time slot is already booked at the selected studio branch.');
    }
    throw new Error(`Supabase database error (${response.status}): ${errText}`);
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : null;
}

/* ==================== ADMIN AUTHENTICATION ==================== */

export async function authenticateAdminUser(
  emailRaw: string,
  passwordRaw: string,
  options?: { dbFilePath?: string }
): Promise<{ valid: boolean; user?: AdminUserPayload; error?: string }> {
  const email = sanitizeInput(emailRaw).toLowerCase();
  const password = String(passwordRaw || '');

  if (!email || !password) {
    return { valid: false, error: 'Email and password are required.' };
  }

  const dbFilePath = options?.dbFilePath || DEFAULT_DB_PATH;
  const db = await readLocalDb(dbFilePath);

  // Check environment-configured admin credentials first
  const envDefaults = getDefaultAdminCredentials();
  if (
    email === envDefaults.email.toLowerCase() &&
    password === envDefaults.passwordPlain
  ) {
    return {
      valid: true,
      user: {
        id: 'admin-primary',
        email: envDefaults.email.toLowerCase(),
        name: envDefaults.name,
        role: 'super_admin',
      },
    };
  }

  // Also check stored admin_users table
  const matched = db.admin_users.find((u) => u.email.toLowerCase() === email);
  if (matched && verifyPassword(password, matched.password_hash)) {
    return {
      valid: true,
      user: {
        id: matched.id,
        email: matched.email,
        name: matched.name,
        role: matched.role,
      },
    };
  }

  return { valid: false, error: 'Invalid administrator email or password.' };
}

/* ==================== PUBLIC SLOT AVAILABILITY (NO PII) ==================== */

export async function getPublicSlotAvailability(
  locationIdRaw: string,
  dateRaw: string,
  options?: { dbFilePath?: string }
): Promise<PublicSlotAvailabilityResponse> {
  const dbFilePath = options?.dbFilePath || DEFAULT_DB_PATH;
  const db = await readLocalDb(dbFilePath);

  const locationId = sanitizeInput(locationIdRaw) || 'location-1';
  const dateStr = sanitizeInput(dateRaw);

  const blockInfo = dateStr
    ? isDateBlockedForLocation(dateStr, locationId, db.blocked_dates)
    : { blocked: false };

  const bookedSlots = dateStr
    ? getBookedSlotsForDateAndLocation(dateStr, locationId, db.bookings)
    : [];

  const availableSlots = blockInfo.blocked
    ? []
    : TIME_SLOTS.filter((slot) => !bookedSlots.includes(slot));

  const relevantBlockedDates = db.blocked_dates.filter(
    (b) => b.location_id === 'all' || b.location_id === locationId
  );

  return {
    location_id: locationId,
    date: dateStr,
    timezone: STUDIO_TIMEZONE,
    businessHours: {
      open: '10:00',
      close: '20:00',
      label: BUSINESS_HOURS_CONFIG.label,
    },
    isDateBlocked: blockInfo.blocked,
    blockedReason: blockInfo.reason || null,
    bookedSlots,
    availableSlots,
    blockedDates: relevantBlockedDates,
  };
}

/* ==================== CUSTOMER BOOKING CREATION (WITH SLOT LOCKING) ==================== */

export async function createBookingRecord(
  rawInput: BookingInput,
  options?: { dbFilePath?: string; referenceDate?: Date }
): Promise<{ status: number; booking?: BookingRecord; error?: string }> {
  return withDatabaseLock(async () => {
    const dbFilePath = options?.dbFilePath || DEFAULT_DB_PATH;
    const db = await readLocalDb(dbFilePath);

    const input: BookingInput = {
      location_id: sanitizeInput(rawInput?.location_id),
      service_id: sanitizeInput(rawInput?.service_id),
      appointment_date: sanitizeInput(rawInput?.appointment_date),
      appointment_time: sanitizeInput(rawInput?.appointment_time),
      customer_name: sanitizeInput(rawInput?.customer_name),
      phone: sanitizeInput(rawInput?.phone),
      whatsapp_number: sanitizeInput(rawInput?.whatsapp_number || rawInput?.phone),
      email: sanitizeInput(rawInput?.email),
      message: sanitizeInput(rawInput?.message),
    };

    const validation = validateFullBooking(
      input,
      db.bookings,
      options?.referenceDate,
      db.blocked_dates
    );

    if (!validation.valid) {
      const isConflict =
        validation.code === 'DUPLICATE' || validation.code === 'SLOT_UNAVAILABLE';
      return {
        status: isConflict ? 409 : 400,
        error: validation.error || 'Invalid booking details.',
      };
    }

    const location = LOCATIONS.find((l) => l.id === input.location_id);
    const service = SERVICES.find((s) => s.id === input.service_id);
    if (!location || !service) {
      return {
        status: 400,
        error: 'Selected location or service is invalid.',
      };
    }

    const existingIds = db.bookings.map((b) => b.booking_id);
    const now = options?.referenceDate || new Date();
    const bookingId = generateBookingId(now, undefined, existingIds);
    const supa = isSupabaseConfigured();
    const nowIso = new Date().toISOString();

    const record: BookingRecord = {
      id: `bk-${crypto.randomUUID()}`,
      booking_id: bookingId,
      location_id: location.id,
      location_name: location.name,
      service_id: service.id,
      service_name: service.name,
      appointment_date: input.appointment_date,
      appointment_time: input.appointment_time,
      customer_name: input.customer_name,
      phone: input.phone,
      whatsapp_number: input.whatsapp_number,
      email: input.email,
      message: input.message,
      status: 'Pending Confirmation',
      created_at: nowIso,
      updated_at: nowIso,
      storage_backend: supa.configured ? 'supabase' : 'server-db',
      whatsapp_message_id: null,
      whatsapp_status: 'Not Sent',
      whatsapp_timestamp: null,
      whatsapp_error: null,
      admin_notes: '',
    };

    const historyEntry: BookingStatusHistoryEntry = {
      id: `hist-${crypto.randomUUID()}`,
      booking_id: record.booking_id,
      previous_status: null,
      new_status: 'Pending Confirmation',
      changed_by: 'Customer Online Request',
      notes: `Appointment requested for ${service.name} at ${location.name} (${input.appointment_date} ${input.appointment_time} IST).`,
      whatsapp_status: 'Not Sent',
      created_at: nowIso,
    };

    if (supa.configured) {
      try {
        await supabaseRequest('bookings', {
          method: 'POST',
          body: JSON.stringify(record),
        });
        await supabaseRequest('booking_status_history', {
          method: 'POST',
          body: JSON.stringify(historyEntry),
        });
      } catch (err: unknown) {
        if (err instanceof Error && err.message.startsWith('SLOT_CONFLICT:')) {
          return {
            status: 409,
            error: err.message.replace('SLOT_CONFLICT: ', ''),
          };
        }
        throw err;
      }
    }

    db.bookings.unshift(record);
    db.booking_status_history.unshift(historyEntry);
    await writeLocalDb(db, dbFilePath);

    return {
      status: 201,
      booking: record,
    };
  });
}

/* ==================== ADMIN BOOKING ACTIONS & WHATSAPP CLOUD API ==================== */

export async function confirmBookingByAdmin(
  bookingIdentifier: string,
  adminEmail: string,
  adminNotes = '',
  options?: {
    dbFilePath?: string;
    customFetch?: typeof fetch;
  }
): Promise<{
  status: number;
  booking?: BookingRecord;
  historyEntry?: BookingStatusHistoryEntry;
  error?: string;
}> {
  return withDatabaseLock(async () => {
    const dbFilePath = options?.dbFilePath || DEFAULT_DB_PATH;
    const db = await readLocalDb(dbFilePath);

    const idx = db.bookings.findIndex(
      (b) => b.id === bookingIdentifier || b.booking_id === bookingIdentifier
    );
    if (idx === -1) {
      return { status: 404, error: 'Booking not found.' };
    }

    const current = db.bookings[idx];

    // Ensure no other active booking occupies this slot (if confirming a previously rejected booking)
    const slotConflict = db.bookings.some(
      (b) =>
        b.id !== current.id &&
        isActiveBookingStatus(b.status) &&
        b.location_id === current.location_id &&
        b.appointment_date === current.appointment_date &&
        b.appointment_time === current.appointment_time
    );

    if (slotConflict) {
      return {
        status: 409,
        error:
          'Cannot confirm: Another active appointment already occupies this location, date, and time slot.',
      };
    }

    const previousStatus: BookingStatus = current.status;
    const nowIso = new Date().toISOString();

    const updatedBooking: BookingRecord = {
      ...current,
      status: 'Confirmed',
      updated_at: nowIso,
      admin_notes: sanitizeInput(adminNotes) || current.admin_notes || '',
    };

    // Trigger server-side WhatsApp Business Cloud API confirmation
    const waResult = await sendWhatsAppCloudConfirmation(
      updatedBooking,
      options?.customFetch
    );

    updatedBooking.whatsapp_status = waResult.status;
    updatedBooking.whatsapp_message_id = waResult.messageId;
    updatedBooking.whatsapp_timestamp = waResult.timestamp;
    updatedBooking.whatsapp_error = waResult.error;

    const historyEntry: BookingStatusHistoryEntry = {
      id: `hist-${crypto.randomUUID()}`,
      booking_id: updatedBooking.booking_id,
      previous_status: previousStatus,
      new_status: 'Confirmed',
      changed_by: adminEmail,
      notes:
        sanitizeInput(adminNotes) ||
        `Booking confirmed by admin. WhatsApp Cloud API status: ${waResult.status}${
          waResult.messageId ? ` (ID: ${waResult.messageId})` : ''
        }${waResult.error ? ` — ${waResult.error}` : ''}`,
      whatsapp_status: waResult.status,
      created_at: nowIso,
    };

    const supa = isSupabaseConfigured();
    if (supa.configured) {
      await supabaseRequest(
        `bookings?booking_id=eq.${encodeURIComponent(updatedBooking.booking_id)}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            status: updatedBooking.status,
            updated_at: updatedBooking.updated_at,
            admin_notes: updatedBooking.admin_notes,
            whatsapp_status: updatedBooking.whatsapp_status,
            whatsapp_message_id: updatedBooking.whatsapp_message_id,
            whatsapp_timestamp: updatedBooking.whatsapp_timestamp,
            whatsapp_error: updatedBooking.whatsapp_error,
          }),
        }
      );
      await supabaseRequest('booking_status_history', {
        method: 'POST',
        body: JSON.stringify(historyEntry),
      });
    }

    db.bookings[idx] = updatedBooking;
    db.booking_status_history.unshift(historyEntry);
    await writeLocalDb(db, dbFilePath);

    return {
      status: 200,
      booking: updatedBooking,
      historyEntry,
    };
  });
}

export async function retryBookingWhatsAppConfirmation(
  bookingIdentifier: string,
  adminEmail: string,
  options?: {
    dbFilePath?: string;
    customFetch?: typeof fetch;
  }
): Promise<{
  status: number;
  booking?: BookingRecord;
  historyEntry?: BookingStatusHistoryEntry;
  error?: string;
}> {
  return withDatabaseLock(async () => {
    const dbFilePath = options?.dbFilePath || DEFAULT_DB_PATH;
    const db = await readLocalDb(dbFilePath);

    const idx = db.bookings.findIndex(
      (b) => b.id === bookingIdentifier || b.booking_id === bookingIdentifier
    );
    if (idx === -1) {
      return { status: 404, error: 'Booking not found.' };
    }

    const current = db.bookings[idx];
    if (current.status !== 'Confirmed' && current.status !== 'Rescheduled') {
      return {
        status: 400,
        error: 'WhatsApp confirmation can only be retried for Confirmed or Rescheduled bookings.',
      };
    }

    const waResult = await sendWhatsAppCloudConfirmation(
      current,
      options?.customFetch
    );
    const nowIso = new Date().toISOString();

    const updatedBooking: BookingRecord = {
      ...current,
      updated_at: nowIso,
      whatsapp_status: waResult.status,
      whatsapp_message_id: waResult.messageId,
      whatsapp_timestamp: waResult.timestamp,
      whatsapp_error: waResult.error,
    };

    const historyEntry: BookingStatusHistoryEntry = {
      id: `hist-${crypto.randomUUID()}`,
      booking_id: updatedBooking.booking_id,
      previous_status: current.status,
      new_status: current.status,
      changed_by: adminEmail,
      notes: `WhatsApp confirmation retry triggered by admin. Result: ${waResult.status}${
        waResult.messageId ? ` (ID: ${waResult.messageId})` : ''
      }${waResult.error ? ` — ${waResult.error}` : ''}`,
      whatsapp_status: waResult.status,
      created_at: nowIso,
    };

    const supa = isSupabaseConfigured();
    if (supa.configured) {
      await supabaseRequest(
        `bookings?booking_id=eq.${encodeURIComponent(updatedBooking.booking_id)}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            updated_at: updatedBooking.updated_at,
            whatsapp_status: updatedBooking.whatsapp_status,
            whatsapp_message_id: updatedBooking.whatsapp_message_id,
            whatsapp_timestamp: updatedBooking.whatsapp_timestamp,
            whatsapp_error: updatedBooking.whatsapp_error,
          }),
        }
      );
      await supabaseRequest('booking_status_history', {
        method: 'POST',
        body: JSON.stringify(historyEntry),
      });
    }

    db.bookings[idx] = updatedBooking;
    db.booking_status_history.unshift(historyEntry);
    await writeLocalDb(db, dbFilePath);

    return {
      status: 200,
      booking: updatedBooking,
      historyEntry,
    };
  });
}

export async function rejectBookingByAdmin(
  bookingIdentifier: string,
  adminEmail: string,
  reasonRaw: string,
  options?: { dbFilePath?: string }
): Promise<{
  status: number;
  booking?: BookingRecord;
  historyEntry?: BookingStatusHistoryEntry;
  error?: string;
}> {
  return withDatabaseLock(async () => {
    const dbFilePath = options?.dbFilePath || DEFAULT_DB_PATH;
    const db = await readLocalDb(dbFilePath);

    const idx = db.bookings.findIndex(
      (b) => b.id === bookingIdentifier || b.booking_id === bookingIdentifier
    );
    if (idx === -1) {
      return { status: 404, error: 'Booking not found.' };
    }

    const current = db.bookings[idx];
    const reason = sanitizeInput(reasonRaw) || 'Slot unavailable / rejected by studio administrator.';
    const nowIso = new Date().toISOString();

    const updatedBooking: BookingRecord = {
      ...current,
      status: 'Rejected',
      updated_at: nowIso,
      admin_notes: reason,
    };

    const historyEntry: BookingStatusHistoryEntry = {
      id: `hist-${crypto.randomUUID()}`,
      booking_id: updatedBooking.booking_id,
      previous_status: current.status,
      new_status: 'Rejected',
      changed_by: adminEmail,
      notes: `Appointment rejected: ${reason}`,
      whatsapp_status: updatedBooking.whatsapp_status || 'Not Sent',
      created_at: nowIso,
    };

    const supa = isSupabaseConfigured();
    if (supa.configured) {
      await supabaseRequest(
        `bookings?booking_id=eq.${encodeURIComponent(updatedBooking.booking_id)}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            status: updatedBooking.status,
            updated_at: updatedBooking.updated_at,
            admin_notes: updatedBooking.admin_notes,
          }),
        }
      );
      await supabaseRequest('booking_status_history', {
        method: 'POST',
        body: JSON.stringify(historyEntry),
      });
    }

    db.bookings[idx] = updatedBooking;
    db.booking_status_history.unshift(historyEntry);
    await writeLocalDb(db, dbFilePath);

    return {
      status: 200,
      booking: updatedBooking,
      historyEntry,
    };
  });
}

export async function rescheduleBookingByAdmin(
  bookingIdentifier: string,
  payload: {
    appointment_date: string;
    appointment_time: string;
    location_id?: string;
    notes?: string;
  },
  adminEmail: string,
  options?: {
    dbFilePath?: string;
    referenceDate?: Date;
    customFetch?: typeof fetch;
  }
): Promise<{
  status: number;
  booking?: BookingRecord;
  historyEntry?: BookingStatusHistoryEntry;
  error?: string;
}> {
  return withDatabaseLock(async () => {
    const dbFilePath = options?.dbFilePath || DEFAULT_DB_PATH;
    const db = await readLocalDb(dbFilePath);

    const idx = db.bookings.findIndex(
      (b) => b.id === bookingIdentifier || b.booking_id === bookingIdentifier
    );
    if (idx === -1) {
      return { status: 404, error: 'Booking not found.' };
    }

    const current = db.bookings[idx];
    const newDate = sanitizeInput(payload.appointment_date);
    const newTime = sanitizeInput(payload.appointment_time);
    const newLocId = sanitizeInput(payload.location_id) || current.location_id;

    const location = LOCATIONS.find((l) => l.id === newLocId);
    if (!location) {
      return { status: 400, error: 'Invalid studio location selected.' };
    }

    if (!newDate || !isDateNotInPast(newDate, options?.referenceDate)) {
      return {
        status: 400,
        error: 'Rescheduled date cannot be in the past (Asia/Kolkata timezone).',
      };
    }

    const blockCheck = isDateBlockedForLocation(newDate, newLocId, db.blocked_dates);
    if (blockCheck.blocked) {
      return {
        status: 400,
        error: `Cannot reschedule to blocked date: ${blockCheck.reason}`,
      };
    }

    if (!newTime || !isSlotWithinBusinessHours(newTime)) {
      return {
        status: 400,
        error: 'Rescheduled time must be within studio business hours (10:00 AM – 8:00 PM IST).',
      };
    }

    // Check slot conflict excluding current booking
    const takenSlots = getBookedSlotsForDateAndLocation(
      newDate,
      newLocId,
      db.bookings,
      current.id
    );
    if (takenSlots.includes(newTime)) {
      return {
        status: 409,
        error:
          'The target date and time slot is already booked at this studio location. Please choose another slot.',
      };
    }

    const nowIso = new Date().toISOString();
    const notesClean = sanitizeInput(payload.notes);

    const updatedBooking: BookingRecord = {
      ...current,
      location_id: location.id,
      location_name: location.name,
      appointment_date: newDate,
      appointment_time: newTime,
      status: 'Rescheduled',
      updated_at: nowIso,
      admin_notes: notesClean || current.admin_notes || '',
    };

    const waResult = await sendWhatsAppCloudConfirmation(
      updatedBooking,
      options?.customFetch
    );
    updatedBooking.whatsapp_status = waResult.status;
    updatedBooking.whatsapp_message_id = waResult.messageId;
    updatedBooking.whatsapp_timestamp = waResult.timestamp;
    updatedBooking.whatsapp_error = waResult.error;

    const historyEntry: BookingStatusHistoryEntry = {
      id: `hist-${crypto.randomUUID()}`,
      booking_id: updatedBooking.booking_id,
      previous_status: current.status,
      new_status: 'Rescheduled',
      changed_by: adminEmail,
      notes: `Rescheduled from ${current.appointment_date} (${current.appointment_time}) to ${newDate} (${newTime}) at ${location.name}.${
        notesClean ? ` Note: ${notesClean}` : ''
      } WhatsApp: ${waResult.status}`,
      whatsapp_status: waResult.status,
      created_at: nowIso,
    };

    const supa = isSupabaseConfigured();
    if (supa.configured) {
      await supabaseRequest(
        `bookings?booking_id=eq.${encodeURIComponent(updatedBooking.booking_id)}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            location_id: updatedBooking.location_id,
            location_name: updatedBooking.location_name,
            appointment_date: updatedBooking.appointment_date,
            appointment_time: updatedBooking.appointment_time,
            status: updatedBooking.status,
            updated_at: updatedBooking.updated_at,
            admin_notes: updatedBooking.admin_notes,
            whatsapp_status: updatedBooking.whatsapp_status,
            whatsapp_message_id: updatedBooking.whatsapp_message_id,
            whatsapp_timestamp: updatedBooking.whatsapp_timestamp,
            whatsapp_error: updatedBooking.whatsapp_error,
          }),
        }
      );
      await supabaseRequest('booking_status_history', {
        method: 'POST',
        body: JSON.stringify(historyEntry),
      });
    }

    db.bookings[idx] = updatedBooking;
    db.booking_status_history.unshift(historyEntry);
    await writeLocalDb(db, dbFilePath);

    return {
      status: 200,
      booking: updatedBooking,
      historyEntry,
    };
  });
}

/* ==================== BLOCKED DATES MANAGEMENT ==================== */

export async function addBlockedDateByAdmin(
  input: {
    location_id: string;
    blocked_date: string;
    reason: string;
  },
  adminEmail: string,
  options?: { dbFilePath?: string }
): Promise<{ status: number; blockedDate?: BlockedDateRecord; error?: string }> {
  return withDatabaseLock(async () => {
    const dbFilePath = options?.dbFilePath || DEFAULT_DB_PATH;
    const db = await readLocalDb(dbFilePath);

    const locId = sanitizeInput(input.location_id) as
      | 'all'
      | 'location-1'
      | 'location-2';
    const dateStr = sanitizeInput(input.blocked_date);
    const reason = sanitizeInput(input.reason) || 'Studio Holiday / Closed';

    if (!['all', 'location-1', 'location-2'].includes(locId)) {
      return { status: 400, error: 'Invalid location selection.' };
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return { status: 400, error: 'Please select a valid date (YYYY-MM-DD).' };
    }

    const exists = db.blocked_dates.some(
      (b) => b.blocked_date === dateStr && b.location_id === locId
    );
    if (exists) {
      return { status: 409, error: 'This date is already blocked for the selected branch.' };
    }

    const record: BlockedDateRecord = {
      id: `blk-${crypto.randomUUID()}`,
      location_id: locId,
      blocked_date: dateStr,
      reason,
      created_by: adminEmail,
      created_at: new Date().toISOString(),
    };

    const supa = isSupabaseConfigured();
    if (supa.configured) {
      await supabaseRequest('blocked_dates', {
        method: 'POST',
        body: JSON.stringify(record),
      });
    }

    db.blocked_dates.unshift(record);
    await writeLocalDb(db, dbFilePath);

    return { status: 201, blockedDate: record };
  });
}

export async function removeBlockedDateByAdmin(
  blockedDateId: string,
  options?: { dbFilePath?: string }
): Promise<{ status: number; error?: string }> {
  return withDatabaseLock(async () => {
    const dbFilePath = options?.dbFilePath || DEFAULT_DB_PATH;
    const db = await readLocalDb(dbFilePath);

    const idx = db.blocked_dates.findIndex((b) => b.id === blockedDateId);
    if (idx === -1) {
      return { status: 404, error: 'Blocked date record not found.' };
    }

    const supa = isSupabaseConfigured();
    if (supa.configured) {
      await supabaseRequest(`blocked_dates?id=eq.${encodeURIComponent(blockedDateId)}`, {
        method: 'DELETE',
      });
    }

    db.blocked_dates.splice(idx, 1);
    await writeLocalDb(db, dbFilePath);
    return { status: 200 };
  });
}

/* ==================== COURSE ENQUIRIES & CONTACT MESSAGES ==================== */

export async function createCourseEnquiryRecord(
  rawInput: CourseEnquiryInput,
  options?: { dbFilePath?: string }
): Promise<{ status: number; enquiry?: CourseEnquiryRecord; error?: string }> {
  return withDatabaseLock(async () => {
    const dbFilePath = options?.dbFilePath || DEFAULT_DB_PATH;
    const db = await readLocalDb(dbFilePath);

    const input: CourseEnquiryInput = {
      name: sanitizeInput(rawInput?.name),
      phone: sanitizeInput(rawInput?.phone),
      whatsapp: sanitizeInput(rawInput?.whatsapp || rawInput?.phone),
      email: sanitizeInput(rawInput?.email),
      course: sanitizeInput(rawInput?.course),
      preferred_location: sanitizeInput(rawInput?.preferred_location),
      message: sanitizeInput(rawInput?.message),
    };

    const validation = validateCourseEnquiry(input, db.course_enquiries);
    if (!validation.valid) {
      const isDuplicate = validation.error?.toLowerCase().includes('identical');
      return {
        status: isDuplicate ? 409 : 400,
        error: validation.error || 'Invalid course enquiry details.',
      };
    }

    const supa = isSupabaseConfigured();
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const suffix = Math.floor(1000 + Math.random() * 9000).toString();

    const record: CourseEnquiryRecord = {
      id: `enq-${crypto.randomUUID()}`,
      enquiry_id: `ENQ-${yyyy}${mm}${dd}-${suffix}`,
      name: input.name,
      phone: input.phone,
      whatsapp: input.whatsapp,
      email: input.email,
      course: input.course,
      preferred_location: input.preferred_location,
      message: input.message,
      status: 'Received',
      created_at: now.toISOString(),
      storage_backend: supa.configured ? 'supabase' : 'server-db',
    };

    if (supa.configured) {
      await supabaseRequest('course_enquiries', {
        method: 'POST',
        body: JSON.stringify(record),
      });
    }

    db.course_enquiries.unshift(record);
    await writeLocalDb(db, dbFilePath);

    return {
      status: 201,
      enquiry: record,
    };
  });
}

export async function updateCourseEnquiryStatusByAdmin(
  enquiryId: string,
  newStatus: 'Received' | 'Contacted' | 'Enrolled',
  options?: { dbFilePath?: string }
): Promise<{ status: number; enquiry?: CourseEnquiryRecord; error?: string }> {
  return withDatabaseLock(async () => {
    const dbFilePath = options?.dbFilePath || DEFAULT_DB_PATH;
    const db = await readLocalDb(dbFilePath);

    const idx = db.course_enquiries.findIndex(
      (e) => e.id === enquiryId || e.enquiry_id === enquiryId
    );
    if (idx === -1) return { status: 404, error: 'Course enquiry not found.' };

    db.course_enquiries[idx] = {
      ...db.course_enquiries[idx],
      status: newStatus,
    };

    const supa = isSupabaseConfigured();
    if (supa.configured) {
      await supabaseRequest(
        `course_enquiries?enquiry_id=eq.${encodeURIComponent(db.course_enquiries[idx].enquiry_id)}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status: newStatus }),
        }
      );
    }

    await writeLocalDb(db, dbFilePath);
    return { status: 200, enquiry: db.course_enquiries[idx] };
  });
}

export async function createContactMessageRecord(
  rawInput: ContactMessageInput,
  options?: { dbFilePath?: string }
): Promise<{ status: number; contactMessage?: ContactMessageRecord; error?: string }> {
  return withDatabaseLock(async () => {
    const dbFilePath = options?.dbFilePath || DEFAULT_DB_PATH;
    const db = await readLocalDb(dbFilePath);

    const allowedCategories = new Set(['trust', 'academy', 'studio']);
    const normalizedCategory =
      typeof rawInput?.category === 'string' && allowedCategories.has(rawInput.category)
        ? (rawInput.category as ContactMessageInput['category'])
        : undefined;

    const input: ContactMessageInput = {
      name: sanitizeInput(rawInput?.name),
      phone: sanitizeInput(rawInput?.phone),
      email: sanitizeInput(rawInput?.email),
      message: sanitizeInput(rawInput?.message),
      ...(normalizedCategory ? { category: normalizedCategory } : {}),
    };

    const validation = validateContactMessage(input, db.contact_messages);
    if (!validation.valid) {
      const isDuplicate = validation.error
        ?.toLowerCase()
        .includes('already been submitted');
      return {
        status: isDuplicate ? 409 : 400,
        error: validation.error || 'Invalid contact message details.',
      };
    }

    const supa = isSupabaseConfigured();
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const suffix = Math.floor(1000 + Math.random() * 9000).toString();

    const record: ContactMessageRecord = {
      id: `msg-${crypto.randomUUID()}`,
      reference_id: `MSG-${yyyy}${mm}${dd}-${suffix}`,
      name: input.name,
      phone: input.phone,
      email: input.email,
      message: input.message,
      ...(normalizedCategory ? { category: normalizedCategory } : {}),
      status: 'Received',
      created_at: now.toISOString(),
      storage_backend: supa.configured ? 'supabase' : 'server-db',
    };

    if (supa.configured) {
      await supabaseRequest('contact_messages', {
        method: 'POST',
        body: JSON.stringify(record),
      });
    }

    db.contact_messages.unshift(record);
    await writeLocalDb(db, dbFilePath);

    return {
      status: 201,
      contactMessage: record,
    };
  });
}

export async function updateContactMessageStatusByAdmin(
  messageId: string,
  newStatus: 'Received' | 'Replied',
  options?: { dbFilePath?: string }
): Promise<{ status: number; contactMessage?: ContactMessageRecord; error?: string }> {
  return withDatabaseLock(async () => {
    const dbFilePath = options?.dbFilePath || DEFAULT_DB_PATH;
    const db = await readLocalDb(dbFilePath);

    const idx = db.contact_messages.findIndex(
      (m) => m.id === messageId || m.reference_id === messageId
    );
    if (idx === -1) return { status: 404, error: 'Contact message not found.' };

    db.contact_messages[idx] = {
      ...db.contact_messages[idx],
      status: newStatus,
    };

    const supa = isSupabaseConfigured();
    if (supa.configured) {
      await supabaseRequest(
        `contact_messages?reference_id=eq.${encodeURIComponent(db.contact_messages[idx].reference_id)}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status: newStatus }),
        }
      );
    }

    await writeLocalDb(db, dbFilePath);
    return { status: 200, contactMessage: db.contact_messages[idx] };
  });
}

/* ==================== ADMIN DASHBOARD DATA & STATS ==================== */

export async function getAdminDashboardData(options?: {
  dbFilePath?: string;
}): Promise<{
  stats: AdminDashboardStats;
  bookings: BookingRecord[];
  statusHistory: BookingStatusHistoryEntry[];
  courseEnquiries: CourseEnquiryRecord[];
  contactMessages: ContactMessageRecord[];
  blockedDates: BlockedDateRecord[];
}> {
  const dbFilePath = options?.dbFilePath || DEFAULT_DB_PATH;
  const db = await readLocalDb(dbFilePath);
  const supa = isSupabaseConfigured();
  const waCfg = getWhatsAppCloudConfig();

  const stats: AdminDashboardStats = {
    totalBookings: db.bookings.length,
    pendingBookings: db.bookings.filter((b) => b.status === 'Pending Confirmation')
      .length,
    confirmedBookings: db.bookings.filter((b) => b.status === 'Confirmed').length,
    rescheduledBookings: db.bookings.filter((b) => b.status === 'Rescheduled').length,
    rejectedBookings: db.bookings.filter((b) => b.status === 'Rejected').length,
    totalCourseEnquiries: db.course_enquiries.length,
    totalContactMessages: db.contact_messages.length,
    blockedDatesCount: db.blocked_dates.length,
    whatsappConfigured: waCfg.configured,
    storageBackend: supa.configured ? 'supabase' : 'local-dev-fallback',
    timezone: STUDIO_TIMEZONE,
  };

  return {
    stats,
    bookings: db.bookings,
    statusHistory: db.booking_status_history,
    courseEnquiries: db.course_enquiries,
    contactMessages: db.contact_messages,
    blockedDates: db.blocked_dates,
  };
}
