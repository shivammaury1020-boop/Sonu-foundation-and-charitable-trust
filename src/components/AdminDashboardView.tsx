import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  LogOut,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  MessageCircle,
  AlertTriangle,
  User,
  Phone,
  Mail,
  MapPin,
  History,
  BookOpen,
  MessageSquare,
  Ban,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Lock,
  Plus,
  Trash2,
} from 'lucide-react';
import { LOCATIONS, PageId, TIME_SLOTS } from '../data/siteData';
import {
  type AdminDashboardStats,
  type BlockedDateRecord,
  type BookingRecord,
  type BookingStatus,
  type BookingStatusHistoryEntry,
  BUSINESS_HOURS_CONFIG,
  type ContactMessageRecord,
  type CourseEnquiryRecord,
  getKolkataDateTimeParts,
} from '../utils/bookingLogic';
import { BrandLogo } from './NavbarAndFooter';

const ADMIN_TOKEN_STORAGE_KEY = 'sbs_admin_session_token';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

type AdminTab =
  | 'bookings'
  | 'history'
  | 'enquiries'
  | 'messages'
  | 'blocked-dates';

export const AdminDashboardView: React.FC<{
  onNavigate: (page: PageId) => void;
}> = ({ onNavigate }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<AdminTab>('bookings');
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [statusHistory, setStatusHistory] = useState<BookingStatusHistoryEntry[]>([]);
  const [courseEnquiries, setCourseEnquiries] = useState<CourseEnquiryRecord[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessageRecord[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDateRecord[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{
    type: 'success' | 'error' | 'warning';
    text: string;
  } | null>(null);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | BookingStatus>('All');
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Expanded booking details & modals
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<BookingRecord | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleLocation, setRescheduleLocation] = useState('');
  const [rescheduleNotes, setRescheduleNotes] = useState('');

  const [rejectTarget, setRejectTarget] = useState<BookingRecord | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Blocked date form
  const [newBlockedLocation, setNewBlockedLocation] = useState<'all' | 'location-1' | 'location-2'>('all');
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newBlockedReason, setNewBlockedReason] = useState('');

  const [busyBookingId, setBusyBookingId] = useState<string | null>(null);

  const todayKolkata = getKolkataDateTimeParts().dateStr;

  const saveToken = (newToken: string | null) => {
    setToken(newToken);
    try {
      if (newToken) {
        sessionStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, newToken);
      } else {
        sessionStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  };

  const fetchDashboardData = useCallback(
    async (authToken: string) => {
      setLoadingData(true);
      try {
        const [sessionRes, dashRes] = await Promise.all([
          fetch('/api/admin/session', {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          fetch('/api/admin/dashboard', {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        ]);

        if (sessionRes.status === 401 || dashRes.status === 401) {
          saveToken(null);
          setAdminUser(null);
          setLoadingData(false);
          return;
        }

        const sessionData = (await sessionRes.json()) as { user?: AdminUser };
        const dashData = (await dashRes.json()) as {
          stats: AdminDashboardStats;
          bookings: BookingRecord[];
          statusHistory: BookingStatusHistoryEntry[];
          courseEnquiries: CourseEnquiryRecord[];
          contactMessages: ContactMessageRecord[];
          blockedDates: BlockedDateRecord[];
        };

        if (sessionData.user) setAdminUser(sessionData.user);
        setStats(dashData.stats);
        setBookings(dashData.bookings || []);
        setStatusHistory(dashData.statusHistory || []);
        setCourseEnquiries(dashData.courseEnquiries || []);
        setContactMessages(dashData.contactMessages || []);
        setBlockedDates(dashData.blockedDates || []);
      } catch (err: unknown) {
        setActionFeedback({
          type: 'error',
          text:
            err instanceof Error
              ? err.message
              : 'Unable to load dashboard data.',
        });
      } finally {
        setLoadingData(false);
      }
    },
    []
  );

  useEffect(() => {
    if (token) {
      fetchDashboardData(token);
    }
  }, [token, fetchDashboardData]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingIn) return;
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        token?: string;
        user?: AdminUser;
        error?: string;
      };

      if (!response.ok || !data.token) {
        setLoginError(data.error || 'Invalid administrator email or password.');
        setIsLoggingIn(false);
        return;
      }

      saveToken(data.token);
      if (data.user) setAdminUser(data.user);
      setLoginPassword('');
      setIsLoggingIn(false);
    } catch {
      setLoginError('Network error while signing in. Please try again.');
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    saveToken(null);
    setAdminUser(null);
    setActionFeedback(null);
  };

  const handleConfirmBooking = async (booking: BookingRecord) => {
    if (!token || busyBookingId) return;
    setBusyBookingId(booking.booking_id);
    setActionFeedback(null);

    try {
      const response = await fetch(
        `/api/admin/bookings/${encodeURIComponent(booking.booking_id)}/confirm`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            notes: 'Confirmed by studio administrator via Admin Dashboard.',
          }),
        }
      );

      const data = (await response.json().catch(() => ({}))) as {
        booking?: BookingRecord;
        error?: string;
      };

      if (!response.ok || !data.booking) {
        setActionFeedback({
          type: 'error',
          text: data.error || 'Failed to confirm booking.',
        });
      } else {
        const waStatus = data.booking.whatsapp_status;
        if (waStatus === 'Sent') {
          setActionFeedback({
            type: 'success',
            text: `Booking ${data.booking.booking_id} confirmed! WhatsApp confirmation sent (Message ID: ${data.booking.whatsapp_message_id}).`,
          });
        } else if (waStatus === 'Not Configured') {
          setActionFeedback({
            type: 'warning',
            text: `Booking ${data.booking.booking_id} confirmed in database. Automatic WhatsApp Cloud API is Not Configured (${data.booking.whatsapp_error}).`,
          });
        } else {
          setActionFeedback({
            type: 'warning',
            text: `Booking ${data.booking.booking_id} confirmed, but WhatsApp delivery failed (${data.booking.whatsapp_error}). You can retry below.`,
          });
        }
        await fetchDashboardData(token);
      }
    } finally {
      setBusyBookingId(null);
    }
  };

  const handleRetryWhatsApp = async (booking: BookingRecord) => {
    if (!token || busyBookingId) return;
    setBusyBookingId(booking.booking_id);
    setActionFeedback(null);

    try {
      const response = await fetch(
        `/api/admin/bookings/${encodeURIComponent(booking.booking_id)}/whatsapp-retry`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = (await response.json().catch(() => ({}))) as {
        booking?: BookingRecord;
        error?: string;
      };
      if (!response.ok || !data.booking) {
        setActionFeedback({
          type: 'error',
          text: data.error || 'Failed to retry WhatsApp message.',
        });
      } else {
        setActionFeedback({
          type: data.booking.whatsapp_status === 'Sent' ? 'success' : 'warning',
          text: `WhatsApp retry result for ${data.booking.booking_id}: ${data.booking.whatsapp_status}${
            data.booking.whatsapp_error ? ` — ${data.booking.whatsapp_error}` : ''
          }`,
        });
        await fetchDashboardData(token);
      }
    } finally {
      setBusyBookingId(null);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !rejectTarget || busyBookingId) return;
    setBusyBookingId(rejectTarget.booking_id);
    setActionFeedback(null);

    try {
      const response = await fetch(
        `/api/admin/bookings/${encodeURIComponent(rejectTarget.booking_id)}/reject`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason: rejectReason }),
        }
      );
      const data = (await response.json().catch(() => ({}))) as {
        booking?: BookingRecord;
        error?: string;
      };
      if (!response.ok || !data.booking) {
        setActionFeedback({
          type: 'error',
          text: data.error || 'Failed to reject booking.',
        });
      } else {
        setActionFeedback({
          type: 'success',
          text: `Booking ${data.booking.booking_id} marked as Rejected and slot released.`,
        });
        setRejectTarget(null);
        setRejectReason('');
        await fetchDashboardData(token);
      }
    } finally {
      setBusyBookingId(null);
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !rescheduleTarget || busyBookingId) return;
    setBusyBookingId(rescheduleTarget.booking_id);
    setActionFeedback(null);

    try {
      const response = await fetch(
        `/api/admin/bookings/${encodeURIComponent(rescheduleTarget.booking_id)}/reschedule`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            appointment_date: rescheduleDate,
            appointment_time: rescheduleTime,
            location_id: rescheduleLocation,
            notes: rescheduleNotes,
          }),
        }
      );
      const data = (await response.json().catch(() => ({}))) as {
        booking?: BookingRecord;
        error?: string;
      };
      if (!response.ok || !data.booking) {
        setActionFeedback({
          type: 'error',
          text: data.error || 'Failed to reschedule booking.',
        });
      } else {
        setActionFeedback({
          type: 'success',
          text: `Booking ${data.booking.booking_id} rescheduled to ${data.booking.appointment_date} at ${data.booking.appointment_time} IST (WhatsApp status: ${data.booking.whatsapp_status}).`,
        });
        setRescheduleTarget(null);
        await fetchDashboardData(token);
      }
    } finally {
      setBusyBookingId(null);
    }
  };

  const handleAddBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newBlockedDate) return;
    setActionFeedback(null);

    const response = await fetch('/api/admin/blocked-dates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        location_id: newBlockedLocation,
        blocked_date: newBlockedDate,
        reason: newBlockedReason || 'Studio Holiday / Closed',
      }),
    });
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
    };
    if (!response.ok) {
      setActionFeedback({
        type: 'error',
        text: data.error || 'Could not block date.',
      });
      return;
    }
    setNewBlockedDate('');
    setNewBlockedReason('');
    setActionFeedback({
      type: 'success',
      text: 'Blocked date added. Customers can no longer book appointments on that date.',
    });
    await fetchDashboardData(token);
  };

  const handleRemoveBlockedDate = async (id: string) => {
    if (!token) return;
    await fetch(`/api/admin/blocked-dates/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchDashboardData(token);
  };

  const handleUpdateEnquiryStatus = async (
    id: string,
    status: 'Received' | 'Contacted' | 'Enrolled'
  ) => {
    if (!token) return;
    await fetch(`/api/admin/course-enquiries/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    await fetchDashboardData(token);
  };

  const handleUpdateMessageStatus = async (
    id: string,
    status: 'Received' | 'Replied'
  ) => {
    if (!token) return;
    await fetch(`/api/admin/contact-messages/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    await fetchDashboardData(token);
  };

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'All' && b.status !== statusFilter) return false;
    if (locationFilter !== 'All' && b.location_id !== locationFilter) return false;
    if (dateFilter && b.appointment_date !== dateFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        b.booking_id.toLowerCase().includes(q) ||
        b.customer_name.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q) ||
        b.whatsapp_number.toLowerCase().includes(q) ||
        b.service_name.toLowerCase().includes(q) ||
        (b.email || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  /* ==================== 1. SECURE ADMIN LOGIN VIEW ==================== */
  if (!token) {
    return (
      <div className="min-h-[82vh] bg-[#FAF5EF] py-12 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#C8A15A]/50 shadow-xl p-6 sm:p-9 space-y-6">
          <div className="flex items-center justify-between">
            <BrandLogo variant="dark" onClick={() => onNavigate('home')} />
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#6B173D]/10 text-[#6B173D] border border-[#C8A15A]/40">
              <Lock className="w-3 h-3" />
              Admin Only
            </span>
          </div>

          <div className="space-y-1.5">
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#201B1D]">
              Administrator Sign In
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6265]">
              Authorized access for Sonu’s Beauty Studio &amp; Academy staff to manage bookings, slot availability, course enquiries, and WhatsApp confirmations.
            </p>
          </div>

          {loginError && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-xs sm:text-sm text-rose-900 font-semibold flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email-input"
                className="block text-xs font-semibold text-[#201B1D] mb-1"
              >
                Administrator Email *
              </label>
              <input
                id="admin-email-input"
                type="email"
                required
                autoComplete="username"
                placeholder="admin@sonusbeautystudio.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full rounded-xl border border-[#C8A15A]/50 bg-[#FAF5EF] px-3.5 py-2.5 text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password-input"
                className="block text-xs font-semibold text-[#201B1D] mb-1"
              >
                Password *
              </label>
              <input
                id="admin-password-input"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter administrator password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full rounded-xl border border-[#C8A15A]/50 bg-[#FAF5EF] px-3.5 py-2.5 text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-sm font-bold py-3 px-5 rounded-xl shadow-md transition-colors cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-[#E6C98F]" />
              <span>{isLoggingIn ? 'Signing In...' : 'Sign In to Admin Dashboard'}</span>
            </button>
          </form>

          <div className="pt-3 border-t border-[#C8A15A]/25 flex items-center justify-between text-xs text-[#6E6265]">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1.5 text-[#4A0D29] hover:underline font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
            <span>Protected by HMAC-SHA256</span>
          </div>
        </div>
      </div>
    );
  }

  /* ==================== 2. AUTHENTICATED ADMIN DASHBOARD ==================== */
  return (
    <div className="min-h-screen bg-[#FAF5EF] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Bar */}
        <div className="bg-[#4A0D29] text-[#FAF5EF] rounded-2xl p-5 sm:p-6 border border-[#C8A15A]/40 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#E6C98F]">
                AUTHORIZED ADMIN PORTAL
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#6B173D] border border-[#C8A15A]/40 text-[#E6C98F] font-semibold">
                Timezone: {stats?.timezone || 'Asia/Kolkata'}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  stats?.whatsappConfigured
                    ? 'bg-emerald-900/60 border-emerald-400/50 text-emerald-200'
                    : 'bg-amber-900/60 border-amber-400/50 text-amber-200'
                }`}
              >
                WhatsApp Cloud API: {stats?.whatsappConfigured ? 'Configured' : 'Not Configured'}
              </span>
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
              Sonu’s Beauty Studio &amp; Academy — Management Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#FAF5EF]/80">
              Signed in as <strong>{adminUser?.email || 'Administrator'}</strong> · Storage:{' '}
              <strong className="uppercase">{stats?.storageBackend || 'server-db'}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => fetchDashboardData(token)}
              disabled={loadingData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#6B173D] hover:bg-[#591131] border border-[#C8A15A]/40 text-xs font-semibold text-white cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-[#C8A15A]/30 text-xs font-semibold text-white cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E6C98F] hover:bg-[#C8A15A] text-[#201B1D] text-xs font-bold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Cloud API Configuration Banner when Not Configured */}
        {stats && !stats.whatsappConfigured && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-amber-950">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block">
                WhatsApp Business Cloud API Status: Not Configured
              </strong>
              <span>
                Server environment variables <code className="font-mono bg-amber-100 px-1 rounded">WHATSAPP_CLOUD_API_TOKEN</code> and <code className="font-mono bg-amber-100 px-1 rounded">WHATSAPP_PHONE_NUMBER_ID</code> are not currently set. When you confirm an appointment, the booking is confirmed in the database and its WhatsApp delivery status is accurately recorded as <strong>Not Configured</strong> (never faked as Sent). Once configured, use the <strong>Retry WhatsApp</strong> button on any confirmed booking.
              </span>
            </div>
          </div>
        )}

        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div
            role="status"
            className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 ${
              actionFeedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : actionFeedback.type === 'warning'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            <span>{actionFeedback.text}</span>
            <button
              type="button"
              onClick={() => setActionFeedback(null)}
              className="text-xs underline cursor-pointer shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            {
              label: 'Total Bookings',
              value: stats?.totalBookings ?? bookings.length,
              tone: 'bg-white text-[#201B1D]',
            },
            {
              label: 'Pending',
              value: stats?.pendingBookings ?? 0,
              tone: 'bg-amber-50/90 text-amber-900 border-amber-300',
            },
            {
              label: 'Confirmed',
              value: stats?.confirmedBookings ?? 0,
              tone: 'bg-emerald-50/90 text-emerald-900 border-emerald-300',
            },
            {
              label: 'Rescheduled',
              value: stats?.rescheduledBookings ?? 0,
              tone: 'bg-sky-50/90 text-sky-900 border-sky-300',
            },
            {
              label: 'Rejected',
              value: stats?.rejectedBookings ?? 0,
              tone: 'bg-rose-50/90 text-rose-900 border-rose-300',
            },
            {
              label: 'Course Enquiries',
              value: stats?.totalCourseEnquiries ?? courseEnquiries.length,
              tone: 'bg-white text-[#4A0D29]',
            },
            {
              label: 'Contact Messages',
              value: stats?.totalContactMessages ?? contactMessages.length,
              tone: 'bg-white text-[#4A0D29]',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl p-4 border border-[#C8A15A]/35 shadow-sm ${stat.tone}`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-75 block">
                {stat.label}
              </span>
              <span className="font-serif-luxury text-2xl sm:text-3xl font-bold tabular-nums mt-1 block">
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-2 border border-[#C8A15A]/35 flex flex-wrap gap-1.5">
          {[
            {
              id: 'bookings' as AdminTab,
              label: `Appointments (${bookings.length})`,
              icon: Calendar,
            },
            {
              id: 'history' as AdminTab,
              label: `Status History (${statusHistory.length})`,
              icon: History,
            },
            {
              id: 'enquiries' as AdminTab,
              label: `Course Enquiries (${courseEnquiries.length})`,
              icon: BookOpen,
            },
            {
              id: 'messages' as AdminTab,
              label: `Contact Messages (${contactMessages.length})`,
              icon: MessageSquare,
            },
            {
              id: 'blocked-dates' as AdminTab,
              label: `Slot Protection & Blocked Dates (${blockedDates.length})`,
              icon: Ban,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#6B173D] text-white shadow-sm'
                    : 'text-[#201B1D] hover:bg-[#FAF5EF]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: APPOINTMENTS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {/* Search and Filter Controls */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#C8A15A]/35 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[#6E6265] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  aria-label="Search bookings by name, phone, ID, or service"
                  placeholder="Search ID, name, phone, service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-[#C8A15A]/45 bg-[#FAF5EF] pl-9 pr-3 py-2 text-xs sm:text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
                />
              </div>

              <select
                aria-label="Filter by booking status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'All' | BookingStatus)}
                className="rounded-xl border border-[#C8A15A]/45 bg-[#FAF5EF] px-3 py-2 text-xs sm:text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
              >
                <option value="All">All Statuses</option>
                <option value="Pending Confirmation">Pending Confirmation</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Rescheduled">Rescheduled</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select
                aria-label="Filter by branch location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="rounded-xl border border-[#C8A15A]/45 bg-[#FAF5EF] px-3 py-2 text-xs sm:text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
              >
                <option value="All">All Studio Locations</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <input
                  type="date"
                  aria-label="Filter by appointment date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="flex-1 rounded-xl border border-[#C8A15A]/45 bg-[#FAF5EF] px-3 py-2 text-xs sm:text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
                />
                {(searchQuery || statusFilter !== 'All' || locationFilter !== 'All' || dateFilter) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('All');
                      setLocationFilter('All');
                      setDateFilter('');
                    }}
                    className="px-3 py-2 rounded-xl bg-[#F3E9DF] text-[#4A0D29] text-xs font-semibold cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-[#C8A15A]/30 space-y-2">
                <p className="font-serif-luxury text-xl font-bold text-[#201B1D]">
                  No Matching Appointments Found
                </p>
                <p className="text-xs sm:text-sm text-[#6E6265]">
                  New customer appointment submissions appear here automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBookings.map((bk) => {
                  const isExpanded = expandedBookingId === bk.booking_id;
                  const bkHistory = statusHistory.filter(
                    (h) => h.booking_id === bk.booking_id
                  );
                  const isBusy = busyBookingId === bk.booking_id;

                  return (
                    <div
                      key={bk.id}
                      className="bg-white rounded-2xl border border-[#C8A15A]/40 shadow-sm overflow-hidden"
                    >
                      <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#FAF5EF] border border-[#C8A15A]/40 text-[#6B173D]">
                              {bk.booking_id}
                            </span>
                            <span
                              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                                bk.status === 'Confirmed'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : bk.status === 'Rescheduled'
                                  ? 'bg-sky-50 text-sky-800 border-sky-300'
                                  : bk.status === 'Rejected'
                                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                                  : 'bg-amber-50 text-amber-900 border-amber-300'
                              }`}
                            >
                              {bk.status}
                            </span>
                            <span
                              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                                bk.whatsapp_status === 'Sent'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : bk.whatsapp_status === 'Failed'
                                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                                  : bk.whatsapp_status === 'Not Configured'
                                  ? 'bg-amber-50 text-amber-900 border-amber-200'
                                  : 'bg-gray-50 text-gray-600 border-gray-200'
                              }`}
                            >
                              WhatsApp API: {bk.whatsapp_status || 'Not Sent'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                            <strong className="font-serif-luxury text-lg text-[#201B1D]">
                              {bk.customer_name}
                            </strong>
                            <span className="text-[#6B173D] font-semibold">
                              {bk.service_name}
                            </span>
                            <span className="text-xs text-[#6E6265] flex items-center gap-1 tabular-nums">
                              <Calendar className="w-3.5 h-3.5 text-[#6B173D]" />
                              {bk.appointment_date} at {bk.appointment_time} IST
                            </span>
                            <span className="text-xs text-[#6E6265] flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#6B173D]" />
                              {bk.location_name}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-[#6E6265] tabular-nums">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-[#6B173D]" />
                              Phone: {bk.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3.5 h-3.5 text-[#6B173D]" />
                              WhatsApp: {bk.whatsapp_number || bk.phone}
                            </span>
                            {bk.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5 text-[#6B173D]" />
                                {bk.email}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {bk.status !== 'Confirmed' && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleConfirmBooking(bk)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm cursor-pointer disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Confirm</span>
                            </button>
                          )}

                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => {
                              setRescheduleTarget(bk);
                              setRescheduleDate(bk.appointment_date);
                              setRescheduleTime(bk.appointment_time);
                              setRescheduleLocation(bk.location_id);
                              setRescheduleNotes(bk.admin_notes || '');
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF5EF] hover:bg-[#F3E9DF] text-[#4A0D29] border border-[#C8A15A]/50 text-xs font-semibold cursor-pointer"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Reschedule</span>
                          </button>

                          {bk.status !== 'Rejected' && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => {
                                setRejectTarget(bk);
                                setRejectReason('');
                              }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          )}

                          {(bk.status === 'Confirmed' || bk.status === 'Rescheduled') &&
                            bk.whatsapp_status !== 'Sent' && (
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleRetryWhatsApp(bk)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-bold cursor-pointer"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>Retry WhatsApp</span>
                              </button>
                            )}

                          <button
                            type="button"
                            onClick={() =>
                              setExpandedBookingId(isExpanded ? null : bk.booking_id)
                            }
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#FAF5EF] text-[#201B1D] text-xs font-semibold border border-[#C8A15A]/30 cursor-pointer"
                          >
                            <span>Details &amp; History ({bkHistory.length})</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Customer Details, WhatsApp Delivery Metadata & Status History */}
                      {isExpanded && (
                        <div className="bg-[#FAF5EF] border-t border-[#C8A15A]/30 p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                          <div className="bg-white rounded-xl p-4 border border-[#C8A15A]/30 space-y-2">
                            <h3 className="font-bold text-[#4A0D29] uppercase tracking-wider flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5" />
                              Customer &amp; WhatsApp Cloud API Delivery Details
                            </h3>
                            <div className="space-y-1 text-[#201B1D]">
                              <div>
                                <strong>Customer Name:</strong> {bk.customer_name}
                              </div>
                              <div>
                                <strong>Phone:</strong> {bk.phone} ·{' '}
                                <strong>WhatsApp:</strong> {bk.whatsapp_number || bk.phone}
                              </div>
                              <div>
                                <strong>Email:</strong> {bk.email || 'Not provided'}
                              </div>
                              <div>
                                <strong>Customer Notes:</strong>{' '}
                                {bk.message || 'No special requests'}
                              </div>
                              <div>
                                <strong>Admin Notes:</strong>{' '}
                                {bk.admin_notes || 'None'}
                              </div>
                              <div className="pt-2 border-t border-[#C8A15A]/20 space-y-1">
                                <div>
                                  <strong>WhatsApp Delivery Status:</strong>{' '}
                                  <span className="font-bold">
                                    {bk.whatsapp_status || 'Not Sent'}
                                  </span>
                                </div>
                                <div>
                                  <strong>WhatsApp Message ID:</strong>{' '}
                                  <span className="font-mono">
                                    {bk.whatsapp_message_id || 'N/A'}
                                  </span>
                                </div>
                                <div>
                                  <strong>Last WhatsApp Attempt:</strong>{' '}
                                  {bk.whatsapp_timestamp
                                    ? new Date(bk.whatsapp_timestamp).toLocaleString('en-IN', {
                                        timeZone: 'Asia/Kolkata',
                                      })
                                    : 'N/A'}
                                </div>
                                {bk.whatsapp_error && (
                                  <div className="text-rose-800 bg-rose-50 p-2 rounded border border-rose-200">
                                    <strong>Diagnostic / Error:</strong> {bk.whatsapp_error}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-xl p-4 border border-[#C8A15A]/30 space-y-2">
                            <h3 className="font-bold text-[#4A0D29] uppercase tracking-wider flex items-center gap-1.5">
                              <History className="w-3.5 h-3.5" />
                              Booking Status Audit Trail ({bkHistory.length})
                            </h3>
                            {bkHistory.length === 0 ? (
                              <p className="text-[#6E6265]">No status history recorded.</p>
                            ) : (
                              <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                {bkHistory.map((h) => (
                                  <li
                                    key={h.id}
                                    className="p-2.5 rounded-lg bg-[#FAF5EF] border border-[#C8A15A]/25 space-y-0.5"
                                  >
                                    <div className="flex items-center justify-between font-semibold text-[#201B1D]">
                                      <span>
                                        {h.previous_status
                                          ? `${h.previous_status} → ${h.new_status}`
                                          : `Created (${h.new_status})`}
                                      </span>
                                      <span className="text-[11px] text-[#6E6265] tabular-nums">
                                        {new Date(h.created_at).toLocaleString('en-IN', {
                                          timeZone: 'Asia/Kolkata',
                                        })}
                                      </span>
                                    </div>
                                    <div className="text-[#6E6265]">
                                      By: <strong>{h.changed_by}</strong> · {h.notes}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GLOBAL BOOKING STATUS HISTORY */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl p-5 border border-[#C8A15A]/35 shadow-sm space-y-4">
            <h2 className="font-serif-luxury text-2xl font-bold text-[#201B1D]">
              Complete Booking Status History
            </h2>
            {statusHistory.length === 0 ? (
              <p className="text-sm text-[#6E6265]">No status transitions logged yet.</p>
            ) : (
              <div className="space-y-2.5">
                {statusHistory.map((h) => (
                  <div
                    key={h.id}
                    className="p-3.5 rounded-xl bg-[#FAF5EF] border border-[#C8A15A]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm"
                  >
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-[#6B173D]">
                          {h.booking_id}
                        </span>
                        <span className="font-semibold text-[#201B1D]">
                          {h.previous_status
                            ? `${h.previous_status} → ${h.new_status}`
                            : `Created as ${h.new_status}`}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-white border border-[#C8A15A]/30 text-[#4A0D29]">
                          By {h.changed_by}
                        </span>
                      </div>
                      <p className="text-xs text-[#6E6265]">{h.notes}</p>
                    </div>
                    <span className="text-xs text-[#6E6265] tabular-nums shrink-0">
                      {new Date(h.created_at).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: COURSE ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="bg-white rounded-2xl p-5 border border-[#C8A15A]/35 shadow-sm space-y-4">
            <h2 className="font-serif-luxury text-2xl font-bold text-[#201B1D]">
              Academy Course Enquiries ({courseEnquiries.length})
            </h2>
            {courseEnquiries.length === 0 ? (
              <p className="text-sm text-[#6E6265]">No course enquiries submitted yet.</p>
            ) : (
              <div className="space-y-3">
                {courseEnquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-4 rounded-xl bg-[#FAF5EF] border border-[#C8A15A]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#6B173D]">
                          {enq.enquiry_id}
                        </span>
                        <strong className="text-[#201B1D]">{enq.name}</strong>
                        <span className="px-2 py-0.5 rounded-full bg-[#6B173D]/10 text-[#6B173D] text-xs font-bold">
                          {enq.course}
                        </span>
                      </div>
                      <div className="text-xs text-[#6E6265]">
                        Phone: {enq.phone} · WhatsApp: {enq.whatsapp || enq.phone} · Preferred Branch:{' '}
                        {enq.preferred_location}
                      </div>
                      {enq.message && (
                        <p className="text-xs text-[#201B1D]">Note: {enq.message}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-[#6E6265]">
                        Status:
                      </label>
                      <select
                        aria-label={`Status for enquiry ${enq.enquiry_id}`}
                        value={enq.status}
                        onChange={(e) =>
                          handleUpdateEnquiryStatus(
                            enq.enquiry_id,
                            e.target.value as 'Received' | 'Contacted' | 'Enrolled'
                          )
                        }
                        className="rounded-lg border border-[#C8A15A]/50 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#201B1D]"
                      >
                        <option value="Received">Received</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Enrolled">Enrolled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CONTACT MESSAGES */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl p-5 border border-[#C8A15A]/35 shadow-sm space-y-4">
            <h2 className="font-serif-luxury text-2xl font-bold text-[#201B1D]">
              Customer Contact Messages ({contactMessages.length})
            </h2>
            {contactMessages.length === 0 ? (
              <p className="text-sm text-[#6E6265]">No contact messages received yet.</p>
            ) : (
              <div className="space-y-3">
                {contactMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 rounded-xl bg-[#FAF5EF] border border-[#C8A15A]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-[#6B173D]">
                          {msg.reference_id}
                        </span>
                        {msg.category && (
                          <span className="text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-white text-[#6B173D] border border-[#C8A15A]/45">
                            {msg.category === 'trust'
                              ? 'Trust Enquiry'
                              : msg.category === 'academy'
                                ? 'Academy Enquiry'
                                : 'Beauty Studio Enquiry'}
                          </span>
                        )}
                        <strong className="text-[#201B1D]">{msg.name}</strong>
                        <span className="text-xs text-[#6E6265] tabular-nums">
                          {msg.phone} {msg.email ? `· ${msg.email}` : ''}
                        </span>
                      </div>
                      <p className="text-sm text-[#201B1D]">{msg.message}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        aria-label={`Status for message ${msg.reference_id}`}
                        value={msg.status}
                        onChange={(e) =>
                          handleUpdateMessageStatus(
                            msg.reference_id,
                            e.target.value as 'Received' | 'Replied'
                          )
                        }
                        className="rounded-lg border border-[#C8A15A]/50 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#201B1D]"
                      >
                        <option value="Received">Received</option>
                        <option value="Replied">Replied</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SLOT PROTECTION & BLOCKED DATES */}
        {activeTab === 'blocked-dates' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-[#C8A15A]/35 shadow-sm space-y-4">
              <h2 className="font-serif-luxury text-xl font-bold text-[#201B1D]">
                Block Studio Date / Holiday
              </h2>
              <p className="text-xs text-[#6E6265]">
                Studio Business Hours: <strong>{BUSINESS_HOURS_CONFIG.label}</strong>. Block specific dates for holidays or private bridal events so customers cannot book slots on those dates.
              </p>

              <form onSubmit={handleAddBlockedDate} className="space-y-3">
                <div>
                  <label
                    htmlFor="block-branch-select"
                    className="block text-xs font-semibold text-[#201B1D] mb-1"
                  >
                    Studio Branch
                  </label>
                  <select
                    id="block-branch-select"
                    value={newBlockedLocation}
                    onChange={(e) =>
                      setNewBlockedLocation(
                        e.target.value as 'all' | 'location-1' | 'location-2'
                      )
                    }
                    className="w-full rounded-xl border border-[#C8A15A]/50 bg-[#FAF5EF] px-3 py-2 text-xs sm:text-sm text-[#201B1D]"
                  >
                    <option value="all">Both Vadodara Locations</option>
                    <option value="location-1">Branch 1 — Somatalav, Waghodia Road</option>
                    <option value="location-2">Branch 2 — Adaniyapul, Fatepura</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="block-date-input"
                    className="block text-xs font-semibold text-[#201B1D] mb-1"
                  >
                    Date to Block *
                  </label>
                  <input
                    id="block-date-input"
                    type="date"
                    required
                    min={todayKolkata}
                    value={newBlockedDate}
                    onChange={(e) => setNewBlockedDate(e.target.value)}
                    className="w-full rounded-xl border border-[#C8A15A]/50 bg-[#FAF5EF] px-3 py-2 text-xs sm:text-sm text-[#201B1D]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="block-reason-input"
                    className="block text-xs font-semibold text-[#201B1D] mb-1"
                  >
                    Reason / Holiday Name
                  </label>
                  <input
                    id="block-reason-input"
                    type="text"
                    placeholder="e.g., Diwali Holiday / Bridal Seminar"
                    value={newBlockedReason}
                    onChange={(e) => setNewBlockedReason(e.target.value)}
                    className="w-full rounded-xl border border-[#C8A15A]/50 bg-[#FAF5EF] px-3 py-2 text-xs sm:text-sm text-[#201B1D]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Blocked Date</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-[#C8A15A]/35 shadow-sm space-y-4">
              <h2 className="font-serif-luxury text-xl font-bold text-[#201B1D]">
                Active Blocked Dates ({blockedDates.length})
              </h2>
              {blockedDates.length === 0 ? (
                <p className="text-xs sm:text-sm text-[#6E6265]">
                  No blocked dates configured. All studio dates within business hours (10:00 AM – 8:00 PM IST) are open for booking.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {blockedDates.map((bd) => (
                    <div
                      key={bd.id}
                      className="p-3.5 rounded-xl bg-[#FAF5EF] border border-[#C8A15A]/35 flex items-center justify-between gap-3 text-xs sm:text-sm"
                    >
                      <div>
                        <strong className="text-[#6B173D] tabular-nums">
                          {bd.blocked_date}
                        </strong>{' '}
                        ·{' '}
                        <span className="font-semibold text-[#201B1D]">
                          {bd.location_id === 'all'
                            ? 'All Locations'
                            : bd.location_id === 'location-1'
                            ? 'Branch 1 · Somatalav, Waghodia Road'
                            : 'Branch 2 · Adaniyapul, Fatepura'}
                        </span>
                        <div className="text-xs text-[#6E6265]">{bd.reason}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveBlockedDate(bd.id)}
                        aria-label={`Remove blocked date ${bd.blocked_date}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Unblock</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* RESCHEDULE MODAL */}
        {rescheduleTarget && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reschedule-modal-title"
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#C8A15A]/50 shadow-2xl space-y-4">
              <h2
                id="reschedule-modal-title"
                className="font-serif-luxury text-2xl font-bold text-[#201B1D]"
              >
                Reschedule Appointment ({rescheduleTarget.booking_id})
              </h2>
              <form onSubmit={handleRescheduleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#201B1D] mb-1">
                    Studio Location
                  </label>
                  <select
                    value={rescheduleLocation}
                    onChange={(e) => setRescheduleLocation(e.target.value)}
                    className="w-full rounded-xl border border-[#C8A15A]/50 bg-[#FAF5EF] px-3 py-2 text-xs sm:text-sm"
                  >
                    {LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#201B1D] mb-1">
                    New Date (IST) *
                  </label>
                  <input
                    type="date"
                    required
                    min={todayKolkata}
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full rounded-xl border border-[#C8A15A]/50 bg-[#FAF5EF] px-3 py-2 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#201B1D] mb-1">
                    New Time Slot (IST) *
                  </label>
                  <select
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full rounded-xl border border-[#C8A15A]/50 bg-[#FAF5EF] px-3 py-2 text-xs sm:text-sm"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#201B1D] mb-1">
                    Admin Reschedule Notes
                  </label>
                  <input
                    type="text"
                    placeholder="Reason or note for customer"
                    value={rescheduleNotes}
                    onChange={(e) => setRescheduleNotes(e.target.value)}
                    className="w-full rounded-xl border border-[#C8A15A]/50 bg-[#FAF5EF] px-3 py-2 text-xs sm:text-sm"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRescheduleTarget(null)}
                    className="px-4 py-2 rounded-xl border border-[#C8A15A]/40 text-xs font-semibold text-[#201B1D] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#6B173D] text-white text-xs font-bold cursor-pointer"
                  >
                    Save Reschedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* REJECT MODAL */}
        {rejectTarget && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reject-modal-title"
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#C8A15A]/50 shadow-2xl space-y-4">
              <h2
                id="reject-modal-title"
                className="font-serif-luxury text-2xl font-bold text-[#201B1D]"
              >
                Reject Appointment ({rejectTarget.booking_id})
              </h2>
              <p className="text-xs text-[#6E6265]">
                Rejecting this request releases the {rejectTarget.appointment_date} ({rejectTarget.appointment_time}) slot so other clients can book it.
              </p>
              <form onSubmit={handleRejectSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#201B1D] mb-1">
                    Rejection Reason *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Requested artist unavailable at this time"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full rounded-xl border border-[#C8A15A]/50 bg-[#FAF5EF] px-3 py-2 text-xs sm:text-sm"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRejectTarget(null)}
                    className="px-4 py-2 rounded-xl border border-[#C8A15A]/40 text-xs font-semibold text-[#201B1D] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-rose-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
