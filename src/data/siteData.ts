export type PageId =
  | 'home'
  | 'about'
  | 'services'
  | 'service-details'
  | 'academy'
  | 'courses'
  | 'course-details'
  | 'prices'
  | 'gallery'
  | 'reviews'
  | 'locations'
  | 'book'
  | 'booking-confirmation'
  | 'contact'
  | 'foundation'
  | 'privacy'
  | 'terms'
  | 'admin';

export interface LocationItem {
  id: 'location-1' | 'location-2';
  name: string;
  shortLabel: string;
  addressLines: string[];
  cityState: string;
  phone: string;
  coordinates?: string;
  mapsUrl: string;
  mapEmbedUrl: string;
  hours: string;
  badge: string;
  schemaType: 'street-address' | 'gps-coordinates';
}

export type ServiceCategory =
  | 'Beauty & Waxing'
  | 'Hand & Foot Care'
  | 'Massage & Spa'
  | 'Hair Treatments'
  | 'Makeup'
  | 'Hairstyles'
  | 'Nail Art & Extensions';

export interface ServiceCategoryGroup {
  category: ServiceCategory;
  sectionCode: string;
  heading: string;
  tagline: string;
  image: string;
  isClientPhoto?: boolean;
  serviceNames: string[];
}

export interface ServiceItem {
  id: string;
  name: string;
  popularTitle?: string;
  popularSummary?: string;
  category: ServiceCategory;
  shortDescription: string;
  description: string;
  image: string;
  isClientPhoto?: boolean;
  iconType:
    | 'facial'
    | 'hair'
    | 'makeup'
    | 'nails'
    | 'threading'
    | 'treatments'
    | 'spa'
    | 'bridal'
    | 'waxing';
  priceLabel: string;
  durationLabel?: string;
  featuredOnHome?: boolean;
  benefits: string[];
  process: string[];
  importantNotes: string[];
}

export type CourseCategory =
  | 'Beauty Courses'
  | 'Makeup & Lashes'
  | 'Hair & Chemical'
  | 'Nails & Mehendi';

export interface CourseItem {
  id: string;
  courseNumber: number;
  name: string;
  category: CourseCategory;
  shortDescription: string;
  description: string;
  image: string;
  isClientPhoto?: boolean;
  certification: string;
  certificationNote: string;
  durationNote?: string;
  feeNote: string;
  syllabus: string[];
  practicalFocus: string[];
  whoShouldJoin: string[];
}

export type GalleryCategory =
  | 'All'
  | 'Salon'
  | 'Makeup'
  | 'Hair'
  | 'Nails'
  | 'Academy'
  | 'Students'
  | 'Certificates'
  | 'Videos';

export interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<GalleryCategory, 'All'>;
  src: string;
  videoSrc?: string;
  isCertificate?: boolean;
  isVideo?: boolean;
}

export interface ReviewItem {
  id: string;
  customerName: string;
  serviceName: string;
  rating: number;
  text: string;
  avatar?: string;
  verifiedLabel: string;
}

export interface BusinessClaimsConfig {
  /** Only displayed when explicitly verified/configured by the business */
  yearsOfExperience: string | null;
  happyClientsCount: string | null;
  onlineRating: string | null;
  valetParkingAvailable: boolean;
  showTreatmentBenefits: boolean;
  foundationDetailsVerified: boolean;
  certificationDetailsVerified: boolean;
}

const envMeta = (typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: Record<string, string | undefined> }).env) || {};

export const BUSINESS_CLAIMS_CONFIG: BusinessClaimsConfig = {
  yearsOfExperience: envMeta.VITE_YEARS_EXPERIENCE || null,
  happyClientsCount: envMeta.VITE_HAPPY_CLIENTS || null,
  onlineRating: envMeta.VITE_ONLINE_RATING || null,
  valetParkingAvailable: envMeta.VITE_ENABLE_VALET_PARKING === 'true',
  showTreatmentBenefits: envMeta.VITE_ENABLE_TREATMENT_BENEFITS === 'true',
  foundationDetailsVerified: envMeta.VITE_FOUNDATION_VERIFIED === 'true',
  certificationDetailsVerified: envMeta.VITE_CERTIFICATION_VERIFIED === 'true',
};

/**
 * Central Business Email Configuration.
 * Update this single constant (or set VITE_BUSINESS_EMAIL in .env) to change the displayed business email site-wide.
 */
export const BUSINESS_EMAIL: string = (
  envMeta.VITE_BUSINESS_EMAIL || 'sonaljinger25@gmail.com'
).trim();

export type EnquiryCategoryId = 'trust' | 'academy' | 'studio';

export interface EnquiryCategoryConfig {
  id: EnquiryCategoryId;
  code: 'A' | 'B' | 'C';
  title: string;
  shortTitle: string;
  businessName: string;
  purposes: string[];
  whatsappMessage: string;
  whatsappButtonLabel: string;
  formButtonLabel: string;
  formHeading: string;
  detailsPlaceholder: string;
}

export const ENQUIRY_CATEGORIES: EnquiryCategoryConfig[] = [
  {
    id: 'trust',
    code: 'A',
    title: 'Foundation & Charitable Trust Enquiry',
    shortTitle: 'Trust Enquiry',
    businessName: 'Sonu Foundation and Charitable Trust',
    purposes: [
      'Community initiatives',
      'Women empowerment',
      'Skill development',
      'Charitable activities',
    ],
    whatsappMessage:
      'Hello Sonu Foundation and Charitable Trust! I would like to connect regarding your community initiatives, women empowerment and skill development programs.',
    whatsappButtonLabel: 'WhatsApp Trust Enquiry',
    formButtonLabel: 'Trust Enquiry Form',
    formHeading: 'Foundation & Charitable Trust Enquiry',
    detailsPlaceholder:
      'Share how you would like to connect regarding community initiatives, women empowerment, skill development, or charitable activities...',
  },
  {
    id: 'academy',
    code: 'B',
    title: 'Beauty Academy Course Enquiry',
    shortTitle: 'Academy Enquiry',
    businessName: "Sonu's Beauty Studio & Academy",
    purposes: [
      'Professional beauty courses',
      'Training programs',
      'Course fees',
      'Batch timings',
      'Admission enquiries',
    ],
    whatsappMessage:
      "Hello Sonu's Beauty Studio & Academy! I am interested in learning more about your professional beauty courses and training programs. Please share the course details, fees and batch timings.",
    whatsappButtonLabel: 'WhatsApp Academy Enquiry',
    formButtonLabel: 'Academy Enquiry Form',
    formHeading: 'Beauty Academy Course Enquiry',
    detailsPlaceholder:
      'Tell us which professional beauty courses or training programs you are interested in, plus any questions on course fees, batch timings, or admissions...',
  },
  {
    id: 'studio',
    code: 'C',
    title: 'Beauty Treatment & Appointment Enquiry',
    shortTitle: 'Studio Enquiry',
    businessName: "Sonu's Beauty Studio",
    purposes: [
      'Facial',
      'Waxing',
      'Manicure',
      'Pedicure',
      'Nail treatments',
      'Other beauty services',
      'Appointment enquiries',
    ],
    whatsappMessage:
      "Hello Sonu's Beauty Studio! I would like to enquire about your beauty services, including facials, waxing, manicure, pedicure and nail treatments. Please share the details and appointment availability.",
    whatsappButtonLabel: 'WhatsApp Beauty Studio Enquiry',
    formButtonLabel: 'Studio Enquiry Form',
    formHeading: 'Beauty Treatment & Appointment Enquiry',
    detailsPlaceholder:
      'Tell us which beauty services (facial, waxing, manicure, pedicure, nail treatments, etc.) or appointment dates you would like to enquire about...',
  },
];

export const OWNER_PROFILE = {
  name: 'Sonal Jingar',
  designation: 'Founder & Owner',
  proprietorDesignation: 'Founder & Proprietor',
  organization: 'Sonu’s Beauty Studio & Academy · Sonu Foundation & Charitable Trust',
  photoUrl:
    '/assets/aistudio/3e494f118bb00ce44c2be67d6cc7077694a072aadf0740a7743eb762bb7caec3_c1cf6611.png',
  photoAlt:
    'Sonal Jingar, Founder and Proprietor of Sonu’s Beauty Studio & Academy and Sonu Foundation and Charitable Trust in Vadodara',
  summary:
    'Guiding bridal artistry, studio beauty services, and hands-on certified beauty academy training in Vadodara.',
};

export const VERIFIED_YOUTUBE_CHANNEL_URL =
  'https://www.youtube.com/@sonusbeautystudioacademyso4582';
export const VERIFIED_YOUTUBE_HANDLE = '@sonusbeautystudioacademyso4582';

const BROKEN_YOUTUBE_HANDLES = ['@sonusbeautystudioacademys04582'] as const;

/**
 * Resolves the active YouTube channel URL, ensuring stale/broken 404 handles
 * (such as the old `s04582` typo) are never published as live links.
 */
export function resolveYouTubeChannelUrl(candidateUrl?: string | null): string {
  const trimmed = typeof candidateUrl === 'string' ? candidateUrl.trim() : '';
  if (!trimmed) {
    return VERIFIED_YOUTUBE_CHANNEL_URL;
  }
  const lower = trimmed.toLowerCase();
  if (BROKEN_YOUTUBE_HANDLES.some((broken) => lower.includes(broken))) {
    return VERIFIED_YOUTUBE_CHANNEL_URL;
  }
  if (!/^https?:\/\//i.test(trimmed)) {
    return '';
  }
  return trimmed;
}

export const BUSINESS_INFO = {
  name: 'Sonu Foundation and Charitable Trust',
  shortName: 'Sonu Foundation',
  subtitle: 'and Charitable Trust',
  tagline: 'Women Empowerment • Skill Development',
  foundationName: 'Sonu Foundation and Charitable Trust',
  city: 'Vadodara, Gujarat',
  cityFull: 'Vadodara, Gujarat, India',
  phoneDisplay: '+91 79902 34736',
  phoneRaw: '+917990234736',
  studioPhoneAlt: '+91 79902 34736',
  whatsappNumber: +917990234736,
  whatsappDisplay: '+91 79902 34736',
  email: BUSINESS_EMAIL,
  hours: 'Mon – Sun : 10:00 AM – 8:00 PM',
  promoText: 'Empowering women through skill development, training, and community support.',
  certificationDisclaimer:
    'Program details and course guidance are shared directly through the academy and foundation enquiry process.',
  googleReviewsSearchUrl:
    'https://www.google.com/maps/search/?api=1&query=Sonu%27s+Beauty+Studio+%26+Academy+Vadodara+Gujarat',
  social: {
    instagramUrl:
      envMeta.VITE_INSTAGRAM_STUDIO_URL || 'https://www.instagram.com/Sonusbeautystudio/',
    instagramHandle: '@Sonusbeautystudio',
    facebookDisplayName: "Sonu's Beauty Studio",
    facebookUrl:
      envMeta.VITE_FACEBOOK_URL ||
      "https://www.facebook.com/search/top?q=Sonu's%20Beauty%20Studio",
    youtubeUrl: resolveYouTubeChannelUrl(envMeta.VITE_YOUTUBE_URL),
    youtubeHandle: VERIFIED_YOUTUBE_HANDLE,
  },
};

export interface SocialProfileLink {
  id:
    | 'instagram-studio-academy'
    | 'instagram-sonal-jingar'
    | 'facebook-studio'
    | 'facebook-sonal-jingar'
    | 'youtube-studio-academy';
  platform: 'instagram' | 'facebook' | 'youtube';
  platformLabel: 'Instagram' | 'Facebook' | 'YouTube';
  accountName: string;
  handle?: string;
  url: string;
}

/**
 * Configurable official social media profile URLs.
 * Update direct profile URLs in this single configuration object (or via VITE_* env vars).
 * Missing Instagram/Facebook direct slugs stay configurable without inventing profile URLs.
 */
export const SOCIAL_MEDIA_URLS = {
  instagramBeautyStudioAcademy:
    envMeta.VITE_INSTAGRAM_STUDIO_URL || 'https://www.instagram.com/Sonusbeautystudio/',
  instagramSonalJingar:
    envMeta.VITE_INSTAGRAM_SONAL_URL || 'https://www.instagram.com/',
  facebookBeautyStudio:
    envMeta.VITE_FACEBOOK_URL ||
    "https://www.facebook.com/search/top?q=Sonu's%20Beauty%20Studio",
  facebookSonalJingar:
    envMeta.VITE_FACEBOOK_SONAL_URL ||
    'https://www.facebook.com/search/top?q=Sonal%20Jingar',
  youtubeChannel: resolveYouTubeChannelUrl(envMeta.VITE_YOUTUBE_URL),
  youtubeHandle: VERIFIED_YOUTUBE_HANDLE,
} as const;

export const OFFICIAL_SOCIAL_PROFILES: SocialProfileLink[] = [
  {
    id: 'instagram-studio-academy',
    platform: 'instagram',
    platformLabel: 'Instagram',
    accountName: "Sonu's Beauty Studio & Academy",
    url: SOCIAL_MEDIA_URLS.instagramBeautyStudioAcademy,
  },
  {
    id: 'instagram-sonal-jingar',
    platform: 'instagram',
    platformLabel: 'Instagram',
    accountName: 'Sonal Jingar',
    url: SOCIAL_MEDIA_URLS.instagramSonalJingar,
  },
  {
    id: 'facebook-studio',
    platform: 'facebook',
    platformLabel: 'Facebook',
    accountName: "Sonu's Beauty Studio",
    url: SOCIAL_MEDIA_URLS.facebookBeautyStudio,
  },
  {
    id: 'facebook-sonal-jingar',
    platform: 'facebook',
    platformLabel: 'Facebook',
    accountName: 'Sonal Jingar',
    url: SOCIAL_MEDIA_URLS.facebookSonalJingar,
  },
  {
    id: 'youtube-studio-academy',
    platform: 'youtube',
    platformLabel: 'YouTube',
    accountName: "Sonu's Beauty Studio & Academy",
    handle: SOCIAL_MEDIA_URLS.youtubeHandle,
    url: SOCIAL_MEDIA_URLS.youtubeChannel,
  },
];

/**
 * Location Schema:
 * - Branch 1 (Somatalav, Waghodia Road): 22.280752, 73.230896 -> https://www.google.com/maps?q=22.280752,73.230896
 * - Branch 2 (Adaniyapul, Fatepura): 22.305025, 73.210304 -> https://maps.google.com/?q=22.305025,73.210304
 */
export function resolveLocation2AddressLines(): string[] {
  return [
    'Adaniyapul, Fatepura,',
    'Vadodara, Gujarat – 390006.',
  ];
}

export const LOCATIONS: LocationItem[] = [
  {
    id: 'location-1',
    name: 'Sonu’s Beauty Studio & Academy – Somatalav',
    shortLabel: 'Branch 1: Somatalav, Waghodia Road, Vadodara',
    addressLines: [
      'Somatalav, Waghodia Road,',
      'Vadodara, Gujarat.',
    ],
    cityState: 'Vadodara, Gujarat',
    phone: '+91 79902 34736',
    coordinates: '22.280752, 73.230896',
    mapsUrl: 'https://www.google.com/maps?q=22.280752,73.230896',
    mapEmbedUrl:
      'https://maps.google.com/maps?q=22.280752,73.230896&t=&z=16&ie=UTF8&iwloc=&output=embed',
    hours: 'Mon – Sun : 10:00 AM – 8:00 PM',
    badge: 'Branch 1 • Somatalav, Waghodia Road',
    schemaType: 'street-address',
  },
  {
    id: 'location-2',
    name: 'Sonu’s Beauty Studio & Academy – Adaniyapul, Fatepura',
    shortLabel: 'Branch 2: Adaniyapul, Fatepura (Vadodara)',
    addressLines: resolveLocation2AddressLines(),
    cityState: 'Vadodara, Gujarat – 390006',
    phone: '+91 79902 34736',
    coordinates: '22.305025, 73.210304',
    mapsUrl: 'https://maps.google.com/?q=22.305025,73.210304',
    mapEmbedUrl:
      'https://maps.google.com/maps?q=22.305025,73.210304&t=&z=16&ie=UTF8&iwloc=&output=embed',
    hours: 'Mon – Sun : 10:00 AM – 8:00 PM',
    badge: 'Branch 2 • Adaniyapul, Fatepura',
    schemaType: 'street-address',
  },
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  'Beauty & Waxing',
  'Hand & Foot Care',
  'Massage & Spa',
  'Hair Treatments',
  'Makeup',
  'Hairstyles',
  'Nail Art & Extensions',
];

export const WEBSITE_SERVICE_NAVIGATION: {
  label: string;
  category?: ServiceCategory;
  page: PageId;
}[] = [
  { label: 'Beauty & Waxing', category: 'Beauty & Waxing', page: 'services' },
  { label: 'Hand & Foot Care', category: 'Hand & Foot Care', page: 'services' },
  { label: 'Massage & Spa', category: 'Massage & Spa', page: 'services' },
  { label: 'Hair Treatments', category: 'Hair Treatments', page: 'services' },
  { label: 'Makeup', category: 'Makeup', page: 'services' },
  { label: 'Hairstyles', category: 'Hairstyles', page: 'services' },
  { label: 'Nail Art & Extensions', category: 'Nail Art & Extensions', page: 'services' },
  { label: 'Beauty Academy', page: 'academy' },
];

export const SERVICE_CATEGORY_GROUPS: ServiceCategoryGroup[] = [
  {
    category: 'Beauty & Waxing',
    sectionCode: 'A',
    heading: 'Beauty & Waxing Services',
    tagline: 'Precision threading, hygienic waxing, facial care, and bleach services.',
    image: '/assets/aistudio/7_25ba3f99.jpeg',
    isClientPhoto: true,
    serviceNames: ['Eyebrow', 'Upper Lips', 'Forehead', 'Hand Wax', 'Leg Wax', 'Facial', 'Bleach'],
  },
  {
    category: 'Hand & Foot Care',
    sectionCode: 'B',
    heading: 'Hand & Foot Care',
    tagline: 'Manicure and pedicure grooming rituals for hands and feet.',
    image: '/assets/aistudio/7_25ba3f99.jpeg',
    isClientPhoto: true,
    serviceNames: ['Manicure', 'Pedicure'],
  },
  {
    category: 'Massage & Spa',
    sectionCode: 'C',
    heading: 'Massage & Spa',
    tagline: 'Relaxing back massage, head massage, hair spa, and permanent hair spa services.',
    image: '/assets/aistudio/7_25ba3f99.jpeg',
    isClientPhoto: true,
    serviceNames: ['Back Massage', 'Head Massage', 'Hair Spa', 'Permanent Hair Spa'],
  },
  {
    category: 'Hair Treatments',
    sectionCode: 'D',
    heading: 'Hair Cut & Chemical Treatments',
    tagline: 'Hair cuts, smoothing, keratin, KeraSmooth, protein treatment, nanoplasty, and hair colour.',
    image: '/assets/aistudio/12_a402bff7.jpeg',
    isClientPhoto: true,
    serviceNames: [
      'Hair Cuts',
      'Hair Smoothing',
      'Keratin Treatment',
      'KeraSmooth',
      'Protein Treatment',
      'Nanoplasty',
      'Root Touch-up',
      'Global Hair Colour',
      'Highlights',
    ],
  },
  {
    category: 'Makeup',
    sectionCode: 'E',
    heading: 'Makeup Services',
    tagline: 'Self makeup, Sangeet / Society look, Haldi look, Bridal, Reception, and Party Wear makeup.',
    image: '/assets/Hero-Bride-Full.png',
    isClientPhoto: true,
    serviceNames: [
      'Self Makeup',
      'Sangeet / Society Look Makeup',
      'Haldi Look Makeup',
      'Bridal Makeup',
      'Reception Makeup',
      'Party Wear Makeup',
    ],
  },
  {
    category: 'Hairstyles',
    sectionCode: 'F',
    heading: 'Hairstyling',
    tagline: 'Traditional and contemporary event hairstyling including Loban, Messy Bun, Braids, and Open Hair.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.38__1__b3134fa2.jpeg',
    isClientPhoto: true,
    serviceNames: ['Loban', 'Messy Bun', 'Braids', 'Open Hair Hairstyle'],
  },
  {
    category: 'Nail Art & Extensions',
    sectionCode: 'G',
    heading: 'Nail Services',
    tagline: 'Temporary nail extensions, acrylic nail extensions, gel nail extensions, and custom nail designs.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.38_3ef1e822.jpeg',
    isClientPhoto: true,
    serviceNames: [
      'Temporary Nail Extension',
      'Acrylic Nail Extension',
      'Gel Nail Extension',
      'Custom Nail Designs',
    ],
  },
];

function buildServiceItem(params: {
  id: string;
  name: string;
  category: ServiceCategory;
  shortDescription: string;
  description: string;
  image: string;
  isClientPhoto?: boolean;
  iconType: ServiceItem['iconType'];
  featuredOnHome?: boolean;
  popularTitle?: string;
  popularSummary?: string;
  benefits: string[];
  process: string[];
  importantNotes?: string[];
}): ServiceItem {
  return {
    id: params.id,
    name: params.name,
    category: params.category,
    shortDescription: params.shortDescription,
    description: params.description,
    image: params.image,
    isClientPhoto: params.isClientPhoto ?? params.image.includes('/aistudio/'),
    iconType: params.iconType,
    priceLabel: 'Price on Enquiry',
    featuredOnHome: params.featuredOnHome,
    popularTitle: params.popularTitle,
    popularSummary: params.popularSummary,
    benefits: params.benefits,
    process: params.process,
    importantNotes: params.importantNotes || [
      'Pricing and exact session duration are shared upon studio consultation or via WhatsApp.',
      'All enquiries are pending confirmation until confirmed by Sonu Foundation and Charitable Trust.',
    ],
  };
}

export const SERVICES: ServiceItem[] = [
  /* ==================== A. BEAUTY & WAXING SERVICES ==================== */
  buildServiceItem({
    id: 'facial',
    name: 'Facial',
    popularTitle: 'Beauty, Facial & Bleach',
    popularSummary: 'Facial, Bleach, Eyebrow, Upper Lips & Forehead care.',
    category: 'Beauty & Waxing',
    shortDescription: 'Studio facial cleansing, exfoliation, massage, and mask care.',
    description:
      'Our training and community-focused wellness sessions include guided care, practical learning, and support tailored to each learner and participant.',
    image: '/assets/aistudio/7_25ba3f99.jpeg',
    isClientPhoto: true,
    iconType: 'facial',
    featuredOnHome: true,
    benefits: [
      'Includes consultation to select products suited to your skin profile',
      'Step-by-step cleansing, gentle scrub, massage, and mask care',
      'Performed in a clean, ladies-only studio setting',
    ],
    process: [
      'Skin consultation and gentle cleansing',
      'Exfoliation and facial massage',
      'Mask application and moisturizer finish',
    ],
  }),
  buildServiceItem({
    id: 'eyebrow',
    name: 'Eyebrow',
    popularTitle: 'Threading & Waxing',
    popularSummary: 'Eyebrow, Upper Lips, Forehead, Hand Wax & Leg Wax.',
    category: 'Beauty & Waxing',
    shortDescription: 'Precision eyebrow threading and shaping.',
    description:
      'Clean eyebrow shaping performed with cotton thread to neaten and define your natural brow line.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.38__1__b3134fa2.jpeg',
    isClientPhoto: true,
    iconType: 'threading',
    featuredOnHome: true,
    benefits: [
      'Shaped according to your preferred brow thickness and arch',
      'Single-use cotton thread protocol',
      'Includes soothing post-threading gel application',
    ],
    process: [
      'Brow shape consultation and cleansing',
      'Precision eyebrow threading',
      'Soothing gel finish',
    ],
  }),
  buildServiceItem({
    id: 'upper-lips',
    name: 'Upper Lips',
    category: 'Beauty & Waxing',
    shortDescription: 'Gentle upper lip threading and hair removal.',
    description:
      'Quick and hygienic upper lip hair removal performed by trained studio staff with post-care gel.',
    image: '/assets/aistudio/7_25ba3f99.jpeg',
    isClientPhoto: true,
    iconType: 'threading',
    benefits: [
      'Quick upper lip grooming using clean cotton thread',
      'Post-threading cooling gel application',
    ],
    process: [
      'Area preparation',
      'Upper lip threading',
      'Cooling gel finish',
    ],
  }),
  buildServiceItem({
    id: 'forehead',
    name: 'Forehead',
    category: 'Beauty & Waxing',
    shortDescription: 'Clean forehead threading and stray hair removal.',
    description:
      'Gentle forehead threading to remove fine facial hair along the forehead and brow line.',
    image: '/assets/aistudio/7_25ba3f99.jpeg',
    isClientPhoto: true,
    iconType: 'threading',
    benefits: [
      'Neatens the forehead and hairline area',
      'Followed by soothing post-care lotion',
    ],
    process: [
      'Gentle skin prep',
      'Forehead threading',
      'Soothing post-care lotion',
    ],
  }),
  buildServiceItem({
    id: 'hand-wax',
    name: 'Hand Wax',
    category: 'Beauty & Waxing',
    shortDescription: 'Hygienic arm and hand waxing service.',
    description:
      'Professional hand and arm waxing performed with clean applicators and post-wax soothing care.',
    image: '/assets/aistudio/7_25ba3f99.jpeg',
    isClientPhoto: true,
    iconType: 'waxing',
    benefits: [
      'Full or half arm waxing based on your preference',
      'Includes pre-wax prep and post-wax cleansing care',
    ],
    process: [
      'Pre-wax skin cleansing',
      'Temperature-checked wax application and strip removal',
      'Post-wax cleansing and calming lotion',
    ],
  }),
  buildServiceItem({
    id: 'leg-wax',
    name: 'Leg Wax',
    category: 'Beauty & Waxing',
    shortDescription: 'Hygienic half-leg or full-leg waxing in a private ladies-only area.',
    description:
      'Comfortable leg waxing service performed in our private ladies-only salon environment with post-wax soothing lotion.',
    image: '/assets/aistudio/7_25ba3f99.jpeg',
    isClientPhoto: true,
    iconType: 'waxing',
    benefits: [
      'Available for half-leg or full-leg waxing',
      'Private, hygienic studio cabin with post-wax lotion',
    ],
    process: [
      'Skin cleansing and preparation',
      'Section-by-section leg waxing',
      'Post-wax soothing lotion application',
    ],
  }),
  buildServiceItem({
    id: 'bleach',
    name: 'Bleach',
    category: 'Beauty & Waxing',
    shortDescription: 'Facial or neck bleach application with sensitivity check.',
    description:
      'Cosmetic skin bleach service performed after a patch check, timed carefully and finished with a soothing moisturizer.',
    image: '/assets/aistudio/7_25ba3f99.jpeg',
    isClientPhoto: true,
    iconType: 'facial',
    benefits: [
      'Includes prior skin sensitivity discussion',
      'Monitored application timing and gentle removal',
    ],
    process: [
      'Skin check and pre-cleansing',
      'Measured bleach application and monitored timing',
      'Gentle rinse and moisturizer finish',
    ],
  }),

  /* ==================== B. HAND & FOOT CARE ==================== */
  buildServiceItem({
    id: 'manicure',
    name: 'Manicure',
    category: 'Hand & Foot Care',
    shortDescription: 'Nail shaping, cuticle grooming, hand soak, scrub, and hand massage.',
    description:
      'Complete hand and fingernail grooming including warm soak, nail filing, cuticle neatening, exfoliation, and hand massage.',
    image: '/assets/aistudio/7_25ba3f99.jpeg',
    isClientPhoto: true,
    iconType: 'nails',
    benefits: [
      'Nail trimming, filing, and cuticle grooming',
      'Gentle hand scrub and moisturizing hand massage',
    ],
    process: [
      'Nail filing, shaping, and warm hand soak',
      'Cuticle care and gentle hand exfoliation',
      'Hand massage and polish/clean finish',
    ],
  }),
  buildServiceItem({
    id: 'pedicure',
    name: 'Pedicure',
    category: 'Hand & Foot Care',
    shortDescription: 'Warm foot soak, heel scrubbing, toenail shaping, and foot massage.',
    description:
      'Relaxing foot care ritual featuring a warm foot soak, heel and sole scrubbing, toenail trimming, cuticle care, and foot massage.',
    image: '/assets/aistudio/7_25ba3f99.jpeg',
    isClientPhoto: true,
    iconType: 'nails',
    benefits: [
      'Warm foot soak and heel/sole exfoliation',
      'Toenail shaping, cuticle care, and relaxing foot massage',
    ],
    process: [
      'Warm foot soak and cleansing',
      'Toenail shaping, cuticle grooming, and foot scrubbing',
      'Moisturizing foot massage and clean finish',
    ],
  }),

  /* ==================== C. MASSAGE & SPA ==================== */
  buildServiceItem({
    id: 'back-massage',
    name: 'Back Massage',
    category: 'Massage & Spa',
    shortDescription: 'Relaxing back and shoulder massage in our ladies-only studio.',
    description:
      'A soothing back and shoulder massage session performed by female therapists in our comfortable ladies-only studio.',
    image: '/assets/aistudio/7_25ba3f99.jpeg',
    isClientPhoto: true,
    iconType: 'spa',
    benefits: [
      'Focused back, neck, and shoulder massage strokes',
      'Private and peaceful women-only studio setting',
    ],
    process: [
      'Comfort and pressure consultation',
      'Back and shoulder massage session',
      'Warm towel wipe finish',
    ],
  }),
  buildServiceItem({
    id: 'head-massage',
    name: 'Head Massage',
    category: 'Massage & Spa',
    shortDescription: 'Traditional scalp and head massage with optional hair oil.',
    description:
      'Relaxing scalp, crown, and neck massage with or without nourishing hair oil according to your preference.',
    image: '/assets/aistudio/7_25ba3f99.jpeg',
    isClientPhoto: true,
    iconType: 'spa',
    benefits: [
      'Choice of dry scalp massage or oil head massage',
      'Gentle crown, temple, and nape massage techniques',
    ],
    process: [
      'Hair sectioning and optional oil application',
      'Crown, temple, and neck head massage',
    ],
  }),
  buildServiceItem({
    id: 'hair-spa',
    name: 'Hair Spa',
    category: 'Massage & Spa',
    shortDescription: 'Conditioning hair spa masque, scalp massage, and steam care.',
    description:
      'A conditioning Hair Spa ritual combining shampoo cleansing, hair spa cream application, scalp massage, steam hydration, and rinse.',
    image: '/assets/aistudio/7_25ba3f99.jpeg',
    isClientPhoto: true,
    iconType: 'spa',
    benefits: [
      'Includes shampoo wash, spa masque application, and scalp massage',
      'Steam hydration and conditioning rinse',
    ],
    process: [
      'Shampoo wash and towel dry',
      'Section-wise hair spa cream application and scalp massage',
      'Steam hydration, rinse, and blow-dry finish',
    ],
  }),
  buildServiceItem({
    id: 'permanent-hair-spa',
    name: 'Permanent Hair Spa',
    category: 'Massage & Spa',
    shortDescription: 'Extended smoothing and conditioning hair spa treatment.',
    description:
      'A multi-step Permanent Hair Spa service designed for clients looking for longer-lasting hair smoothness and conditioning.',
    image: '/assets/aistudio/7_25ba3f99.jpeg',
    isClientPhoto: true,
    iconType: 'spa',
    benefits: [
      'Hair texture consultation before application',
      'Multi-step conditioning infusion and thermal/steam setting',
    ],
    process: [
      'Hair assessment and clarifying wash',
      'Section-by-section Permanent Hair Spa product application',
      'Thermal/steam alignment and conditioning finish',
    ],
  }),

  /* ==================== D. HAIR CUT & CHEMICAL TREATMENTS ==================== */
  buildServiceItem({
    id: 'hair-cuts',
    name: 'Hair Cuts',
    category: 'Hair Treatments',
    shortDescription: 'Customized trims, U/V cuts, layers, feather cuts, and face-framing styles.',
    description:
      'Precision haircuts tailored to your preferred length and style—including straight trims, U-cut, V-cut, layers, and face-framing cuts.',
    image: '/assets/aistudio/12_a402bff7.jpeg',
    isClientPhoto: true,
    iconType: 'hair',
    benefits: [
      'Style and length consultation prior to cutting',
      'Neat sectioning and styled finish',
    ],
    process: [
      'Style consultation',
      'Sectioning and precision haircut',
      'Setting finish and final check',
    ],
  }),
  buildServiceItem({
    id: 'keratin-treatment',
    name: 'Keratin Treatment',
    popularTitle: 'Hair Cut & Chemical Treatments',
    popularSummary: 'Hair Cuts, Smoothing, Keratin, KeraSmooth, Nanoplasty & Hair Colour.',
    category: 'Hair Treatments',
    shortDescription: 'Professional salon keratin protein hair treatment.',
    description:
      'Our Keratin Treatment involves clarifying hair prep, section-wise keratin application, blow-drying, and thermal flat-iron sealing for smoother, more manageable hair.',
    image: '/assets/aistudio/12_a402bff7.jpeg',
    isClientPhoto: true,
    iconType: 'treatments',
    featuredOnHome: true,
    benefits: [
      'Prior hair texture and chemical history consultation',
      'Section-by-section application and controlled thermal sealing',
      'Aftercare shampoo and maintenance guidance provided',
    ],
    process: [
      'Hair assessment and purifying wash',
      'Section-by-section keratin application',
      'Blow-dry and thermal sealing',
    ],
  }),
  buildServiceItem({
    id: 'hair-smoothing',
    name: 'Hair Smoothing',
    category: 'Hair Treatments',
    shortDescription: 'Salon hair smoothing service for sleek, straighter hair.',
    description:
      'Professional Hair Smoothing service performed with strand testing, smoothing cream application, thermal alignment, and neutralizing lock.',
    image: '/assets/aistudio/12_a402bff7.jpeg',
    isClientPhoto: true,
    iconType: 'treatments',
    benefits: [
      'Strand evaluation prior to chemical application',
      'Step-by-step smoothing, ironing, and neutralizing protocol',
    ],
    process: [
      'Strand evaluation and cleansing',
      'Smoothing cream application and thermal alignment',
      'Neutralizing lock and serum finish',
    ],
  }),
  buildServiceItem({
    id: 'kerasmooth',
    name: 'KeraSmooth',
    category: 'Hair Treatments',
    shortDescription: 'Combined hair smoothing and keratin conditioning treatment.',
    description:
      'KeraSmooth pairs hair smoothing alignment with keratin protein conditioning in a structured salon session.',
    image: '/assets/aistudio/12_a402bff7.jpeg',
    isClientPhoto: true,
    iconType: 'treatments',
    benefits: [
      'Combines smoothing alignment and keratin conditioning steps',
      'Includes post-treatment home care instructions',
    ],
    process: [
      'Hair history consultation and clarifying wash',
      'Smoothing and keratin infusion stages',
      'Thermal sealing and post-care guidance',
    ],
  }),
  buildServiceItem({
    id: 'protein-treatment',
    name: 'Protein Treatment',
    category: 'Hair Treatments',
    shortDescription: 'Nourishing protein masque treatment for dry or chemically treated hair.',
    description:
      'A protein-focused conditioning hair service designed for dry, dull, or chemically processed hair strands.',
    image: '/assets/aistudio/12_a402bff7.jpeg',
    isClientPhoto: true,
    iconType: 'treatments',
    benefits: [
      'Scalp and hair strand consultation',
      'Thorough protein masque application and gentle heat/steam care',
    ],
    process: [
      'Hair cleansing and towel prep',
      'Protein treatment application across hair lengths',
      'Gentle heat/steam care, rinse, and blow-dry',
    ],
  }),
  buildServiceItem({
    id: 'nanoplasty',
    name: 'Nanoplasty',
    category: 'Hair Treatments',
    shortDescription: 'Modern Nanoplasty hair smoothing and conditioning treatment.',
    description:
      'Professional Nanoplasty hair service featuring purifying prep, section-wise formula infusion, precision thermal sealing, and rinse.',
    image: '/assets/aistudio/12_a402bff7.jpeg',
    isClientPhoto: true,
    iconType: 'treatments',
    benefits: [
      'Detailed hair assessment and quote based on hair length/density',
      'Precision sectioning and thermal sealing by trained stylists',
    ],
    process: [
      'Purifying wash and preparation',
      'Section-by-section Nanoplasty formula application',
      'Blow-dry, thermal sealing, and rinse',
    ],
  }),
  buildServiceItem({
    id: 'root-touch-up',
    name: 'Root Touch-up',
    category: 'Hair Treatments',
    shortDescription: 'Root hair colour application matched to your existing shade.',
    description:
      'Targeted root colour application to cover regrowth and blend seamlessly with your existing hair colour.',
    image: '/assets/aistudio/12_a402bff7.jpeg',
    isClientPhoto: true,
    iconType: 'hair',
    benefits: [
      'Shade matching consultation before mixing',
      'Targeted root application and post-colour conditioning wash',
    ],
    process: [
      'Shade matching consultation',
      'Precision root application and timed processing',
      'Wash and conditioning blow-dry',
    ],
  }),
  buildServiceItem({
    id: 'global-hair-colour',
    name: 'Global Hair Colour',
    category: 'Hair Treatments',
    shortDescription: 'Full root-to-tip global hair colour application.',
    description:
      'Full-head Global Hair Colour service with shade consultation, section-wise application, and post-colour conditioning wash.',
    image: '/assets/aistudio/12_a402bff7.jpeg',
    isClientPhoto: true,
    iconType: 'hair',
    benefits: [
      'Shade chart consultation suited to your preference',
      'Uniform root-to-end application and conditioning wash',
    ],
    process: [
      'Shade selection and strand check',
      'Full-length colour application',
      'Emulsifying rinse, conditioning mask, and blow-dry finish',
    ],
  }),
  buildServiceItem({
    id: 'highlights',
    name: 'Highlights',
    category: 'Hair Treatments',
    shortDescription: 'Custom foil highlights, streaks, or dimensional colour accents.',
    description:
      'Customized foil Highlights or colour streaks placed to add dimension and contrast according to your haircut and style preference.',
    image: '/assets/aistudio/12_a402bff7.jpeg',
    isClientPhoto: true,
    iconType: 'hair',
    benefits: [
      'Custom placement consultation (streaks, crown, or full highlights)',
      'Includes toning and post-highlight conditioning care',
    ],
    process: [
      'Placement and tone consultation',
      'Foil weaving, lightening, and toning',
      'Conditioning wash and styled finish',
    ],
  }),

  /* ==================== E. MAKEUP SERVICES ==================== */
  buildServiceItem({
    id: 'bridal-makeup',
    name: 'Bridal Makeup',
    popularTitle: 'Makeup (Bridal & Occasion)',
    popularSummary: 'Bridal, Reception, Sangeet, Haldi, Party Wear & Self Makeup.',
    category: 'Makeup',
    shortDescription: 'Complete bridal makeup, eye artistry, bridal hairstyling, jewellery setting & draping.',
    description:
      'Signature bridal and grooming guidance at Sonu Foundation and Charitable Trust includes personal styling support, confidence-building preparation, and practical beauty-care learning sessions.',
    image: '/assets/Hero-Bride-Full.png',
    isClientPhoto: true,
    iconType: 'makeup',
    featuredOnHome: true,
    benefits: [
      'Pre-bridal look discussion matched to your wedding attire and jewellery',
      'Includes skin prep, base makeup, eye artistry, hairstyling, and draping',
      'Available at our Vadodara studio branches (advance booking recommended)',
    ],
    process: [
      'Bridal look consultation matching outfit and jewellery',
      'Skin prep, primer, and base makeup blending',
      'Eye artistry, lip styling, hairstyling, and draping',
    ],
  }),
  buildServiceItem({
    id: 'reception-makeup',
    name: 'Reception Makeup',
    category: 'Makeup',
    shortDescription: 'Evening reception makeup, hairstyling, and outfit draping.',
    description:
      'Evening-ready Reception Makeup customized to complement your reception gown, lehenga, or saree, complete with hairstyling and draping.',
    image: '/assets/Hero-Bride-Full.png',
    isClientPhoto: true,
    iconType: 'makeup',
    benefits: [
      'Customized to your reception outfit and evening lighting',
      'Includes hairstyling and dupatta/saree draping',
    ],
    process: [
      'Outfit and jewellery coordination',
      'Skin prep, base blending, and evening eye/lip makeup',
      'Hairstyling and outfit draping',
    ],
  }),
  buildServiceItem({
    id: 'sangeet-society-look-makeup',
    name: 'Sangeet / Society Look Makeup',
    category: 'Makeup',
    shortDescription: 'Festive makeup and hairstyling for Sangeet, Garba, and Society events.',
    description:
      'Festive Sangeet / Society Look Makeup and hairstyling designed for pre-wedding musical nights, garba celebrations, and community functions.',
    image: '/assets/Hero-Bride-Full.png',
    isClientPhoto: true,
    iconType: 'makeup',
    benefits: [
      'Festive eye and lip shades coordinated with your outfit',
      'Secure pinning and setting spray finish for dance events',
    ],
    process: [
      'Skin prep and primer application',
      'Festive base, eye makeup, and lip styling',
      'Hairstyling and setting spray finish',
    ],
  }),
  buildServiceItem({
    id: 'haldi-look-makeup',
    name: 'Haldi Look Makeup',
    category: 'Makeup',
    shortDescription: 'Daytime makeup and hairstyling for Haldi and Mehendi ceremonies.',
    description:
      'Fresh, lightweight daytime makeup and hairstyling tailored for Haldi and Mehendi ceremonies, including floral jewellery setting.',
    image: '/assets/Hero-Bride-Full.png',
    isClientPhoto: true,
    iconType: 'makeup',
    benefits: [
      'Lightweight daytime base suited for morning/afternoon ceremonies',
      'Pairs with floral jewellery and traditional Haldi attire',
    ],
    process: [
      'Hydrating skin prep',
      'Soft daytime base, eye enhancement, and lip colour',
      'Hairstyling and floral accessory placement',
    ],
  }),
  buildServiceItem({
    id: 'party-wear-makeup',
    name: 'Party Wear Makeup',
    category: 'Makeup',
    shortDescription: 'Occasion makeup for wedding guests, engagements, and family events.',
    description:
      'Customized Party Wear Makeup for wedding guests, engagements, birthdays, and festive occasions.',
    image: '/assets/Hero-Bride-Full.png',
    isClientPhoto: true,
    iconType: 'makeup',
    benefits: [
      'Tailored from subtle natural glam to full festive makeup',
      'Foundation shade matched to your skin tone',
    ],
    process: [
      'Skin cleansing and priming',
      'Base blending, eye shadow/liner artistry, and lip colour',
      'Setting finish',
    ],
  }),
  buildServiceItem({
    id: 'self-makeup',
    name: 'Self Makeup',
    category: 'Makeup',
    shortDescription: 'Natural everyday or personal event makeup styling.',
    description:
      'Clean, polished personal makeup styling for small gatherings, portraits, or everyday occasions.',
    image: '/assets/Hero-Bride-Full.png',
    isClientPhoto: true,
    iconType: 'makeup',
    benefits: [
      'Subtle, natural-looking makeup finish',
      'Quick studio appointment',
    ],
    process: [
      'Skin prep and base application',
      'Soft eye definition, blush, and lip colour',
    ],
  }),

  /* ==================== F. HAIRSTYLING ==================== */
  buildServiceItem({
    id: 'loban',
    name: 'Loban',
    popularTitle: 'Hairstyling (Bridal & Festive)',
    popularSummary: 'Loban, Messy Bun, Braids & Open Hair Hairstyle.',
    category: 'Hairstyles',
    shortDescription: 'Traditional and bridal Loban updo hairstyling.',
    description:
      'Structured Loban bun hairstyling crafted with secure pinning, volume padding, and optional gajra or hair ornament placement.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.38__1__b3134fa2.jpeg',
    isClientPhoto: true,
    iconType: 'hair',
    featuredOnHome: true,
    benefits: [
      'Secure pinning designed for weddings and traditional ceremonies',
      'Supports gajra, veni, and bridal hair jewellery',
    ],
    process: [
      'Hair prep and volume texturizing',
      'Structured Loban sculpting and secure pinning',
      'Accessory placement and setting spray',
    ],
  }),
  buildServiceItem({
    id: 'messy-bun',
    name: 'Messy Bun',
    category: 'Hairstyles',
    shortDescription: 'Textured modern Messy Bun updo with face-framing curls.',
    description:
      'Soft, textured Messy Bun hairstyle suited for engagements, receptions, sangeet, and party wear outfits.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.38__1__b3134fa2.jpeg',
    isClientPhoto: true,
    iconType: 'hair',
    benefits: [
      'Textured volume with soft face-framing tendrils',
      'Secure internal pinning for event wear',
    ],
    process: [
      'Curl preparation and crown volume prep',
      'Textured bun pinning and face-framing curl styling',
      'Finishing hold spray',
    ],
  }),
  buildServiceItem({
    id: 'braids',
    name: 'Braids',
    category: 'Hairstyles',
    shortDescription: 'Bridal, traditional Indian, French, fishtail, and festive braids.',
    description:
      'Intricate bridal and festive Braids—including traditional Indian braids with floral/jewellery adornment as well as French, fishtail, and crown braids.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.38__1__b3134fa2.jpeg',
    isClientPhoto: true,
    iconType: 'hair',
    benefits: [
      'Custom braid style matched to your outfit and occasion',
      'Neat sectioning and accessory pinning',
    ],
    process: [
      'Detangling and texture prep',
      'Precision braiding and volume detailing',
      'Ornament placement and hold spray',
    ],
  }),
  buildServiceItem({
    id: 'open-hair-hairstyle',
    name: 'Open Hair Hairstyle',
    category: 'Hairstyles',
    shortDescription: 'Soft curls, waves, half-up crown styles, or sleek open hair styling.',
    description:
      'Event-ready Open Hair Hairstyle including soft curls, waves, half-pinned crown twists, or sleek straight styling.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.38__1__b3134fa2.jpeg',
    isClientPhoto: true,
    iconType: 'hair',
    benefits: [
      'Choice of curls, waves, half-up pinning, or sleek straight finish',
      'Heat protectant and setting spray included',
    ],
    process: [
      'Heat protectant application and sectioning',
      'Thermal styling (curls, waves, or sleek finish)',
      'Finishing serum and hold spray',
    ],
  }),

  /* ==================== G. NAIL SERVICES ==================== */
  buildServiceItem({
    id: 'gel-nail-extension',
    name: 'Gel Nail Extension',
    popularTitle: 'Nail Art & Extensions',
    popularSummary: 'Temporary, Acrylic & Gel Nail Extensions + Custom Nail Designs.',
    category: 'Nail Art & Extensions',
    shortDescription: 'Gel Nail Extensions shaped and finished with your choice of gel colour.',
    description:
      'Professional Gel Nail Extensions customized to your preferred nail length and shape, cured under UV/LED lamp and finished with gel polish.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.38_3ef1e822.jpeg',
    isClientPhoto: true,
    iconType: 'nails',
    featuredOnHome: true,
    benefits: [
      'Custom length and nail shape selection (almond, square, coffin, oval)',
      'UV/LED cured builder gel and gel colour finish',
    ],
    process: [
      'Natural nail prep and cuticle neatening',
      'Tip/form placement and builder gel sculpting under UV/LED lamp',
      'Shaping, gel colour application, and top coat',
    ],
  }),
  buildServiceItem({
    id: 'temporary-nail-extension',
    name: 'Temporary Nail Extension',
    category: 'Nail Art & Extensions',
    shortDescription: 'Event-ready Temporary Nail Extensions for weddings and festive occasions.',
    description:
      'Quick Temporary Nail Extensions ideal for brides and guests seeking instant nail length and colour for special events.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.38_3ef1e822.jpeg',
    isClientPhoto: true,
    iconType: 'nails',
    benefits: [
      'Convenient application for weddings, parties, and festivals',
      'Custom shape and colour styling',
    ],
    process: [
      'Nail surface cleaning and tip sizing',
      'Temporary extension application and shaping',
      'Polish and nail art finish',
    ],
  }),
  buildServiceItem({
    id: 'acrylic-nail-extension',
    name: 'Acrylic Nail Extension',
    category: 'Nail Art & Extensions',
    shortDescription: 'Sculpted Acrylic Nail Extensions with gel polish or bridal nail art.',
    description:
      'Durable Acrylic Nail Extensions sculpted and filed to your chosen shape, finished with gel polish or custom nail art.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.38_3ef1e822.jpeg',
    isClientPhoto: true,
    iconType: 'nails',
    benefits: [
      'Structured acrylic extension sculpting and filing',
      'Suitable for French tips, stones, and custom nail designs',
    ],
    process: [
      'Natural nail preparation and primer application',
      'Acrylic sculpting, shaping, and buffing',
      'Gel colour, art detailing, and top coat',
    ],
  }),
  buildServiceItem({
    id: 'custom-nail-designs',
    name: 'Custom Nail Designs',
    category: 'Nail Art & Extensions',
    shortDescription: 'Custom nail art including French tips, glitter, chrome, floral, and bridal motifs.',
    description:
      'Personalize your nails with Custom Nail Designs—ranging from French tips, ombré, glitter, and chrome effects to bridal nail art.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.38_3ef1e822.jpeg',
    isClientPhoto: true,
    iconType: 'nails',
    benefits: [
      'Custom colour and nail art matched to your outfit or event',
      'Hand-painted brush work, glitter, foil, and stone accents',
    ],
    process: [
      'Design and colour palette consultation',
      'Base preparation and custom nail art application',
      'Protective top coat curing',
    ],
  }),
];

export const COURSE_CATEGORIES: CourseCategory[] = [
  'Beauty Courses',
  'Makeup & Lashes',
  'Hair & Chemical',
  'Nails & Mehendi',
];

export interface ProposedCourseTrack {
  id: string;
  name: string;
  category: 'Beauty & Makeup Classes' | 'Sewing & Tailoring Classes' | 'Computer Classes';
  shortDescription: string;
  description: string;
  image: string;
  skills: string[];
  confirmationNote: string;
}

export const PROPOSED_PROGRAM_TRACKS: ProposedCourseTrack[] = [
  {
    id: 'beauty-makeup-basic-beauty-course',
    name: 'Basic Beauty Course',
    category: 'Beauty & Makeup Classes',
    shortDescription: 'Foundational beauty and grooming training for personal confidence and salon readiness.',
    description:
      'Proposed foundational beauty learning track covering personal grooming, skincare basics, makeup confidence, and salon hygiene practices. Final availability and timing will be confirmed by the foundation team.',
    image: '/assets/aistudio/IMG-20261115-WA0015_4521240a.jpg',
    skills: ['Skin care basics', 'Threading and waxing learning', 'Facial care basics', 'Personal grooming and hygiene'],
    confirmationNote: 'This proposed learning track is subject to final confirmation from the foundation team.',
  },
  {
    id: 'beauty-makeup-professional-makeup-training',
    name: 'Professional Makeup Training',
    category: 'Beauty & Makeup Classes',
    shortDescription: 'Practical instruction in occasion makeup, bridal styling, and client-ready finishing techniques.',
    description:
      'Proposed makeup training track for students interested in occasion looks, bridal finish, and professional event styling guidance. Batch timing and final class confirmation remain subject to foundation approval.',
    image: '/assets/Hero-Bride-Full.png',
    skills: ['Face prep and product understanding', 'Occasion and bridal makeup styles', 'Colour coordination and finishing', 'Client consultation and confidence building'],
    confirmationNote: 'This proposed pathway is contingent on final course confirmation and schedule approval.',
  },
  {
    id: 'beauty-makeup-bridal-makeup-training',
    name: 'Bridal Makeup Training',
    category: 'Beauty & Makeup Classes',
    shortDescription: 'Specialized bridal styling and event-ready makeup practice for aspiring artists.',
    description:
      'Proposed bridal makeup learning track covering traditional and contemporary bridal looks, styling continuity, and event preparation. Final course availability will be confirmed before admission.',
    image: '/assets/Hero-Bride-Full.png',
    skills: ['Bridal look planning', 'Traditional and modern styling', 'Event makeup finishing', 'Look retention and client coordination'],
    confirmationNote: 'This track is presented as a proposed offering and requires final confirmation from the foundation team.',
  },
  {
    id: 'beauty-makeup-hair-styling-training',
    name: 'Hair Styling Training',
    category: 'Beauty & Makeup Classes',
    shortDescription: 'Practical hair styling and finishing guidance for festive, bridal and everyday looks.',
    description:
      'Proposed hair styling learning track focused on sectioning, buns, curls, braids, and finishing work. Final timings and enrolment details are subject to confirmation by the academy team.',
    image: '/assets/aistudio/IMG-20261115-WA0005_b64d5d86.jpg',
    skills: ['Sectioning and styling basics', 'Curls and braids', 'Bridal hair finishing', 'Hair accessory styling'],
    confirmationNote: 'Course availability and schedule are proposed and will be confirmed by the foundation before registration.',
  },
  {
    id: 'beauty-makeup-skin-care-training',
    name: 'Skin Care Training',
    category: 'Beauty & Makeup Classes',
    shortDescription: 'Basic skincare, cleansing routines, and nourishing care practices for beauty learners.',
    description:
      'Proposed skincare track designed to help participants understand skin basics, product awareness, and calm, safe facial care practices. Final batch confirmation remains pending.',
    image: '/assets/aistudio/a56ffa136c6b74be1d46a7d979f0b9680e2735e59686290761232ec27ee87359_1865be6f.png',
    skills: ['Skin type awareness', 'Facial care basics', 'Safe product usage', 'Client communication'],
    confirmationNote: 'This is a proposed course pathway and not yet confirmed as a final enrolled batch.',
  },
  {
    id: 'beauty-makeup-nail-art-training',
    name: 'Nail Art Training',
    category: 'Beauty & Makeup Classes',
    shortDescription: 'Creative nail design and finishing training for personal and professional beauty services.',
    description:
      'Proposed nail art learning track with focus on hygiene, design practice, and finishing details for colorful, elegant nails. Final offerings will be confirmed by the team before admission.',
    image: '/assets/aistudio/0c48407f9d21c7e6ea382deb3d90283c9d08761d460e704333dc102cc6750e1c_e2372af5.png',
    skills: ['Nail prep and finishing', 'Design technique basics', 'Colour application', 'Creative detailing'],
    confirmationNote: 'Proposed topic only; final course confirmation and batch details are pending with the foundation team.',
  },
  {
    id: 'sewing-basic-sewing-training',
    name: 'Basic Sewing Training',
    category: 'Sewing & Tailoring Classes',
    shortDescription: 'Foundational sewing skills for practical garment making and confidence building.',
    description:
      'Proposed sewing training pathway introducing learners to hand and machine sewing fundamentals, pattern understanding, and practical garment-making basics. Final availability will be confirmed by the foundation staff.',
    image: '/assets/academy/tailoring.jpg',
    skills: ['Machine basics', 'Stitch types', 'Fabric handling', 'Pattern reading basics'],
    confirmationNote: 'This proposed class is subject to final confirmation by the foundation team.',
  },
  {
    id: 'sewing-stitching-tailoring',
    name: 'Stitching and Tailoring',
    category: 'Sewing & Tailoring Classes',
    shortDescription: 'Tailoring practice for practical garment shaping and finishing.',
    description:
      'Proposed tailoring pathway focused on measurement basics, garment shaping, and finishing techniques. Final class schedule and admission details remain to be confirmed.',
    image: '/assets/academy/tailoring.jpg',
    skills: ['Measurement basics', 'Garment shaping', 'Finishing standards', 'Practical tailoring workflow'],
    confirmationNote: 'This learning track is proposed only until the foundation confirms its current schedule and availability.',
  },
  {
    id: 'sewing-dress-designing',
    name: 'Dress Designing',
    category: 'Sewing & Tailoring Classes',
    shortDescription: 'Creative dress construction and design learning for beginners and aspiring tailors.',
    description:
      'Proposed dress design learning track covering simple silhouette planning, pattern understanding, and creating well-fitted garments. Final batch confirmation is pending.',
    image: '/assets/academy/tailoring.jpg',
    skills: ['Design planning', 'Fabric matching', 'Pattern basics', 'Assembly techniques'],
    confirmationNote: 'Proposed course outline; the final schedule will be shared by the foundation after confirmation.',
  },
  {
    id: 'sewing-blouse-stitching',
    name: 'Blouse Stitching',
    category: 'Sewing & Tailoring Classes',
    shortDescription: 'Focused blouse construction with fit, finishing and tailoring attention.',
    description:
      'Proposed blouse stitching pathway highlighting fitting basics, correct seam work, and finishing quality. Final course availability remains subject to confirmation.',
    image: '/assets/academy/tailoring.jpg',
    skills: ['Fit basics', 'Blouse construction', 'Finishing details', 'Practical tailoring practice'],
    confirmationNote: 'Course details and timings are proposed and are subject to final confirmation by the foundation.',
  },
  {
    id: 'sewing-practical-sewing-training',
    name: 'Practical Sewing Training',
    category: 'Sewing & Tailoring Classes',
    shortDescription: 'Hands-on learning for garment-making confidence and tailoring skills.',
    description:
      'Proposed practical sewing pathway with guided hands-on sessions for learners wanting to build real tailoring confidence. Final batch confirmation is pending with the team.',
    image: '/assets/academy/tailoring.jpg',
    skills: ['Hands-on practice', 'Garment assembly', 'Finishing details', 'Confidence-building skill work'],
    confirmationNote: 'This course pathway is presented as a proposal and will be confirmed by the foundation before enrolment.',
  },
  {
    id: 'computer-basic-computer-training',
    name: 'Basic Computer Training',
    category: 'Computer Classes',
    shortDescription: 'Foundation digital skills for everyday usage, productivity, and confidence building.',
    description:
      'Proposed beginner computer learning path focused on digital literacy, keyboard skills, and essential office applications. Final class details and timings are subject to confirmation by the team.',
    image: '/assets/academy/vocational.jpg',
    skills: ['Computer basics', 'Keyboard use', 'Operating system fundamentals', 'Digital confidence'],
    confirmationNote: 'This is a proposed class and requires final confirmation from the foundation before enrolment.',
  },
];

const STANDARD_CERT_HEADLINE = 'Government Certificate & ISO-Related Certification';
const STANDARD_CERT_NOTE =
  'Certificate details and course recognition are available from the academy.';

/**
 * 9 Actual Academy Courses supplied by the client:
 * 1. Basic Beauty Course
 * 2. Advanced Beauty Course
 * 3. Mehendi Course
 * 4. Nails Course
 * 5. Chemical Course
 * 6. Makeup Course
 * 7. Hairstyles Course
 * 8. PMU Permanent Makeup Course
 * 9. Eyelashes Course
 * No invented courses, durations, or prices.
 */
export const COURSES: CourseItem[] = [
  {
    id: 'basic-beauty-course',
    courseNumber: 1,
    name: 'Basic Beauty Course',
    category: 'Beauty Courses',
    shortDescription:
      'Foundational beauty parlour training covering threading, waxing, bleach, basic facials, manicure, pedicure, and studio hygiene.',
    description:
      'Designed for beginners beginning their journey in beauty and vocational skills, the Basic Beauty Course builds a practical foundation in personal grooming, hygiene, and confidence-building guidance.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.38__1__b3134fa2.jpeg',
    isClientPhoto: true,
    certification: STANDARD_CERT_HEADLINE,
    certificationNote: STANDARD_CERT_NOTE,
    feeNote: 'Course Fee & Duration on Enquiry',
    syllabus: [
      'Threading techniques: Eyebrow shaping, upper lips, and forehead',
      'Waxing fundamentals: Hand wax, leg wax, and skin-safe hygiene practices',
      'Bleach application and skin sensitivity checks',
      'Basic cleansing and facial steps with massage strokes',
      'Manicure and pedicure hand & foot care basics',
      'Salon sanitation, workstation setup, and client handling',
    ],
    practicalFocus: [
      'Hands-on practice sessions under trainer supervision',
      'Step-by-step live demonstrations in our Vadodara studio classroom',
    ],
    whoShouldJoin: [
      'Beginners looking to start a career in beauty services',
      'Aspiring home-salon or studio beauticians',
    ],
  },
  {
    id: 'advanced-beauty-course',
    courseNumber: 2,
    name: 'Advanced Beauty Course',
    category: 'Beauty Courses',
    shortDescription:
      'Advanced skin care, specialized facials, back & head massage, hair spa rituals, and complete salon grooming.',
    description:
      'Take your beauty skills to professional studio standards. The Advanced Beauty Course covers skin consultation, customized facial rituals, back & head massage therapies, hair spa, and complete client care.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.38_3ef1e822.jpeg',
    isClientPhoto: true,
    certification: STANDARD_CERT_HEADLINE,
    certificationNote: STANDARD_CERT_NOTE,
    feeNote: 'Course Fee & Duration on Enquiry',
    syllabus: [
      'Skin type consultation and customized facial selection',
      'Advanced facial massage techniques and mask care',
      'Back massage and head massage relaxation protocols',
      'Hair spa and permanent hair spa conditioning treatments',
      'Advanced waxing and pre-bridal grooming routines',
      'Salon workflow management and client consultation skills',
    ],
    practicalFocus: [
      'Supervised live practicals in our studio environment',
      'Personalized feedback from academy faculty',
    ],
    whoShouldJoin: [
      'Learners seeking beginner-to-advanced beauty training',
      'Practicing beauticians upgrading their salon skills',
    ],
  },
  {
    id: 'mehendi-course',
    courseNumber: 3,
    name: 'Mehendi Course',
    category: 'Nails & Mehendi',
    shortDescription:
      'Learn cone control, traditional Indian & Arabic patterns, bridal full-hand and foot mehendi, and motif artistry.',
    description:
      'Master traditional and contemporary henna design in our dedicated Mehendi Course. Students learn smooth cone handling, intricate grid fillings, floral vines, and bridal full-hand compositions.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.36_bd9ccbf9.jpeg',
    isClientPhoto: true,
    certification: STANDARD_CERT_HEADLINE,
    certificationNote: STANDARD_CERT_NOTE,
    feeNote: 'Course Fee & Duration on Enquiry',
    syllabus: [
      'Mehendi paste consistency, cone rolling, and clean line control',
      'Basic shapes: leaves, vines, paisley, mandalas, and shading',
      'Arabic, Indo-Arabic, and festive party mehendi layouts',
      'Traditional Gujarati & Rajasthani bridal full-hand and foot mehendi designs',
      'Bridal motifs, negative-space techniques, and stain care tips',
    ],
    practicalFocus: [
      'Guided sheet practice progressing to live hand application',
      'Symmetry and neatness building for bridal bookings',
    ],
    whoShouldJoin: [
      'Aspiring bridal and festive mehendi artists',
      'Beauticians expanding their wedding season service offerings',
    ],
  },
  {
    id: 'nails-course',
    courseNumber: 4,
    name: 'Nails Course',
    category: 'Nails & Mehendi',
    shortDescription:
      'Professional training in temporary, acrylic, and gel nail extensions, gel polish application, and custom nail art designs.',
    description:
      'Become a skilled nail technician with hands-on training in nail prep, Temporary Nail Extensions, Acrylic Nail Extensions, Gel Nail Extensions, and creative Custom Nail Designs.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-04_at_7.13.59_AM_cde79219.jpeg',
    isClientPhoto: true,
    certification: STANDARD_CERT_HEADLINE,
    certificationNote: STANDARD_CERT_NOTE,
    feeNote: 'Course Fee & Duration on Enquiry',
    syllabus: [
      'Nail anatomy, hygiene, cuticle preparation, and tool sanitation',
      'Temporary nail extension sizing, application, and shaping',
      'Gel nail extensions: tip application, builder gel sculpting, and UV/LED curing',
      'Acrylic nail extensions: bead control, apex building, and filing',
      'Custom nail designs: French tips, chrome, glitter, ombré, and bridal nail art',
      'Safe extension refill and removal practices',
    ],
    practicalFocus: [
      'Practice on nail trainers and live hands in the studio',
      'Focus on clean cuticle work and extension shaping',
    ],
    whoShouldJoin: [
      'Aspiring nail technicians and independent nail artists',
      'Salon professionals adding nail extension services',
    ],
  },
  {
    id: 'chemical-course',
    courseNumber: 5,
    name: 'Chemical Course',
    category: 'Hair & Chemical',
    shortDescription:
      'Specialized hair chemical training in Hair Smoothing, Keratin Treatment, KeraSmooth, Protein Treatment, Nanoplasty, and Hair Colour.',
    description:
      'Learn salon hair chemical services with proper consultation and safety protocols. The Chemical Course covers Hair Smoothing, Keratin, KeraSmooth, Protein Treatment, Nanoplasty, Root Touch-up, Global Hair Colour, and Highlights.',
    image: '/assets/aistudio/d0868b9e9d349abc4560507cf4d0d4e22399c51842a827fdda56740b37f65356__1__936098f6.png',
    isClientPhoto: true,
    certification: STANDARD_CERT_HEADLINE,
    certificationNote: STANDARD_CERT_NOTE,
    feeNote: 'Course Fee & Duration on Enquiry',
    syllabus: [
      'Hair structure, strand testing, and chemical history consultation',
      'Hair Smoothing & KeraSmooth step-by-step application and thermal ironing',
      'Keratin Treatment, Protein Treatment, and Nanoplasty protocols',
      'Colour theory: Root Touch-up, Global Hair Colour, and foil Highlights',
      'Temperature control, sectioning accuracy, and post-chemical aftercare',
    ],
    practicalFocus: [
      'Live salon demonstrations and supervised chemical application sessions',
      'Safety protocols for hair chemical processing',
    ],
    whoShouldJoin: [
      'Hair stylists and beauticians seeking training in chemical hair treatments',
      'Salon owners upgrading their hair treatment menu',
    ],
  },
  {
    id: 'makeup-course',
    courseNumber: 6,
    name: 'Makeup Course',
    category: 'Makeup & Lashes',
    shortDescription:
      'Complete makeup artistry covering Self Makeup, Party Wear, Haldi, Sangeet / Society Look, Bridal, and Reception Makeup.',
    description:
      'Learn professional makeup artistry from skin prep to bridal looks. Our Makeup Course covers colour correction, foundation matching, eye makeup variations, outfit draping, and occasion looks.',
    image: '/assets/aistudio/1ce556a5d380cb9c8c076b2911ef17f392df39fd7e42a959ee5331c0695f793e_46652974.png',
    isClientPhoto: true,
    certification: STANDARD_CERT_HEADLINE,
    certificationNote: STANDARD_CERT_NOTE,
    feeNote: 'Course Fee & Duration on Enquiry',
    syllabus: [
      'Skin preparation, undertone identification, and brush hygiene',
      'Colour correction, foundation matching, contouring, and highlighting',
      'Self Makeup & Party Wear Makeup looks',
      'Haldi Look Makeup & Sangeet / Society Look Makeup',
      'Traditional & modern Bridal Makeup and Reception Makeup',
      'Lash application, jewellery setting, and saree/dupatta draping',
    ],
    practicalFocus: [
      'Hands-on practice sessions creating bridal and occasion looks',
      'Guidance on client consultation and portfolio presentation',
    ],
    whoShouldJoin: [
      'Aspiring freelance and salon bridal makeup artists',
      'Beauticians looking to learn bridal & occasion makeup techniques',
    ],
  },
  {
    id: 'hairstyles-course',
    courseNumber: 7,
    name: 'Hairstyles Course',
    category: 'Hair & Chemical',
    shortDescription:
      'Master Loban, Messy Bun, traditional & modern Braids, Open Hair Hairstyles, thermal curls, and bridal hair accessorizing.',
    description:
      'Dedicated hairstyling training for weddings, parties, and salon events. Learn sectioning, backcombing, thermal curling/waving, Loban buns, Messy Buns, Braids, and Open Hair Hairstyles.',
    image: '/assets/aistudio/d0868b9e9d349abc4560507cf4d0d4e22399c51842a827fdda56740b37f65356__1__936098f6.png',
    isClientPhoto: true,
    certification: STANDARD_CERT_HEADLINE,
    certificationNote: STANDARD_CERT_NOTE,
    feeNote: 'Course Fee & Duration on Enquiry',
    syllabus: [
      'Hair prep, blow-dry volume, crimping, and thermal tool handling',
      'Loban bun construction, padding, and secure bridal pinning',
      'Textured Messy Bun and modern reception updos',
      'Braids: French, fishtail, crown braids, and traditional bridal braids',
      'Open Hair Hairstyles: soft waves, curls, and half-up styles',
      'Floral gajra, hair jewellery, and dupatta pinning security',
    ],
    practicalFocus: [
      'Dummy-head and live model hairstyling practice',
      'Techniques for secure, long-lasting event pinning',
    ],
    whoShouldJoin: [
      'Makeup artists wanting to offer complete hair + makeup bridal packages',
      'Aspiring hairstylists and beauty academy students',
    ],
  },
  {
    id: 'pmu-permanent-makeup-course',
    courseNumber: 8,
    name: 'PMU Permanent Makeup Course',
    category: 'Makeup & Lashes',
    shortDescription:
      'Specialized training in Permanent Makeup (PMU) fundamentals, brow mapping, hygiene, and aesthetic techniques.',
    description:
      'Explore modern aesthetic beauty with our PMU Permanent Makeup Course. Students learn facial symmetry mapping, hygiene and safety standards, pigment theory, and supervised practice techniques.',
    image: '/assets/aistudio/8_7b92f75e.jpeg',
    isClientPhoto: true,
    certification: STANDARD_CERT_HEADLINE,
    certificationNote: STANDARD_CERT_NOTE,
    feeNote: 'Course Fee & Duration on Enquiry',
    syllabus: [
      'Introduction to Permanent Makeup (PMU) concepts and client suitability',
      'Strict hygiene, sterilization, and workstation safety protocols',
      'Brow mapping, facial symmetry measurement, and shape design',
      'Pigment colour theory and skin undertone considerations',
      'Practice pad training and aftercare consultation guidelines',
    ],
    practicalFocus: [
      'Precision mapping and latex practice before supervised sessions',
      'Emphasis on hygiene, safety, and natural aesthetic results',
    ],
    whoShouldJoin: [
      'Beauty professionals and makeup artists expanding into PMU services',
    ],
  },
  {
    id: 'eyelashes-course',
    courseNumber: 9,
    name: 'Eyelashes Course',
    category: 'Makeup & Lashes',
    shortDescription:
      'Professional eyelash extension, lash styling, isolation, mapping, and safe removal training.',
    description:
      'Learn eye-enhancing lash services in our Eyelashes Course. Covers lash mapping for different eye shapes, precision isolation, adhesive safety, classic and volume lash styling, and safe removal.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_12.05.25_AM_9124ac94.jpeg',
    isClientPhoto: true,
    certification: STANDARD_CERT_HEADLINE,
    certificationNote: STANDARD_CERT_NOTE,
    feeNote: 'Course Fee & Duration on Enquiry',
    syllabus: [
      'Natural lash cycle, eye safety, and sanitation standards',
      'Eye-shape analysis and custom lash length/curl mapping',
      'Tweezer control, single-lash isolation, and adhesive bonding',
      'Classic and volume eyelash styling techniques',
      'Lash infill maintenance, aftercare instructions, and safe removal',
    ],
    practicalFocus: [
      'Mannequin lash strip and supervised practical training',
      'Focus on comfort, symmetry, and lash hygiene',
    ],
    whoShouldJoin: [
      'Beauty students, makeup artists, and nail/lash studio technicians',
    ],
  },
];

/**
 * Portfolio Gallery containing ONLY authentic client-supplied photographs and videos
 * from Sonu Foundation and Charitable Trust in Vadodara.
 */
export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-academy-batch-1',
    title: 'Sonu Foundation and Charitable Trust — Faculty & Student Batch',
    subtitle: 'Our academy mentor and students in uniform at our Vadodara training studio',
    category: 'Academy',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.38__1__b3134fa2.jpeg',
  },
  {
    id: 'gal-academy-uniform-batch',
    title: 'Sonu’s Beauty Studio & Academy — SBS Batch & Mentor',
    subtitle: 'Academy students in uniform with their mentor inside our Vadodara training studio',
    category: 'Academy',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_11.46.30_PM_6aa85b67.jpeg',
  },
  {
    id: 'gal-students-braids-practice',
    title: 'Braided Hairstyling Practical Batch',
    subtitle: 'Academy students displaying their intricate braided hairstyling work inside the Vadodara studio',
    category: 'Students',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_11.45.42_PM_de8d93ec.jpeg',
  },
  {
    id: 'gal-students-garba-styling',
    title: 'Navratri & Garba Traditional Styling Showcase',
    subtitle: 'Students and models styled in festive Garba makeup, hairstyling, and traditional attire at our studio',
    category: 'Students',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_11.45.28_PM_9e75cfdf.jpeg',
  },
  {
    id: 'gal-students-studio-uniform-batch',
    title: 'SBS Uniformed Student Batch & Mentor',
    subtitle: 'Academy learners in uniform with their founder and mentor inside Sonu’s Beauty Studio & Academy',
    category: 'Students',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_11.46.30_PM_6aa85b67.jpeg',
  },
  {
    id: 'gal-students-seminar-stage',
    title: 'Beauty & Makeup Seminar — Student Delegation',
    subtitle: 'Students and faculty attending a professional beauty & makeup seminar',
    category: 'Students',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_11.46.39_PM__1__f0b95ded.jpeg',
  },
  {
    id: 'gal-students-outdoor-meetup',
    title: 'Academy Batch — Beauty Event Meetup',
    subtitle: 'Sonu’s Beauty Studio & Academy students and mentor together at an outdoor beauty event',
    category: 'Students',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-07_at_7.05.22_AM_cf4108bd_cf4108bd.jpeg',
  },
  {
    id: 'gal-students-outdoor-arch',
    title: 'Academy Student Batch — Outdoor Gathering',
    subtitle: 'Students with the founder in front of a floral arch during an academy event',
    category: 'Students',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-07_at_7.10.53_AM_f6c77a29_f6c77a29.jpeg',
  },
  {
    id: 'gal-students-1',
    title: 'Certified Academy Graduates — Batch Showcase',
    subtitle: 'Students holding their beauty and vocational certificates at Sonu Foundation and Charitable Trust',
    category: 'Students',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.36_bd9ccbf9.jpeg',
    isCertificate: true,
  },
  {
    id: 'gal-salon-1',
    title: 'Sonu’s Beauty Studio Interior & Workstations',
    subtitle: 'Real studio interior, styling chairs, mirrors & salon workstations in Vadodara',
    category: 'Salon',
    src: '/assets/aistudio/7_25ba3f99.jpeg',
  },
  {
    id: 'gal-certificates-celebrity-award-trophy',
    title: 'Vadodara Grand Celebrity Award & Creative Seminar',
    subtitle: 'Founder honored on stage with the Vadodara Grand Celebrity Award & Creative Seminar trophy',
    category: 'Certificates',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_11.45.27_PM_0afa9148.jpeg',
    isCertificate: true,
  },
  {
    id: 'gal-certificates-diploma-studio',
    title: 'Diploma in Beauty Therapy — Certificate Batch',
    subtitle: 'Graduating students holding their Govt. Approved Sonu Foundation Charitable Trust (Regd. No. E/8791) certificates inside the studio',
    category: 'Certificates',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_11.46.21_PM_e7efa990.jpeg',
    isCertificate: true,
  },
  {
    id: 'gal-certificates-award-seminar',
    title: 'Vadodara Grand Celebrity Award Show & Seminar Certificates',
    subtitle: 'Academy students, bridal models, and mentor celebrating on stage with their seminar certificates',
    category: 'Certificates',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_11.45.27_PM__1__00f30456.jpeg',
    isCertificate: true,
  },
  {
    id: 'gal-certificates-outdoor-convocation',
    title: 'Graduating Batch Outdoor Certificate Ceremony',
    subtitle: 'Students and founder celebrating with their Sonu Foundation Charitable Trust Diploma in Beauty Therapy certificates',
    category: 'Certificates',
    src: '/assets/aistudio/3g3t3_86a0b3bb_86a0b3bb.jpeg',
    isCertificate: true,
  },
  {
    id: 'gal-certificates-1',
    title: 'First Batch Certified Graduates — Academy Showcase',
    subtitle: 'First batch students holding their Sonu Foundation & Charitable Trust certificates',
    category: 'Certificates',
    src: '/assets/aistudio/8_7b92f75e.jpeg',
    isCertificate: true,
  },
  {
    id: 'gal-academy-1',
    title: 'Academy Student Batch & Studio Showcase',
    subtitle: 'Students training with Sonu Foundation and Charitable Trust, Vadodara',
    category: 'Academy',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.38_3ef1e822.jpeg',
  },
  {
    id: 'gal-academy-classroom-12',
    title: 'Academy Classroom Theory & Guidance Session',
    subtitle: 'Instructor conducting a classroom session with students at Sonu Foundation and Charitable Trust',
    category: 'Academy',
    src: '/assets/aistudio/12_a402bff7.jpeg',
  },
  {
    id: 'gal-certificates-batch-blue',
    title: 'Graduating Student Batch with Certificates',
    subtitle: 'Academy students and mentor celebrating course completion in Vadodara',
    category: 'Certificates',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-04_at_7.13.59_AM_cde79219.jpeg',
    isCertificate: true,
  },
  {
    id: 'gal-certificates-first-batch',
    title: 'First Batch Certificate Ceremony',
    subtitle: 'Students proudly displaying their completion certificates',
    category: 'Students',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-04_at_7.39.12_AM_41590311.jpeg',
    isCertificate: true,
  },
  {
    id: 'gal-makeup-hero',
    title: 'Bridal & Festive Makeup Session',
    subtitle: 'Real studio makeup artistry and client finishing session at Sonu’s Beauty Studio & Academy',
    category: 'Makeup',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-05_at_1.20.27_AM_6ddc0b3e_6ddc0b3e.jpeg',
  },
  {
    id: 'gal-video-10',
    title: 'Hands-On Hand & Nail Care Practice Session',
    subtitle: 'Students practicing paired hand care and client consultation techniques in the studio',
    category: 'Videos',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.38_3ef1e822.jpeg',
    videoSrc: '/assets/aistudio/WhatsApp_Video_2026-11-12_at_11.46.35_PM_9a292478.mp4',
    isVideo: true,
  },
  {
    id: 'gal-video-11',
    title: 'Practical Arm Massage & Care Training',
    subtitle: 'Guided group practice session on spa massage and client comfort in our Vadodara studio',
    category: 'Videos',
    src: '/assets/aistudio/7_25ba3f99.jpeg',
    videoSrc: '/assets/aistudio/WhatsApp_Video_2026-11-12_at_11.46.36_PM_96c23fa5.mp4',
    isVideo: true,
  },
  {
    id: 'gal-video-12',
    title: 'Academy Classroom Motivation & Batch Session',
    subtitle: 'Students in uniform cheering during an interactive classroom session at Sonu’s Beauty Studio & Academy',
    category: 'Videos',
    src: '/assets/aistudio/12_a402bff7.jpeg',
    videoSrc: '/assets/aistudio/WhatsApp_Video_2026-11-12_at_11.46.38_PM_7897a4fa.mp4',
    isVideo: true,
  },
  {
    id: 'gal-video-13',
    title: 'Live Bridal Hairstyling Demo & Applause',
    subtitle: 'Academy students appreciating a live hairstyling demonstration in the studio',
    category: 'Videos',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.38__1__b3134fa2.jpeg',
    videoSrc: '/assets/aistudio/WhatsApp_Video_2026-11-12_at_11.46.41_PM_b37d3ddb.mp4',
    isVideo: true,
  },
  {
    id: 'gal-video-14',
    title: 'SBS Student Work & Studio Practice Reel',
    subtitle: 'Uniformed academy learners practicing live beauty techniques at the studio workstations',
    category: 'Videos',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.38__1__b3134fa2.jpeg',
    videoSrc: '/assets/aistudio/WhatsApp_Video_2026-11-12_at_11.46.44_PM_fe6a5ce4.mp4',
    isVideo: true,
  },
  {
    id: 'gal-video-15',
    title: 'Beauty Seminar & Certificate Showcase Reel',
    subtitle: 'Academy students and faculty showcasing seminar participation and certificates',
    category: 'Videos',
    src: '/assets/aistudio/8_7b92f75e.jpeg',
    videoSrc: '/assets/aistudio/WhatsApp_Video_2026-11-12_at_11.46.47_PM_870411fd.mp4',
    isVideo: true,
  },
  {
    id: 'gal-video-6',
    title: 'Studio Tour & Basic to Advance Courses Reel',
    subtitle: 'Full tour of Sonu’s Beauty Studio & Academy (Somatalav, Waghodia Road) featuring live training & government certification',
    category: 'Videos',
    src: '/assets/aistudio/7_25ba3f99.jpeg',
    videoSrc: '/assets/aistudio/WhatsApp_Video_2026-11-12_at_11.46.20_PM_bed0012e.mp4',
    isVideo: true,
  },
  {
    id: 'gal-video-7',
    title: 'Studio Batch Certificate Celebration',
    subtitle: 'Students proudly celebrating with their Sonu Foundation & Charitable Trust completion certificates',
    category: 'Videos',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.36_bd9ccbf9.jpeg',
    videoSrc: '/assets/aistudio/WhatsApp_Video_2026-11-12_at_11.46.23_PM_e68bb866.mp4',
    isVideo: true,
  },
  {
    id: 'gal-video-8',
    title: 'Khodiyar Nagar Batch Group Showcase',
    subtitle: 'Academy student batch and mentor at our Khodiyar Nagar branch in Vadodara',
    category: 'Videos',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-04_at_7.13.59_AM_cde79219.jpeg',
    videoSrc: '/assets/aistudio/WhatsApp_Video_2026-11-12_at_11.46.26_PM_981a9de5.mp4',
    isVideo: true,
  },
  {
    id: 'gal-video-9',
    title: 'Khodiyar Nagar Certificate Distribution Reel',
    subtitle: 'Graduating students displaying their Sonu Foundation & Charitable Trust certificates at Khodiyar Nagar',
    category: 'Videos',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-04_at_7.39.12_AM_41590311.jpeg',
    videoSrc: '/assets/aistudio/WhatsApp_Video_2026-11-12_at_11.46.28_PM_af76d672.mp4',
    isVideo: true,
  },
  {
    id: 'gal-video-1',
    title: 'Academy Hands-On Practical Training Reel',
    subtitle: 'Practical wellness and grooming session inside Sonu Foundation and Charitable Trust in Vadodara',
    category: 'Videos',
    src: '/assets/aistudio/7_25ba3f99.jpeg',
    videoSrc: '/assets/aistudio/WhatsApp_Video_2026-11-03_at_19.59.37__3__33c549f1.mp4',
    isVideo: true,
  },
  {
    id: 'gal-video-2',
    title: 'Bridal Makeup & Academy Courses Showcase Reel',
    subtitle: 'Beauty guidance, styling support, and skill-building sessions at Sonu Foundation and Charitable Trust',
    category: 'Videos',
    src: '/assets/Hero-Bride-Full.png',
    videoSrc: '/assets/aistudio/WhatsApp_Video_2026-11-03_at_19.59.38_4c6c0bcf.mp4',
    isVideo: true,
  },
  {
    id: 'gal-video-3',
    title: 'Live Threading & Grooming Practical Session',
    subtitle: 'Students practicing precision threading and client care in our studio training session',
    category: 'Videos',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.38__1__b3134fa2.jpeg',
    videoSrc: '/assets/aistudio/WhatsApp_Video_2026-11-03_at_19.59.35__1__0c692fb6.mp4',
    isVideo: true,
  },
  {
    id: 'gal-video-4',
    title: 'Hair Styling & Thermal Straightening Practical',
    subtitle: 'Hands-on hair styling and sectioning practice by students at Sonu Foundation and Charitable Trust',
    category: 'Videos',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.38_3ef1e822.jpeg',
    videoSrc: '/assets/aistudio/WhatsApp_Video_2026-11-03_at_19.59.35_c5a50bcc.mp4',
    isVideo: true,
  },
  {
    id: 'gal-video-5',
    title: 'Academy Certificate Celebration Reel',
    subtitle: 'Graduating students celebrating with their certificates at Sonu Foundation and Charitable Trust',
    category: 'Videos',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.59.36_bd9ccbf9.jpeg',
    videoSrc: '/assets/aistudio/6_93eb0fc1.mp4',
    isVideo: true,
  },
];

/**
 * Unverified/fabricated customer reviews are removed by default.
 * Real verified testimonials can be injected via configuration when provided by the business.
 */
export const VERIFIED_REVIEWS: ReviewItem[] = [];

export const TIME_SLOTS: string[] = [
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
  '07:30 PM',
];
