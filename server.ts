import express from 'express';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import {
  addBlockedDateByAdmin,
  authenticateAdminUser,
  confirmBookingByAdmin,
  createBookingRecord,
  createContactMessageRecord,
  createCourseEnquiryRecord,
  getAdminDashboardData,
  getPublicSlotAvailability,
  isSupabaseConfigured,
  rejectBookingByAdmin,
  removeBlockedDateByAdmin,
  rescheduleBookingByAdmin,
  retryBookingWhatsAppConfirmation,
  updateContactMessageStatusByAdmin,
  updateCourseEnquiryStatusByAdmin,
} from './src/server/db.ts';
import {
  type AuthenticatedRequest,
  checkLoginRateLimit,
  clearLoginAttempts,
  createAdminSessionToken,
  extractBearerToken,
  getDefaultAdminCredentials,
  recordFailedLoginAttempt,
  requireAdminAuth,
  revokeAdminSessionToken,
} from './src/server/auth.ts';
import { getWhatsAppCloudConfig } from './src/server/whatsapp.ts';
import { STUDIO_TIMEZONE, getKolkataDateTimeParts } from './src/utils/bookingLogic.ts';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Security headers
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  app.use(express.json({ limit: '256kb' }));

  // 0. Production Health Check Endpoint
  app.get('/api/health', (_req, res) => {
    const supa = isSupabaseConfigured();
    const wa = getWhatsAppCloudConfig();
    const kolkata = getKolkataDateTimeParts();
    res.json({
      status: 'ok',
      service: 'Sonu’s Beauty Studio & Academy API',
      timezone: STUDIO_TIMEZONE,
      kolkataDate: kolkata.dateStr,
      storageBackend: supa.configured ? 'supabase' : 'local-dev-fallback',
      whatsappCloudApi: wa.configured ? 'Configured' : 'Not Configured',
      uptimeSeconds: Math.round(process.uptime()),
    });
  });

  // 1. Public Slot Availability Endpoint (Zero Customer PII)
  app.get('/api/slots', async (req, res) => {
    try {
      const locationId = String(req.query.location_id || 'location-1');
      const dateStr = String(req.query.date || '');
      const availability = await getPublicSlotAvailability(locationId, dateStr);
      return res.json(availability);
    } catch (err: unknown) {
      console.error('Error fetching public slot availability:', err);
      return res.status(500).json({
        error: 'Unable to check slot availability right now.',
      });
    }
  });

  // 2. Customer Data Security: Block unauthenticated access to GET /api/bookings
  app.get('/api/bookings', requireAdminAuth, async (_req: AuthenticatedRequest, res) => {
    try {
      const data = await getAdminDashboardData();
      return res.json({ bookings: data.bookings });
    } catch (err: unknown) {
      console.error('Error loading admin bookings:', err);
      return res.status(500).json({
        error: 'Unable to load bookings from database.',
      });
    }
  });

  // 3. Public Customer Booking Submission (Validated + Slot Protected)
  app.post('/api/bookings', async (req, res) => {
    try {
      const result = await createBookingRecord(req.body);
      if (result.status !== 201 || !result.booking) {
        return res.status(result.status).json({ error: result.error });
      }
      return res.status(201).json({ booking: result.booking });
    } catch (err: unknown) {
      console.error('Error saving booking:', err);
      return res.status(500).json({
        error:
          err instanceof Error
            ? err.message
            : 'Failed to save booking to database. Please try again.',
      });
    }
  });

  // 4. Public Course Enquiries Submission
  app.post('/api/course-enquiries', async (req, res) => {
    try {
      const result = await createCourseEnquiryRecord(req.body);
      if (result.status !== 201 || !result.enquiry) {
        return res.status(result.status).json({ error: result.error });
      }
      return res.status(201).json({ enquiry: result.enquiry });
    } catch (err: unknown) {
      console.error('Error saving course enquiry:', err);
      return res.status(500).json({
        error:
          err instanceof Error
            ? err.message
            : 'Failed to save course enquiry. Please try again.',
      });
    }
  });

  // 5. Public Contact Form Submission
  app.post('/api/contact-messages', async (req, res) => {
    try {
      const result = await createContactMessageRecord(req.body);
      if (result.status !== 201 || !result.contactMessage) {
        return res.status(result.status).json({ error: result.error });
      }
      return res.status(201).json({ contactMessage: result.contactMessage });
    } catch (err: unknown) {
      console.error('Error saving contact message:', err);
      return res.status(500).json({
        error:
          err instanceof Error
            ? err.message
            : 'Failed to submit contact message. Please try again.',
      });
    }
  });

  /* ==================== SECURE ADMIN API ENDPOINTS ==================== */

  // Admin Login
  app.post('/api/admin/login', async (req, res) => {
    try {
      const email = String(req.body?.email || '').trim().toLowerCase();
      const password = String(req.body?.password || '');
      const clientIp = String(req.ip || req.socket.remoteAddress || 'unknown');
      const rateKey = `${clientIp}:${email}`;

      const rateCheck = checkLoginRateLimit(rateKey);
      if (!rateCheck.allowed) {
        return res.status(429).json({
          error: `Too many failed login attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.`,
        });
      }

      const authResult = await authenticateAdminUser(email, password);
      if (!authResult.valid || !authResult.user) {
        recordFailedLoginAttempt(rateKey);
        return res.status(401).json({
          error: authResult.error || 'Invalid administrator credentials.',
        });
      }

      clearLoginAttempts(rateKey);
      const session = createAdminSessionToken(authResult.user);
      return res.json({
        token: session.token,
        expiresAt: session.expiresAt,
        user: authResult.user,
      });
    } catch (err: unknown) {
      console.error('Error during admin login:', err);
      return res.status(500).json({ error: 'Authentication service error.' });
    }
  });

  // Admin Logout
  app.post('/api/admin/logout', (req, res) => {
    const token = extractBearerToken(req.headers.authorization);
    revokeAdminSessionToken(token);
    return res.json({ success: true });
  });

  // Admin Session Check
  app.get('/api/admin/session', requireAdminAuth, (req: AuthenticatedRequest, res) => {
    const wa = getWhatsAppCloudConfig();
    const defaults = getDefaultAdminCredentials();
    return res.json({
      authenticated: true,
      user: req.adminUser,
      whatsappConfigured: wa.configured,
      usingDefaultDevCredentials: defaults.isDefaultDevCredentials,
    });
  });

  // Admin Dashboard Data (Bookings, History, Enquiries, Messages, Blocked Dates, Stats)
  app.get('/api/admin/dashboard', requireAdminAuth, async (_req: AuthenticatedRequest, res) => {
    try {
      const payload = await getAdminDashboardData();
      return res.json(payload);
    } catch (err: unknown) {
      console.error('Error loading admin dashboard:', err);
      return res.status(500).json({
        error:
          err instanceof Error
            ? err.message
            : 'Failed to load admin dashboard data.',
      });
    }
  });

  // Admin Confirm Booking (+ Automatic Server-Side WhatsApp Cloud API Confirmation)
  app.post(
    '/api/admin/bookings/:id/confirm',
    requireAdminAuth,
    async (req: AuthenticatedRequest, res) => {
      try {
        const bookingId = String(req.params.id || '');
        const notes = String(req.body?.notes || '');
        const adminEmail = req.adminUser?.email || 'admin';
        const result = await confirmBookingByAdmin(bookingId, adminEmail, notes);
        if (result.status !== 200 || !result.booking) {
          return res.status(result.status).json({ error: result.error });
        }
        return res.json({
          booking: result.booking,
          historyEntry: result.historyEntry,
        });
      } catch (err: unknown) {
        console.error('Error confirming booking:', err);
        return res.status(500).json({
          error:
            err instanceof Error
              ? err.message
              : 'Failed to confirm booking.',
        });
      }
    }
  );

  // Admin Retry WhatsApp Cloud API Message
  app.post(
    '/api/admin/bookings/:id/whatsapp-retry',
    requireAdminAuth,
    async (req: AuthenticatedRequest, res) => {
      try {
        const bookingId = String(req.params.id || '');
        const adminEmail = req.adminUser?.email || 'admin';
        const result = await retryBookingWhatsAppConfirmation(bookingId, adminEmail);
        if (result.status !== 200 || !result.booking) {
          return res.status(result.status).json({ error: result.error });
        }
        return res.json({
          booking: result.booking,
          historyEntry: result.historyEntry,
        });
      } catch (err: unknown) {
        console.error('Error retrying WhatsApp confirmation:', err);
        return res.status(500).json({
          error:
            err instanceof Error
              ? err.message
              : 'Failed to retry WhatsApp confirmation.',
        });
      }
    }
  );

  // Admin Reject Booking
  app.post(
    '/api/admin/bookings/:id/reject',
    requireAdminAuth,
    async (req: AuthenticatedRequest, res) => {
      try {
        const bookingId = String(req.params.id || '');
        const reason = String(req.body?.reason || '');
        const adminEmail = req.adminUser?.email || 'admin';
        const result = await rejectBookingByAdmin(bookingId, adminEmail, reason);
        if (result.status !== 200 || !result.booking) {
          return res.status(result.status).json({ error: result.error });
        }
        return res.json({
          booking: result.booking,
          historyEntry: result.historyEntry,
        });
      } catch (err: unknown) {
        console.error('Error rejecting booking:', err);
        return res.status(500).json({
          error:
            err instanceof Error
              ? err.message
              : 'Failed to reject booking.',
        });
      }
    }
  );

  // Admin Reschedule Booking
  app.post(
    '/api/admin/bookings/:id/reschedule',
    requireAdminAuth,
    async (req: AuthenticatedRequest, res) => {
      try {
        const bookingId = String(req.params.id || '');
        const adminEmail = req.adminUser?.email || 'admin';
        const result = await rescheduleBookingByAdmin(
          bookingId,
          {
            appointment_date: String(req.body?.appointment_date || ''),
            appointment_time: String(req.body?.appointment_time || ''),
            location_id: req.body?.location_id
              ? String(req.body.location_id)
              : undefined,
            notes: req.body?.notes ? String(req.body.notes) : undefined,
          },
          adminEmail
        );
        if (result.status !== 200 || !result.booking) {
          return res.status(result.status).json({ error: result.error });
        }
        return res.json({
          booking: result.booking,
          historyEntry: result.historyEntry,
        });
      } catch (err: unknown) {
        console.error('Error rescheduling booking:', err);
        return res.status(500).json({
          error:
            err instanceof Error
              ? err.message
              : 'Failed to reschedule booking.',
        });
      }
    }
  );

  // Admin Add Blocked Date
  app.post(
    '/api/admin/blocked-dates',
    requireAdminAuth,
    async (req: AuthenticatedRequest, res) => {
      try {
        const adminEmail = req.adminUser?.email || 'admin';
        const result = await addBlockedDateByAdmin(
          {
            location_id: String(req.body?.location_id || 'all'),
            blocked_date: String(req.body?.blocked_date || ''),
            reason: String(req.body?.reason || ''),
          },
          adminEmail
        );
        if (result.status !== 201 || !result.blockedDate) {
          return res.status(result.status).json({ error: result.error });
        }
        return res.status(201).json({ blockedDate: result.blockedDate });
      } catch (err: unknown) {
        console.error('Error adding blocked date:', err);
        return res.status(500).json({ error: 'Failed to add blocked date.' });
      }
    }
  );

  // Admin Remove Blocked Date
  app.delete(
    '/api/admin/blocked-dates/:id',
    requireAdminAuth,
    async (req: AuthenticatedRequest, res) => {
      try {
        const result = await removeBlockedDateByAdmin(String(req.params.id || ''));
        if (result.status !== 200) {
          return res.status(result.status).json({ error: result.error });
        }
        return res.json({ success: true });
      } catch (err: unknown) {
        console.error('Error removing blocked date:', err);
        return res.status(500).json({ error: 'Failed to remove blocked date.' });
      }
    }
  );

  // Admin Update Course Enquiry Status
  app.patch(
    '/api/admin/course-enquiries/:id',
    requireAdminAuth,
    async (req: AuthenticatedRequest, res) => {
      try {
        const status = req.body?.status as 'Received' | 'Contacted' | 'Enrolled';
        if (!['Received', 'Contacted', 'Enrolled'].includes(status)) {
          return res.status(400).json({ error: 'Invalid course enquiry status.' });
        }
        const result = await updateCourseEnquiryStatusByAdmin(
          String(req.params.id || ''),
          status
        );
        if (result.status !== 200 || !result.enquiry) {
          return res.status(result.status).json({ error: result.error });
        }
        return res.json({ enquiry: result.enquiry });
      } catch (err: unknown) {
        console.error('Error updating course enquiry:', err);
        return res.status(500).json({ error: 'Failed to update course enquiry.' });
      }
    }
  );

  // Admin Update Contact Message Status
  app.patch(
    '/api/admin/contact-messages/:id',
    requireAdminAuth,
    async (req: AuthenticatedRequest, res) => {
      try {
        const status = req.body?.status as 'Received' | 'Replied';
        if (!['Received', 'Replied'].includes(status)) {
          return res.status(400).json({ error: 'Invalid contact message status.' });
        }
        const result = await updateContactMessageStatusByAdmin(
          String(req.params.id || ''),
          status
        );
        if (result.status !== 200 || !result.contactMessage) {
          return res.status(result.status).json({ error: result.error });
        }
        return res.json({ contactMessage: result.contactMessage });
      } catch (err: unknown) {
        console.error('Error updating contact message:', err);
        return res.status(500).json({ error: 'Failed to update contact message.' });
      }
    }
  );

  // Unknown API route handler (never fall through to HTML for /api/*)
  app.use('/api/*', (_req, res) => {
    res.status(404).json({ error: 'API endpoint not found.' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
