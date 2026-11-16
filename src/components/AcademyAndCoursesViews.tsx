import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Award,
  BookOpen,
  Users,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  Send,
  AlertCircle,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import {
  BUSINESS_INFO,
  COURSES,
  COURSE_CATEGORIES,
  CourseCategory,
  CourseItem,
  GALLERY_ITEMS,
  LOCATIONS,
  PageId,
  PROPOSED_PROGRAM_TRACKS,
  ProposedCourseTrack,
} from '../data/siteData';
import {
  CourseEnquiryInput,
  CourseEnquiryRecord,
  buildWhatsAppGeneralUrl,
  submitCourseEnquiryToServer,
  validateCourseEnquiry,
} from '../utils/bookingLogic';

interface AcademyProps {
  onNavigate: (page: PageId, param?: string) => void;
  onSaveCourseEnquiry: (record: CourseEnquiryRecord) => void;
}

export const CourseEnquiryFormBlock: React.FC<{
  defaultCourseName?: string;
  onSaveCourseEnquiry: (record: CourseEnquiryRecord) => void;
}> = ({ defaultCourseName = '', onSaveCourseEnquiry }) => {
  const [form, setForm] = useState<CourseEnquiryInput>({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    course: defaultCourseName || COURSES[0].name,
    preferred_location: LOCATIONS[0].shortLabel,
    message: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<CourseEnquiryRecord | null>(null);

  useEffect(() => {
    if (defaultCourseName) {
      setForm((prev) => ({ ...prev, course: defaultCourseName }));
    }
  }, [defaultCourseName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);

    const validation = validateCourseEnquiry(form);
    if (!validation.valid) {
      setError(validation.error || 'Please check your form details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const saved = await submitCourseEnquiryToServer(form);
      onSaveCourseEnquiry(saved);
      setIsSubmitting(false);
      setSubmittedRecord(saved);
    } catch (err: unknown) {
      setIsSubmitting(false);
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save your course enquiry. Please try again.'
      );
    }
  };

  if (submittedRecord) {
    const waText = [
      'Hello Sonu Foundation and Charitable Trust,',
      'I have submitted a course enquiry on your website.',
      `Enquiry ID: ${submittedRecord.enquiry_id}`,
      `Student Name: ${submittedRecord.name}`,
      `Phone: ${submittedRecord.phone}`,
      `WhatsApp: ${submittedRecord.whatsapp}`,
      submittedRecord.email ? `Email: ${submittedRecord.email}` : '',
      `Selected Course: ${submittedRecord.course}`,
      `Preferred Location: ${submittedRecord.preferred_location}`,
      submittedRecord.message ? `Message: ${submittedRecord.message}` : '',
      'Please share course details. Thank you.',
    ]
      .filter(Boolean)
      .join('\n');

    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#C8A15A]/50 shadow-md text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#6B173D]/10 text-[#6B173D] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6 text-[#6B173D]" />
        </div>
        <h3 className="font-serif-luxury text-2xl font-bold text-[#201B1D]">
          Course Enquiry Submitted
        </h3>
        <p className="text-sm sm:text-base text-[#201B1D] font-medium max-w-lg mx-auto">
          Thank you for your interest in Sonu Foundation and Charitable Trust. Our team will contact you about the course and training details.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={buildWhatsAppGeneralUrl(waText)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[#E6C98F]" />
            <span>Send Course Enquiry on WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => setSubmittedRecord(null)}
            className="inline-flex items-center gap-2 bg-[#FAF5EF] hover:bg-[#F3E9DF] text-[#201B1D] border border-[#C8A15A]/40 text-sm font-medium px-5 py-3 rounded-xl cursor-pointer"
          >
            <span>Submit Another Enquiry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-2xl p-6 sm:p-8 border border-[#C8A15A]/40 shadow-sm space-y-4"
    >
      <div className="space-y-1">
        <span className="text-xs font-bold tracking-[0.15em] uppercase text-[#6B173D]">
          ADMISSIONS &amp; COURSE ENQUIRY
        </span>
        <h3 className="font-serif-luxury text-2xl font-bold text-[#201B1D]">
          Course Enquiry Form
        </h3>
        <p className="text-xs sm:text-sm text-[#6E6265]">
          Fill in your details below to receive syllabus guidance, practical training details, and admission support.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="bg-[#6B173D]/10 border border-[#6B173D]/40 text-[#4A0D29] rounded-xl p-3 text-xs sm:text-sm flex items-center gap-2 font-medium"
        >
          <AlertCircle className="w-4 h-4 text-[#6B173D] shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="enq-name" className="block text-xs font-semibold text-[#201B1D] mb-1">
            Student Name *
          </label>
          <input
            id="enq-name"
            type="text"
            required
            placeholder="Enter student full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-[#C8A15A]/45 bg-[#FAF5EF] px-3.5 py-2.5 text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
          />
        </div>

        <div>
          <label htmlFor="enq-phone" className="block text-xs font-semibold text-[#201B1D] mb-1">
            Phone Number *
          </label>
          <input
            id="enq-phone"
            type="tel"
            required
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-xl border border-[#C8A15A]/45 bg-[#FAF5EF] px-3.5 py-2.5 text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
          />
        </div>

        <div>
          <label htmlFor="enq-whatsapp" className="block text-xs font-semibold text-[#201B1D] mb-1">
            WhatsApp Number
          </label>
          <input
            id="enq-whatsapp"
            type="tel"
            placeholder="Same as phone or enter WhatsApp number"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            className="w-full rounded-xl border border-[#C8A15A]/45 bg-[#FAF5EF] px-3.5 py-2.5 text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
          />
        </div>

        <div>
          <label htmlFor="enq-email" className="block text-xs font-semibold text-[#201B1D] mb-1">
            Email
          </label>
          <input
            id="enq-email"
            type="email"
            placeholder="student@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-[#C8A15A]/45 bg-[#FAF5EF] px-3.5 py-2.5 text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
          />
        </div>

        <div>
          <label htmlFor="enq-course" className="block text-xs font-semibold text-[#201B1D] mb-1">
            Select Course *
          </label>
          <select
            id="enq-course"
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
            className="w-full rounded-xl border border-[#C8A15A]/45 bg-[#FAF5EF] px-3.5 py-2.5 text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
          >
            {COURSES.map((c) => (
              <option key={c.id} value={c.name}>
                {c.courseNumber}. {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="enq-location" className="block text-xs font-semibold text-[#201B1D] mb-1">
            Preferred Location *
          </label>
          <select
            id="enq-location"
            value={form.preferred_location}
            onChange={(e) => setForm({ ...form, preferred_location: e.target.value })}
            className="w-full rounded-xl border border-[#C8A15A]/45 bg-[#FAF5EF] px-3.5 py-2.5 text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.shortLabel}>
                {loc.shortLabel}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="enq-message" className="block text-xs font-semibold text-[#201B1D] mb-1">
          Message
        </label>
        <textarea
          id="enq-message"
          rows={3}
          placeholder="Tell us about your learning goals or questions about the course..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-xl border border-[#C8A15A]/45 bg-[#FAF5EF] px-3.5 py-2.5 text-sm text-[#201B1D] focus:outline-none focus:border-[#6B173D]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4 text-[#E6C98F]" />
          <span>{isSubmitting ? 'Submitting...' : 'Submit Course Enquiry'}</span>
        </button>

        <a
          href={buildWhatsAppGeneralUrl(
            [
              'Hello Sonu Foundation and Charitable Trust,',
              `I would like to enquire about the ${form.course}.`,
              form.name ? `Student Name: ${form.name}` : '',
              `Preferred Location: ${form.preferred_location}`,
            ]
              .filter(Boolean)
              .join('\n')
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#FAF5EF] hover:bg-[#F3E9DF] text-[#4A0D29] border border-[#C8A15A]/50 text-sm font-semibold px-5 py-3 rounded-xl transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-[#6B173D]" />
          <span>Enquire on WhatsApp</span>
        </a>
      </div>
    </form>
  );
};

export const ProposedCourseCardItem: React.FC<{
  course: ProposedCourseTrack;
  onSelectCourse: (courseName: string) => void;
}> = ({ course, onSelectCourse }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#C8A15A]/35 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
      <div>
        <div className="relative w-full h-52 overflow-hidden bg-[#F3E9DF]">
          <img
            src={course.image}
            alt={course.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover ${
              course.id === 'beauty-makeup-nail-art-training'
                ? 'object-[center_80%]'
                : course.id === 'beauty-makeup-skin-care-training'
                ? 'object-[center_10%]'
                : course.id === 'beauty-makeup-hair-styling-training'
                ? 'object-[center_65%]'
                : 'object-top'
            } hover:scale-105 transition-transform duration-300`}
          />
          <span className="absolute top-3 left-3 bg-[#4A0D29]/90 text-[#FAF5EF] text-[11px] font-bold px-3 py-1 rounded-full border border-[#C8A15A]/50">
            {course.category}
          </span>
        </div>

        <div className="p-5 sm:p-6 space-y-3.5">
          <div>
            <h3 className="font-serif-luxury text-xl font-bold text-[#201B1D]">
              {course.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#6E6265] leading-relaxed mt-1.5">
              {course.shortDescription}
            </p>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#C8A15A]/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A0D29]">
              Skills Focus
            </h4>
            <ul className="space-y-1 text-xs text-[#201B1D]/90">
              {course.skills.slice(0, 4).map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A15A] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#FAF5EF] rounded-xl p-3 border border-[#C8A15A]/30 text-[11px] text-[#6E6265] leading-snug">
            {course.confirmationNote}
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-[#C8A15A]/20">
        <button
          type="button"
          onClick={() => onSelectCourse(course.name)}
          className="w-full py-2.5 px-3 rounded-xl bg-[#6B173D] hover:bg-[#4A0D29] text-white text-xs font-semibold cursor-pointer"
        >
          Enquire About This Course
        </button>
      </div>
    </div>
  );
};

export const CourseDetailCardItem: React.FC<{
  course: CourseItem;
  onSelectCourse: (course: CourseItem) => void;
  onViewDetails: (courseId: string) => void;
}> = ({ course, onSelectCourse, onViewDetails }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#C8A15A]/35 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
      <div>
        <button
          type="button"
          onClick={() => onViewDetails(course.id)}
          className="relative w-full h-52 overflow-hidden bg-[#F3E9DF] block text-left"
        >
          <img
            src={course.image}
            alt={course.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover ${
              course.id === 'eyelashes-course' ? 'object-center' : 'object-top'
            } hover:scale-105 transition-transform duration-300`}
          />
          <span className="absolute top-3 left-3 bg-[#4A0D29]/90 text-[#FAF5EF] text-[11px] font-bold px-3 py-1 rounded-full border border-[#C8A15A]/50">
            Course {String(course.courseNumber).padStart(2, '0')}
          </span>
        </button>

        <div className="p-5 sm:p-6 space-y-3.5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B173D]">
              {course.category}
            </span>
            <button
              type="button"
              onClick={() => onViewDetails(course.id)}
              className="block text-left mt-0.5"
            >
              <h3 className="font-serif-luxury text-xl font-bold text-[#201B1D] hover:text-[#6B173D] transition-colors">
                {course.name}
              </h3>
            </button>
            <p className="text-xs sm:text-sm text-[#6E6265] leading-relaxed mt-1.5">
              {course.description}
            </p>
          </div>

          {/* What Students Will Learn */}
          <div className="space-y-1.5 pt-2 border-t border-[#C8A15A]/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A0D29]">
              What Students Will Learn
            </h4>
            <ul className="space-y-1 text-xs text-[#201B1D]/90">
              {course.syllabus.slice(0, 4).map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A15A] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Practical Training Info */}
          <div className="space-y-1 pt-2 border-t border-[#C8A15A]/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A0D29]">
              Practical Training
            </h4>
            <p className="text-xs text-[#6E6265]">
              {course.practicalFocus.join(' · ')}
            </p>
          </div>

          {/* Certification Information */}
          <div className="bg-[#FAF5EF] rounded-xl p-3 border border-[#C8A15A]/30 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A0D29]">
              <Award className="w-4 h-4 text-[#C8A15A] shrink-0" />
              <span>{course.certification}</span>
            </div>
            <p className="text-[11px] text-[#6E6265] leading-snug">
              {course.certificationNote}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-[#C8A15A]/20 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => onViewDetails(course.id)}
          className="py-2.5 px-3 rounded-xl border border-[#C8A15A]/45 bg-[#FAF5EF] hover:bg-[#F3E9DF] text-xs font-semibold text-[#201B1D] cursor-pointer"
        >
          Course Details
        </button>
        <button
          type="button"
          onClick={() => onSelectCourse(course)}
          className="py-2.5 px-3 rounded-xl bg-[#6B173D] hover:bg-[#4A0D29] text-white text-xs font-semibold cursor-pointer"
        >
          Enquire Now
        </button>
      </div>
    </div>
  );
};

export const AcademyPageView: React.FC<AcademyProps> = ({
  onNavigate,
  onSaveCourseEnquiry,
}) => {
  const [selectedEnquiryCourse, setSelectedEnquiryCourse] = useState<string>(
    COURSES[0].name
  );

  const studentGallery = GALLERY_ITEMS.filter(
    (g) => g.category === 'Academy' || g.category === 'Students' || g.category === 'Certificates'
  );

  const handleEnquireCourse = (course: CourseItem) => {
    setSelectedEnquiryCourse(course.name);
    const el = document.getElementById('academy-enquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#FAF5EF] space-y-14 py-10 sm:py-14">
      {/* 1. Academy Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#6B173D] to-[#4A0D29] text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#C8A15A]/45 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase text-[#E6C98F]">
              <GraduationCap className="w-4 h-4" />
              <span>SONU’S BEAUTY STUDIO &amp; ACADEMY • VADODARA</span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold leading-tight text-balance">
              Build Your Career in the Beauty Industry
            </h1>
            <p className="text-sm sm:text-base text-[#FAF5EF]/85 leading-relaxed max-w-xl">
              Professional training, practical learning, and personal guidance for aspiring beauty professionals across our 9 specialized academy courses in Vadodara, Gujarat.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs sm:text-sm">
              {[
                'Professional Training',
                'Hands-on Practice',
                'Expert Guidance',
                'Practical Sessions',
                'Government Certificate',
                'ISO-Related Certification',
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-[#FAF5EF]">
                  <CheckCircle2 className="w-4 h-4 text-[#E6C98F] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => onNavigate('courses')}
                className="inline-flex items-center gap-2 bg-[#E6C98F] hover:bg-[#C8A15A] text-[#201B1D] text-sm font-bold px-6 py-3.5 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <span>Explore All 9 Courses</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#academy-enquiry"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-[#C8A15A]/50 text-sm font-semibold px-6 py-3.5 rounded-xl transition-colors"
              >
                <span>Enquire Now</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <img
              src="/assets/aistudio/12_a402bff7.jpeg"
              alt="Classroom training session at Sonu Foundation and Charitable Trust"
              referrerPolicy="no-referrer"
              className="w-full h-44 sm:h-52 object-cover object-[center_60%] rounded-2xl border border-[#C8A15A]/50 col-span-2"
            />
            <video
              src="/assets/aistudio/6_93eb0fc1.mp4"
              poster="/assets/videos/certificate-batch-video-thumb.jpg"
              muted
              loop
              autoPlay
              playsInline
              controls
              className="w-full h-36 object-cover object-[center_55%] rounded-2xl border border-[#C8A15A]/50 bg-[#201B1D]"
            />
            <img
              src="/assets/aistudio/8_7b92f75e.jpeg"
              alt="Certificate distribution ceremony at Sonu’s Beauty Academy"
              referrerPolicy="no-referrer"
              className="w-full h-36 object-cover object-top rounded-2xl border border-[#C8A15A]/50"
            />
          </div>
        </div>
      </section>

      {/* 2. Dedicated Certification Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#C8A15A]/45 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold tracking-[0.18em] uppercase text-[#6B173D]">
              ACADEMY CERTIFICATION
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#201B1D]">
              Government Certificate &amp; ISO-Related Certification
            </h2>
            <p className="text-sm sm:text-base text-[#6E6265] leading-relaxed">
              Sonu’s Beauty Studio &amp; Academy provides practical studio training followed by certification upon course completion to support students in their beauty careers and independent salon ventures.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="bg-[#FAF5EF] p-4 rounded-2xl border border-[#C8A15A]/40 flex items-start gap-3">
                <Award className="w-6 h-6 text-[#6B173D] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-[#201B1D]">
                    Government Certificate
                  </h3>
                  <p className="text-xs text-[#6E6265] mt-0.5">
                    Provided to students upon completion of their academy training program.
                  </p>
                </div>
              </div>

              <div className="bg-[#FAF5EF] p-4 rounded-2xl border border-[#C8A15A]/40 flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-[#6B173D] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-[#201B1D]">
                    ISO-Related Certification
                  </h3>
                  <p className="text-xs text-[#6E6265] mt-0.5">
                    Professional academy certification supporting your beauty career portfolio.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#F6EFE7] rounded-xl p-4 border border-[#C8A15A]/45 text-xs sm:text-sm font-medium text-[#4A0D29]">
              {BUSINESS_INFO.certificationDisclaimer}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#F6EFE7] p-4 rounded-2xl border border-[#C8A15A]/40 space-y-3">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.36_bd9ccbf9.jpeg"
                alt="Graduating students holding certificates at Sonu Foundation and Charitable Trust"
                referrerPolicy="no-referrer"
                className="w-full h-60 sm:h-64 object-cover rounded-xl border border-[#C8A15A]/35"
              />
              <div className="flex items-center justify-between text-xs text-[#4A0D29] font-medium px-1">
                <span>Certified Academy Graduates • Vadodara</span>
                <button
                  type="button"
                  onClick={() => onNavigate('gallery')}
                  className="underline hover:text-[#6B173D] cursor-pointer"
                >
                  View Student Gallery →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Proposed Skill Development Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#6B173D]">
            PROPOSED PROGRAM CATEGORIES
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#201B1D]">
            Beauty, Sewing & Computer Learning Tracks
          </h2>
          <p className="text-sm sm:text-base text-[#6E6265] max-w-3xl">
            These training categories are proposed learning pathways and are subject to final confirmation by the foundation team before enrolment. Each track includes a short description and enquiry option for prospective students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROPOSED_PROGRAM_TRACKS.map((course) => (
            <ProposedCourseCardItem
              key={course.id}
              course={course}
              onSelectCourse={(courseName) => {
                setSelectedEnquiryCourse(courseName);
                const el = document.getElementById('academy-enquiry');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      </section>

      {/* 4. All 9 Actual Academy Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#6B173D]">
              ACADEMY — ACTUAL COURSES (01 – 09)
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#201B1D]">
              Our Beauty Academy Courses
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('courses')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B173D] hover:underline cursor-pointer"
          >
            <span>Filter &amp; Compare Courses</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map((course) => (
            <CourseDetailCardItem
              key={course.id}
              course={course}
              onSelectCourse={handleEnquireCourse}
              onViewDetails={(id) => onNavigate('course-details', id)}
            />
          ))}
        </div>
      </section>

      {/* 4. Student Practice & Certificate Distribution Gallery Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#201B1D] text-center">
          Student Practice &amp; Certificate Distribution
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {studentGallery.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#C8A15A]/35 shadow-sm"
            >
              <img
                src={item.src}
                alt={item.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-48 object-cover object-top"
              />
              <div className="p-3.5">
                <h3 className="font-serif-luxury text-sm font-bold text-[#201B1D]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#6E6265] mt-0.5">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Course Enquiry Form */}
      <section id="academy-enquiry" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <CourseEnquiryFormBlock
          defaultCourseName={selectedEnquiryCourse}
          onSaveCourseEnquiry={onSaveCourseEnquiry}
        />
      </section>
    </div>
  );
};

export const CoursesPageView: React.FC<AcademyProps> = ({
  onNavigate,
  onSaveCourseEnquiry,
}) => {
  const [selectedCat, setSelectedCat] = useState<'All' | CourseCategory>('All');
  const [selectedEnquiryCourse, setSelectedEnquiryCourse] = useState<string>(
    COURSES[0].name
  );

  const filtered =
    selectedCat === 'All'
      ? COURSES
      : COURSES.filter((c) => c.category === selectedCat);

  const handleEnquireCourse = (course: CourseItem) => {
    setSelectedEnquiryCourse(course.name);
    const el = document.getElementById('courses-page-enquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="py-10 sm:py-14 bg-[#FAF5EF] scroll-mt-[6.5rem]">
      <div id="programs-courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-[6.5rem]">
        <div className="text-center max-w-3xl mx-auto space-y-3 scroll-mt-[6.5rem]">
          <span className="text-xs font-bold tracking-[0.18em] uppercase text-[#6B173D]">
            SONU FOUNDATION AND CHARITABLE TRUST • VADODARA
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#201B1D]">
            Programs &amp; Courses
          </h1>
          <p className="text-sm sm:text-base text-[#6E6265]">
            Explore our current beauty academy courses as well as proposed learning tracks in beauty, tailoring, and computer skills. Final batch details are confirmed directly by the foundation team before admission.
          </p>
        </div>

        <div className="bg-[#F6EFE7] rounded-2xl border border-[#C8A15A]/40 p-5">
          <h2 className="font-serif-luxury text-2xl font-bold text-[#201B1D]">Proposed Learning Tracks</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {PROPOSED_PROGRAM_TRACKS.map((course) => (
              <ProposedCourseCardItem
                key={course.id}
                course={course}
                onSelectCourse={(courseName) => {
                  setSelectedEnquiryCourse(courseName);
                  const el = document.getElementById('courses-page-enquiry');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        </div>

        {/* Certification Notice Strip */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#C8A15A]/45 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-[#6B173D] shrink-0" />
            <div>
              <span className="font-serif-luxury text-base sm:text-lg font-bold text-[#201B1D] block">
                Government Certificate &amp; ISO-Related Certification
              </span>
              <span className="text-xs text-[#6E6265]">
                {BUSINESS_INFO.certificationDisclaimer}
              </span>
            </div>
          </div>
          <a
            href="#courses-page-enquiry"
            className="text-xs font-semibold bg-[#6B173D] text-white px-4 py-2.5 rounded-xl shrink-0"
          >
            Enquire About Courses
          </a>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {(['All', ...COURSE_CATEGORIES] as ('All' | CourseCategory)[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                selectedCat === cat
                  ? 'bg-[#6B173D] text-white border-[#6B173D]'
                  : 'bg-white text-[#201B1D] border-[#C8A15A]/40 hover:border-[#6B173D]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Detail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <CourseDetailCardItem
              key={course.id}
              course={course}
              onSelectCourse={handleEnquireCourse}
              onViewDetails={(id) => onNavigate('course-details', id)}
            />
          ))}
        </div>

        {/* Embedded Enquiry Form */}
        <div id="courses-page-enquiry" className="max-w-4xl mx-auto pt-4">
          <CourseEnquiryFormBlock
            defaultCourseName={selectedEnquiryCourse}
            onSaveCourseEnquiry={onSaveCourseEnquiry}
          />
        </div>
      </div>
    </div>
  );
};

export const CourseDetailsPageView: React.FC<{
  courseId?: string;
  onNavigate: (page: PageId, param?: string) => void;
  onSaveCourseEnquiry: (record: CourseEnquiryRecord) => void;
}> = ({ courseId, onNavigate, onSaveCourseEnquiry }) => {
  const course: CourseItem =
    COURSES.find((c) => c.id === courseId) || COURSES[0];

  return (
    <div className="py-10 sm:py-14 bg-[#FAF5EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <button
            type="button"
            onClick={() => onNavigate('courses')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#6B173D] hover:text-[#4A0D29] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All 9 Courses</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <img
              src={course.image}
              alt={course.name}
              referrerPolicy="no-referrer"
              className="w-full h-72 sm:h-80 object-cover object-top rounded-2xl border border-[#C8A15A]/40 shadow-md"
            />
            <div className="bg-[#4A0D29] text-white rounded-2xl p-5 border border-[#C8A15A]/40 space-y-2.5">
              <div className="flex items-center gap-2 text-[#E6C98F] font-serif-luxury text-lg font-bold">
                <Award className="w-5 h-5" />
                <span>Certification Information</span>
              </div>
              <p className="text-xs sm:text-sm text-[#FAF5EF] font-semibold">
                • Government Certificate
                <br />• ISO-Related Certification
              </p>
              <p className="text-xs text-[#FAF5EF]/85 leading-relaxed">
                {course.certificationNote}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-[#C8A15A]/35 shadow-sm space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B173D]">
                Course {String(course.courseNumber).padStart(2, '0')} · {course.category}
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#201B1D]">
                {course.name}
              </h1>
              <p className="text-sm sm:text-base text-[#6E6265] leading-relaxed">
                {course.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-semibold text-[#4A0D29]">
                <span className="bg-[#FAF5EF] px-3 py-1 rounded-lg border border-[#C8A15A]/35">
                  {course.feeNote}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-[#C8A15A]/20">
              <h2 className="font-serif-luxury text-lg font-bold text-[#201B1D]">
                What Students Will Learn
              </h2>
              <ul className="space-y-2 text-sm text-[#201B1D]/90">
                {course.syllabus.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C8A15A] shrink-0 mt-0.5" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-[#C8A15A]/20">
              <h2 className="font-serif-luxury text-lg font-bold text-[#201B1D]">
                Practical Training Information
              </h2>
              <ul className="space-y-1.5 text-sm text-[#6E6265]">
                {course.practicalFocus.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-[#C8A15A]/20">
              <h2 className="font-serif-luxury text-lg font-bold text-[#201B1D]">
                Certification &amp; Recognition
              </h2>
              <p className="text-sm text-[#6E6265]">
                {course.certification} — {course.certificationNote}
              </p>
            </div>

            <div className="pt-2">
              <a
                href="#course-detail-enquiry-form"
                className="inline-flex items-center gap-2 bg-[#6B173D] hover:bg-[#4A0D29] text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-sm transition-colors"
              >
                <span>Enquire About {course.name}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div id="course-detail-enquiry-form" className="max-w-4xl mx-auto pt-4">
          <CourseEnquiryFormBlock
            defaultCourseName={course.name}
            onSaveCourseEnquiry={onSaveCourseEnquiry}
          />
        </div>
      </div>
    </div>
  );
};
