/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageId } from './data/siteData';
import {
  BookingInput,
  BookingRecord,
  ContactMessageRecord,
  CourseEnquiryRecord,
} from './utils/bookingLogic';
import { TopHeader, LuxuryFooter, MobileStickyBar } from './components/NavbarAndFooter';
import { HomeView } from './components/HomeView';
import {
  ServicesPageView,
  ServiceDetailsPageView,
  PricesPageView,
} from './components/ServicesAndPricesViews';
import {
  AcademyPageView,
  CoursesPageView,
  CourseDetailsPageView,
} from './components/AcademyAndCoursesViews';
import {
  BookAppointmentPageView,
  BookingConfirmationPageView,
} from './components/BookingAndConfirmationViews';
import {
  AboutPageView,
  GalleryPageView,
  ReviewsPageView,
  LocationsPageView,
  ContactPageView,
  FoundationPageView,
  PrivacyPolicyPageView,
  TermsPageView,
} from './components/OtherPagesViews';
import { AdminDashboardView } from './components/AdminDashboardView';

const PAGE_TITLES: Record<PageId, string> = {
  home: 'Sonu Foundation and Charitable Trust | Empowering Women. Transforming Lives.',
  about: 'About Our Foundation | Sonu Foundation and Charitable Trust',
  services: 'Our Programs | Sonu Foundation and Charitable Trust',
  'service-details': 'Program Details | Sonu Foundation and Charitable Trust',
  academy: 'Women Empowerment & Skill Development | Sonu Foundation and Charitable Trust',
  courses: 'Vocational Training & Academy Courses | Sonu Foundation and Charitable Trust',
  'course-details': 'Course Enquiry | Sonu Foundation and Charitable Trust',
  prices: 'Our Locations & Contact Details | Sonu Foundation and Charitable Trust',
  gallery: 'Gallery | Sonu Foundation and Charitable Trust',
  reviews: 'Community Voices | Sonu Foundation and Charitable Trust',
  locations: 'Our Locations in Vadodara | Sonu Foundation and Charitable Trust',
  book: 'Program Enquiry | Sonu Foundation and Charitable Trust',
  'booking-confirmation': 'Enquiry Received | Sonu Foundation and Charitable Trust',
  contact: 'Contact Us | Sonu Foundation and Charitable Trust',
  foundation: 'Our Mission | Sonu Foundation and Charitable Trust',
  privacy: 'Privacy Policy | Sonu Foundation and Charitable Trust',
  terms: 'Terms & Conditions | Sonu Foundation and Charitable Trust',
  admin: 'Admin Dashboard | Sonu Foundation and Charitable Trust',
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(() => {
    if (window.location.pathname.startsWith('/admin')) {
      return 'admin';
    }
    const params = new URLSearchParams(window.location.search);
    const p = params.get('page') as PageId | null;
    return p && p in PAGE_TITLES ? p : 'home';
  });
  const [detailParam, setDetailParam] = useState<string | undefined>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || undefined;
  });

  const [bookingPrefill, setBookingPrefill] = useState<Partial<BookingInput>>({});
  const [latestBooking, setLatestBooking] = useState<BookingRecord | null>(() => {
    try {
      // Remove any legacy public booking list cache from localStorage for customer privacy
      localStorage.removeItem('sbs_public_bookings');
      const savedReceipt = sessionStorage.getItem('sbs_latest_booking_receipt');
      return savedReceipt ? (JSON.parse(savedReceipt) as BookingRecord) : null;
    } catch {
      return null;
    }
  });

  // Sync dynamic page title and scroll to top on navigation
  useEffect(() => {
    document.title = PAGE_TITLES[currentPage] || PAGE_TITLES.home;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, detailParam]);

  const handleNavigate = (page: PageId, param?: string) => {
    setCurrentPage(page);
    setDetailParam(param);
    try {
      const url = new URL(window.location.href);
      if (url.pathname.startsWith('/admin') && page !== 'admin') {
        url.pathname = '/';
      }
      if (page === 'home') {
        url.searchParams.delete('page');
        url.searchParams.delete('id');
      } else {
        url.searchParams.set('page', page);
        if (param) {
          url.searchParams.set('id', param);
        } else {
          url.searchParams.delete('id');
        }
      }
      window.history.pushState({}, '', url.toString());
    } catch {
      // Ignore history API restrictions in sandboxed frames
    }
  };

  const handleQuickBookStart = (prefill: Partial<BookingInput>) => {
    setBookingPrefill(prefill);
    handleNavigate('book');
  };

  const handleBookingCreated = (record: BookingRecord) => {
    setLatestBooking(record);
    try {
      sessionStorage.setItem('sbs_latest_booking_receipt', JSON.stringify(record));
    } catch {
      // Ignore storage quota errors
    }
    handleNavigate('booking-confirmation');
  };

  const handleSaveCourseEnquiry = (_record: CourseEnquiryRecord) => {
    // Course enquiry is persisted securely on the backend database via POST /api/course-enquiries
  };

  const handleSaveContactMessage = (_record: ContactMessageRecord) => {
    // Contact message is persisted securely on the backend database via POST /api/contact-messages
  };

  // Separate Admin Portal layout
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF5EF] text-[#201B1D]">
        <main className="flex-1">
          <AdminDashboardView onNavigate={handleNavigate} />
        </main>
        <LuxuryFooter onNavigate={handleNavigate} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF5EF] text-[#201B1D] pb-14 sm:pb-0">
      <TopHeader currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onQuickBookStart={handleQuickBookStart}
          />
        )}

        {currentPage === 'about' && <AboutPageView onNavigate={handleNavigate} />}

        {currentPage === 'services' && (
          <ServicesPageView
            initialCategory={detailParam}
            onNavigate={handleNavigate}
            onBookService={(serviceId) => handleQuickBookStart({ service_id: serviceId })}
          />
        )}

        {currentPage === 'service-details' && (
          <ServiceDetailsPageView
            serviceId={detailParam}
            onNavigate={handleNavigate}
            onBookService={(serviceId) => handleQuickBookStart({ service_id: serviceId })}
          />
        )}

        {currentPage === 'academy' && (
          <AcademyPageView
            onNavigate={handleNavigate}
            onSaveCourseEnquiry={handleSaveCourseEnquiry}
          />
        )}

        {currentPage === 'courses' && (
          <CoursesPageView
            onNavigate={handleNavigate}
            onSaveCourseEnquiry={handleSaveCourseEnquiry}
          />
        )}

        {currentPage === 'course-details' && (
          <CourseDetailsPageView
            courseId={detailParam}
            onNavigate={handleNavigate}
            onSaveCourseEnquiry={handleSaveCourseEnquiry}
          />
        )}

        {currentPage === 'prices' && (
          <PricesPageView
            onNavigate={handleNavigate}
            onBookService={(serviceId) => handleQuickBookStart({ service_id: serviceId })}
          />
        )}

        {currentPage === 'gallery' && <GalleryPageView onNavigate={handleNavigate} />}

        {currentPage === 'reviews' && <ReviewsPageView onNavigate={handleNavigate} />}

        {currentPage === 'locations' && (
          <LocationsPageView
            onNavigate={handleNavigate}
            onQuickBookLocation={(locId) => handleQuickBookStart({ location_id: locId })}
          />
        )}

        {currentPage === 'book' && (
          <BookAppointmentPageView
            initialPrefill={bookingPrefill}
            onBookingCreated={handleBookingCreated}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'booking-confirmation' && (
          <BookingConfirmationPageView
            booking={latestBooking}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPageView
            onNavigate={handleNavigate}
            onSaveContactMessage={handleSaveContactMessage}
          />
        )}

        {currentPage === 'foundation' && <FoundationPageView onNavigate={handleNavigate} />}

        {currentPage === 'privacy' && <PrivacyPolicyPageView onNavigate={handleNavigate} />}

        {currentPage === 'terms' && <TermsPageView onNavigate={handleNavigate} />}
      </main>

      <LuxuryFooter onNavigate={handleNavigate} />
      <MobileStickyBar currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
}
