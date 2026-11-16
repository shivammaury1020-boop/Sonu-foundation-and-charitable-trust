import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  sanitizeInput,
  isValidIndianOrGlobalPhone,
  isDateNotInPast,
  validateBookingStep,
  validateFullBooking,
  generateBookingId,
  formatWhatsAppBookingMessage,
  buildWhatsAppBookingUrl,
  validateCourseEnquiry,
  validateContactMessage,
  isSlotWithinBusinessHours,
  type BookingInput,
  type BookingRecord,
} from './bookingLogic.ts';
import {
  BUSINESS_INFO,
  COURSES,
  LOCATIONS,
  OFFICIAL_SOCIAL_PROFILES,
  PROPOSED_PROGRAM_TRACKS,
  SERVICES,
  SOCIAL_MEDIA_URLS,
  TIME_SLOTS,
} from '../data/siteData.ts';
import {
  addBlockedDateByAdmin,
  authenticateAdminUser,
  confirmBookingByAdmin,
  createBookingRecord,
  createContactMessageRecord,
  createCourseEnquiryRecord,
  getAdminDashboardData,
  getPublicSlotAvailability,
  rejectBookingByAdmin,
  rescheduleBookingByAdmin,
  retryBookingWhatsAppConfirmation,
} from '../server/db.ts';
import {
  createAdminSessionToken,
  hashPassword,
  revokeAdminSessionToken,
  verifyAdminSessionToken,
  verifyPassword,
} from '../server/auth.ts';

const refDate = new Date('2026-11-04T06:00:00.000Z'); // Nov 4, 2026 11:30 AM IST

test('1. sanitizeInput strips angle brackets and trims whitespace', () => {
  assert.equal(sanitizeInput('  <script>alert(1)</script> Priya  '), 'scriptalert(1)/script Priya');
  assert.equal(sanitizeInput(undefined), '');
});

test('2. isValidIndianOrGlobalPhone validates Indian phone numbers and rejects invalid strings', () => {
  assert.equal(isValidIndianOrGlobalPhone('+91 79902 34736'), true);
  assert.equal(isValidIndianOrGlobalPhone('9876543210'), true);
  assert.equal(isValidIndianOrGlobalPhone('12345'), false);
  assert.equal(isValidIndianOrGlobalPhone('abcde12345'), false);
});

test('3. Asia/Kolkata date & business hours validation works accurately', () => {
  assert.equal(isDateNotInPast('2026-11-04', refDate), true);
  assert.equal(isDateNotInPast('2026-12-15', refDate), true);
  assert.equal(isDateNotInPast('2026-11-03', refDate), false);

  assert.equal(isSlotWithinBusinessHours('10:00 AM'), true);
  assert.equal(isSlotWithinBusinessHours('07:30 PM'), true);
  assert.equal(isSlotWithinBusinessHours('09:00 PM'), false);
});

test('4. validateBookingStep returns exact validation messages for missing selections', () => {
  const emptyInput: BookingInput = {
    location_id: '',
    service_id: '',
    appointment_date: '',
    appointment_time: '',
    customer_name: '',
    phone: '',
    whatsapp_number: '',
    email: '',
    message: '',
  };

  assert.deepEqual(validateBookingStep(1, emptyInput, refDate), {
    valid: false,
    error: 'Please select a location.',
  });

  const step2Input = { ...emptyInput, location_id: 'location-1' };
  assert.deepEqual(validateBookingStep(2, step2Input, refDate), {
    valid: false,
    error: 'Please select a service.',
  });
});

test('5. validateFullBooking blocks both same-customer duplicates AND second-customer slot conflicts', () => {
  const validInput: BookingInput = {
    location_id: 'location-1',
    service_id: SERVICES[0].id,
    appointment_date: '2026-11-20',
    appointment_time: TIME_SLOTS[2],
    customer_name: 'Anjali Patel',
    phone: '9876543210',
    whatsapp_number: '9876543210',
    email: 'anjali@example.com',
    message: 'Bridal trial enquiry',
  };

  assert.equal(validateFullBooking(validInput, [], refDate).valid, true);

  const existingRecord: BookingRecord = {
    ...validInput,
    id: 'bk-1',
    booking_id: 'SBS-20261104-1234',
    location_name: 'Sonu’s Beauty Studio & Academy — Location 1',
    service_name: SERVICES[0].name,
    status: 'Pending Confirmation',
    created_at: new Date().toISOString(),
  };

  // Same customer duplicate
  const dupCheck = validateFullBooking(validInput, [existingRecord], refDate);
  assert.equal(dupCheck.valid, false);
  assert.equal(dupCheck.code, 'DUPLICATE');

  // Different customer trying to book the SAME location + date + time slot (even for a different service)
  const secondCustomerInput: BookingInput = {
    ...validInput,
    service_id: SERVICES[1].id,
    customer_name: 'Meera Shah',
    phone: '9123456789',
    whatsapp_number: '9123456789',
  };
  const slotCheck = validateFullBooking(secondCustomerInput, [existingRecord], refDate);
  assert.equal(slotCheck.valid, false);
  assert.equal(slotCheck.code, 'SLOT_UNAVAILABLE');
});

test('6. formatWhatsAppBookingMessage and buildWhatsAppBookingUrl use the official business WhatsApp number and Pending Confirmation', () => {
  const sample = {
    customer_name: 'Kavita Shah',
    service_name: 'KeraSmooth',
    appointment_date: '2026-11-25',
    appointment_time: '02:30 PM',
    location_name: 'Sonu’s Beauty Studio & Academy — Location 1',
    booking_id: 'SBS-20261104-4821',
  };

  const msg = formatWhatsAppBookingMessage(sample);
  assert.equal(msg.includes('SBS-20261104-4821'), true);
  assert.equal(msg.includes('Pending Confirmation'), true);

  const url = buildWhatsAppBookingUrl(sample);
  assert.equal(url.startsWith(`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=`), true);
});

test('7. siteData contains all 36 actual client services, 9 academy courses, and separate Location 1 & Location 2 schema', () => {
  assert.equal(SERVICES.length, 36);
  assert.equal(COURSES.length, 9);
  assert.equal(LOCATIONS.length, 2);
  assert.equal(LOCATIONS[1].coordinates, '22.305021, 73.210297');
  const proposedNames = PROPOSED_PROGRAM_TRACKS.map((track) => track.name);
  assert.equal(proposedNames.includes('MS Word'), false);
  assert.equal(proposedNames.includes('MS Excel'), false);
  assert.equal(proposedNames.includes('MS PowerPoint'), false);
  assert.equal(proposedNames.includes('Internet and Digital Skills'), false);
  assert.equal(proposedNames.includes('Practical Computer Training'), false);
  assert.equal(proposedNames.includes('Basic Computer Training'), true);
  assert.equal(PROPOSED_PROGRAM_TRACKS.length, 12);
});

test('8. Admin authentication: scrypt hashing, HMAC token creation, verification, and logout revocation', () => {
  const hash = hashPassword('MySecurePass#2026');
  assert.equal(verifyPassword('MySecurePass#2026', hash), true);
  assert.equal(verifyPassword('WrongPassword', hash), false);

  const session = createAdminSessionToken({
    id: 'adm-1',
    email: 'admin@sonusbeautystudio.com',
    name: 'Admin',
    role: 'super_admin',
  });
  const verified = verifyAdminSessionToken(session.token);
  assert.ok(verified);
  assert.equal(verified?.email, 'admin@sonusbeautystudio.com');

  // Revoke token on logout
  assert.equal(revokeAdminSessionToken(session.token), true);
  assert.equal(verifyAdminSessionToken(session.token), null);
});

test('9. Full workflow: slot protection, race-condition locking, admin confirm, WhatsApp Not Configured / Sent / Failed + Retry, reschedule, reject, and non-PII slot availability', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sbs-test-'));
  const testDbFile = path.join(tmpDir, 'studio-db.json');

  try {
    // 1. Admin authentication check
    const badLogin = await authenticateAdminUser('admin@sonusbeautystudio.com', 'wrong', {
      dbFilePath: testDbFile,
    });
    assert.equal(badLogin.valid, false);

    const goodLogin = await authenticateAdminUser(
      'admin@sonusbeautystudio.com',
      'SonuAdmin@2026!',
      { dbFilePath: testDbFile }
    );
    assert.equal(goodLogin.valid, true);

    // 2. Concurrent race condition slot protection test:
    // Fire two concurrent booking requests for the exact same (location, date, time) from two different customers
    const bookingReqA: BookingInput = {
      location_id: 'location-1',
      service_id: SERVICES[0].id,
      appointment_date: '2026-11-28',
      appointment_time: TIME_SLOTS[3],
      customer_name: 'Riya Desai',
      phone: '9876543210',
      whatsapp_number: '9876543210',
      email: 'riya@example.com',
      message: 'First customer',
    };
    const bookingReqB: BookingInput = {
      location_id: 'location-1',
      service_id: SERVICES[1].id,
      appointment_date: '2026-11-28',
      appointment_time: TIME_SLOTS[3],
      customer_name: 'Sneha Joshi',
      phone: '9876501234',
      whatsapp_number: '9876501234',
      email: 'sneha@example.com',
      message: 'Second concurrent customer for same slot',
    };

    const [resA, resB] = await Promise.all([
      createBookingRecord(bookingReqA, { dbFilePath: testDbFile, referenceDate: refDate }),
      createBookingRecord(bookingReqB, { dbFilePath: testDbFile, referenceDate: refDate }),
    ]);

    assert.equal(resA.status, 201);
    assert.equal(resB.status, 409); // Second concurrent booking blocked by mutex + slot protection!
    assert.ok(resA.booking);

    const createdBookingId = resA.booking.booking_id;

    // 3. Public slot availability endpoint returns bookedSlots WITHOUT customer PII
    const publicSlots = await getPublicSlotAvailability('location-1', '2026-11-28', {
      dbFilePath: testDbFile,
    });
    assert.deepEqual(publicSlots.bookedSlots, [TIME_SLOTS[3]]);
    assert.equal('customer_name' in (publicSlots as object), false);

    // 4. Admin confirms booking when WhatsApp Cloud API credentials are NOT configured
    delete process.env.WHATSAPP_CLOUD_API_TOKEN;
    delete process.env.WHATSAPP_PHONE_NUMBER_ID;

    const confirmUnconfigured = await confirmBookingByAdmin(
      createdBookingId,
      'admin@sonusbeautystudio.com',
      'Confirmed by studio head',
      { dbFilePath: testDbFile }
    );
    assert.equal(confirmUnconfigured.status, 200);
    assert.equal(confirmUnconfigured.booking?.status, 'Confirmed');
    // Must report 'Not Configured', NEVER fake 'Sent'
    assert.equal(confirmUnconfigured.booking?.whatsapp_status, 'Not Configured');
    assert.equal(confirmUnconfigured.booking?.whatsapp_message_id, null);
    assert.ok(confirmUnconfigured.booking?.whatsapp_error?.includes('Not Configured') || confirmUnconfigured.booking?.whatsapp_error?.includes('not configured'));

    // 5. Simulate WhatsApp Cloud API configured -> first fails, then retry succeeds
    process.env.WHATSAPP_CLOUD_API_TOKEN = 'EAABsbCS1iHgBO1234567890validTokenStringExample';
    process.env.WHATSAPP_PHONE_NUMBER_ID = '109876543210123';

    const failedRetry = await retryBookingWhatsAppConfirmation(
      createdBookingId,
      'admin@sonusbeautystudio.com',
      {
        dbFilePath: testDbFile,
        customFetch: async () =>
          new Response(
            JSON.stringify({ error: { message: 'Temporary Graph API rate limit' } }),
            { status: 500 }
          ),
      }
    );
    assert.equal(failedRetry.status, 200);
    assert.equal(failedRetry.booking?.whatsapp_status, 'Failed');
    assert.equal(failedRetry.booking?.whatsapp_error, 'Temporary Graph API rate limit');

    const successRetry = await retryBookingWhatsAppConfirmation(
      createdBookingId,
      'admin@sonusbeautystudio.com',
      {
        dbFilePath: testDbFile,
        customFetch: async () =>
          new Response(
            JSON.stringify({ messages: [{ id: 'wamid.HBgMOTE5ODc2NTQzMjEwFQIAERgS' }] }),
            { status: 200 }
          ),
      }
    );
    assert.equal(successRetry.status, 200);
    assert.equal(successRetry.booking?.whatsapp_status, 'Sent');
    assert.equal(
      successRetry.booking?.whatsapp_message_id,
      'wamid.HBgMOTE5ODc2NTQzMjEwFQIAERgS'
    );
    assert.equal(successRetry.booking?.whatsapp_error, null);

    delete process.env.WHATSAPP_CLOUD_API_TOKEN;
    delete process.env.WHATSAPP_PHONE_NUMBER_ID;

    // 6. Admin Reschedules booking to a new slot
    const resched = await rescheduleBookingByAdmin(
      createdBookingId,
      {
        appointment_date: '2026-11-29',
        appointment_time: TIME_SLOTS[5],
        notes: 'Client requested Sunday afternoon',
      },
      'admin@sonusbeautystudio.com',
      { dbFilePath: testDbFile, referenceDate: refDate }
    );
    assert.equal(resched.status, 200);
    assert.equal(resched.booking?.status, 'Rescheduled');
    assert.equal(resched.booking?.appointment_date, '2026-11-29');
    assert.equal(resched.booking?.appointment_time, TIME_SLOTS[5]);

    // 7. Admin Rejects booking -> frees slot
    const rejected = await rejectBookingByAdmin(
      createdBookingId,
      'admin@sonusbeautystudio.com',
      'Client cancelled trip',
      { dbFilePath: testDbFile }
    );
    assert.equal(rejected.status, 200);
    assert.equal(rejected.booking?.status, 'Rejected');

    // 8. Blocked dates prevent customer bookings on that date
    const blk = await addBlockedDateByAdmin(
      {
        location_id: 'location-1',
        blocked_date: '2026-12-05',
        reason: 'Private Bridal Workshop',
      },
      'admin@sonusbeautystudio.com',
      { dbFilePath: testDbFile }
    );
    assert.equal(blk.status, 201);

    const blockedBookingAttempt = await createBookingRecord(
      {
        ...bookingReqA,
        appointment_date: '2026-12-05',
      },
      { dbFilePath: testDbFile, referenceDate: refDate }
    );
    assert.equal(blockedBookingAttempt.status, 400);
    assert.ok(blockedBookingAttempt.error?.includes('Private Bridal Workshop'));

    // 9. Course enquiry & contact message persistence
    const enq = await createCourseEnquiryRecord(
      {
        name: 'Pooja Rana',
        phone: '9876512345',
        whatsapp: '9876512345',
        email: 'pooja@example.com',
        course: 'PMU Permanent Makeup Course',
        preferred_location: 'Location 1',
        message: 'Batch inquiry',
      },
      { dbFilePath: testDbFile }
    );
    assert.equal(enq.status, 201);

    const msg = await createContactMessageRecord(
      {
        name: 'Neha Verma',
        phone: '9876598765',
        email: 'neha@example.com',
        message: 'Bridal package inquiry',
      },
      { dbFilePath: testDbFile }
    );
    assert.equal(msg.status, 201);

    // 10. Verify status history audit trail count
    const dash = await getAdminDashboardData({ dbFilePath: testDbFile });
    assert.equal(dash.stats.totalBookings, 1);
    assert.equal(dash.stats.rejectedBookings, 1);
    assert.equal(dash.statusHistory.length >= 5, true);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('10. validateCourseEnquiry and validateContactMessage enforce phone and required fields', () => {
  const validEnquiry = {
    name: 'Meera Nair',
    phone: '9876543210',
    whatsapp: '9876543210',
    email: 'meera@example.com',
    course: 'Basic Beauty Course',
    preferred_location: 'Location 1',
    message: 'Interested in next batch',
  };
  assert.equal(validateCourseEnquiry(validEnquiry).valid, true);
  assert.equal(validateCourseEnquiry({ ...validEnquiry, course: 'Fake Course' }).valid, false);

  const validMsg = {
    name: 'Sunita Rao',
    phone: '9876543210',
    email: 'sunita@example.com',
    message: 'Need bridal package details.',
  };
  assert.equal(validateContactMessage(validMsg).valid, true);
  assert.equal(validateContactMessage({ ...validMsg, message: '' }).valid, false);
});

test('11. OFFICIAL_SOCIAL_PROFILES and SOCIAL_MEDIA_URLS expose all five configurable official social links including YouTube', () => {
  assert.equal(OFFICIAL_SOCIAL_PROFILES.length, 5);
  assert.deepEqual(
    OFFICIAL_SOCIAL_PROFILES.map((p) => `${p.platformLabel} – ${p.accountName}`),
    [
      "Instagram – Sonu's Beauty Studio & Academy",
      'Instagram – Sonal Jingar',
      "Facebook – Sonu's Beauty Studio",
      'Facebook – Sonal Jingar',
      "YouTube – Sonu's Beauty Studio & Academy",
    ]
  );

  for (const profile of OFFICIAL_SOCIAL_PROFILES) {
    assert.equal(profile.url.startsWith('https://'), true);
  }
  assert.equal(
    OFFICIAL_SOCIAL_PROFILES[0].url,
    SOCIAL_MEDIA_URLS.instagramBeautyStudioAcademy
  );
  assert.equal(
    OFFICIAL_SOCIAL_PROFILES[1].url,
    SOCIAL_MEDIA_URLS.instagramSonalJingar
  );
  assert.equal(
    OFFICIAL_SOCIAL_PROFILES[2].url,
    SOCIAL_MEDIA_URLS.facebookBeautyStudio
  );
  assert.equal(
    OFFICIAL_SOCIAL_PROFILES[3].url,
    SOCIAL_MEDIA_URLS.facebookSonalJingar
  );
  assert.equal(
    OFFICIAL_SOCIAL_PROFILES[4].url,
    'https://www.youtube.com/@sonusbeautystudioacademys04582'
  );
  assert.equal(
    OFFICIAL_SOCIAL_PROFILES[4].handle,
    '@sonusbeautystudioacademys04582'
  );
});
