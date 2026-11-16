-- =============================================================================
-- Supabase / PostgreSQL Production Schema & Security (RLS)
-- Project: Sonu’s Beauty Studio & Academy (Only For Ladies) — Vadodara, Gujarat
-- Timezone: Asia/Kolkata
-- =============================================================================

-- 1. Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Bookings Table (with WhatsApp Cloud API delivery tracking & status constraints)
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL UNIQUE,
  location_id TEXT NOT NULL CHECK (location_id IN ('location-1', 'location-2')),
  location_name TEXT NOT NULL,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  appointment_date TEXT NOT NULL,
  appointment_time TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  email TEXT DEFAULT '',
  message TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Pending Confirmation'
    CHECK (status IN ('Pending Confirmation', 'Confirmed', 'Rescheduled', 'Rejected')),
  whatsapp_message_id TEXT,
  whatsapp_status TEXT NOT NULL DEFAULT 'Not Sent'
    CHECK (whatsapp_status IN ('Not Sent', 'Not Configured', 'Sent', 'Failed')),
  whatsapp_timestamp TIMESTAMPTZ,
  whatsapp_error TEXT,
  admin_notes TEXT DEFAULT '',
  storage_backend TEXT DEFAULT 'supabase',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prevent race conditions & double-booking:
-- Only ONE active booking (Pending Confirmation, Confirmed, or Rescheduled) can occupy
-- the same (location_id, appointment_date, appointment_time) slot.
DROP INDEX IF EXISTS public.idx_bookings_unique_slot;
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_active_slot_unique
  ON public.bookings (location_id, appointment_date, appointment_time)
  WHERE status IN ('Pending Confirmation', 'Confirmed', 'Rescheduled');

CREATE INDEX IF NOT EXISTS idx_bookings_status_date
  ON public.bookings (status, appointment_date DESC);

CREATE INDEX IF NOT EXISTS idx_bookings_customer_phone
  ON public.bookings (phone);

-- 3. Booking Status History Table (Audit Trail)
CREATE TABLE IF NOT EXISTS public.booking_status_history (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL REFERENCES public.bookings(booking_id) ON DELETE CASCADE,
  previous_status TEXT,
  new_status TEXT NOT NULL CHECK (new_status IN ('Pending Confirmation', 'Confirmed', 'Rescheduled', 'Rejected')),
  changed_by TEXT NOT NULL,
  notes TEXT DEFAULT '',
  whatsapp_status TEXT DEFAULT 'Not Sent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_history_booking_id
  ON public.booking_status_history (booking_id, created_at DESC);

-- 4. Blocked Dates Table (Holidays / Branch Closures)
CREATE TABLE IF NOT EXISTS public.blocked_dates (
  id TEXT PRIMARY KEY,
  location_id TEXT NOT NULL CHECK (location_id IN ('all', 'location-1', 'location-2')),
  blocked_date TEXT NOT NULL,
  reason TEXT NOT NULL DEFAULT 'Studio Holiday / Closed',
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (location_id, blocked_date)
);

CREATE INDEX IF NOT EXISTS idx_blocked_dates_lookup
  ON public.blocked_dates (blocked_date, location_id);

-- 5. Course Enquiries Table
CREATE TABLE IF NOT EXISTS public.course_enquiries (
  id TEXT PRIMARY KEY,
  enquiry_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT DEFAULT '',
  course TEXT NOT NULL,
  preferred_location TEXT NOT NULL,
  message TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Received'
    CHECK (status IN ('Received', 'Contacted', 'Enrolled')),
  storage_backend TEXT DEFAULT 'supabase',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_course_enquiries_created_at
  ON public.course_enquiries (created_at DESC);

-- 6. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  reference_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Received'
    CHECK (status IN ('Received', 'Replied')),
  storage_backend TEXT DEFAULT 'supabase',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
  ON public.contact_messages (created_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Protect all customer PII from public / anonymous frontend access.
-- Backend Express server connects using SUPABASE_SERVICE_ROLE_KEY (bypasses RLS)
-- after performing strict server-side validation and admin authentication.
-- =============================================================================

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Deny all direct anonymous SELECT/UPDATE/DELETE on customer PII tables:
DROP POLICY IF EXISTS "Deny public access to admin_users" ON public.admin_users;
CREATE POLICY "Deny public access to admin_users"
  ON public.admin_users
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "Deny public read of customer bookings" ON public.bookings;
CREATE POLICY "Deny public read of customer bookings"
  ON public.bookings
  FOR SELECT
  TO anon
  USING (false);

DROP POLICY IF EXISTS "Deny public access to booking_status_history" ON public.booking_status_history;
CREATE POLICY "Deny public access to booking_status_history"
  ON public.booking_status_history
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "Allow public read of non-sensitive blocked_dates" ON public.blocked_dates;
CREATE POLICY "Allow public read of non-sensitive blocked_dates"
  ON public.blocked_dates
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Deny public read of course_enquiries" ON public.course_enquiries;
CREATE POLICY "Deny public read of course_enquiries"
  ON public.course_enquiries
  FOR SELECT
  TO anon
  USING (false);

DROP POLICY IF EXISTS "Deny public read of contact_messages" ON public.contact_messages;
CREATE POLICY "Deny public read of contact_messages"
  ON public.contact_messages
  FOR SELECT
  TO anon
  USING (false);
