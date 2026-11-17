export interface BusinessConfig {
  brandName: string;
  tagline: string;
  ratingScore: string;
  googlePlaceId: string;
  googleReviewUrl: string;
  whatsappNumber: string;
  phoneNumber: string;
  googleMapsUrl: string;
}

export type LanguageCode = 'en' | 'hi';

export const OFFICIAL_PLACE_ID = 'ChIJ1xX6xCxX7TkRdG63czwnwl4';
export const PLACE_ID_PLACEHOLDER = OFFICIAL_PLACE_ID;
export const DIRECT_REVIEW_BASE_URL = 'https://search.google.com/local/writereview?placeid=';
export const OFFICIAL_DIRECT_REVIEW_URL = `${DIRECT_REVIEW_BASE_URL}${OFFICIAL_PLACE_ID}`;
export const VERIFIED_GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/dwE5PcNKmdtwoz3N6';
export const OFFICIAL_PHONE_NUMBER = '09798040975';
export const OFFICIAL_WHATSAPP_NUMBER = '9109798040975';

export interface ServiceOption {
  id:
    | 'Pipe Leakage Repair'
    | 'Tap Fitting'
    | 'Emergency Plumber'
    | 'Water Tank Cleaning'
    | 'Bathroom Fitting'
    | 'Fast Service';
  en: string;
  hi: string;
}

export const SERVICE_OPTIONS: readonly ServiceOption[] = [
  {
    id: 'Pipe Leakage Repair',
    en: 'Pipe Leakage Repair',
    hi: 'पाइप लीकेज सुधार',
  },
  {
    id: 'Tap Fitting',
    en: 'Tap Fitting',
    hi: 'नल फिटिंग',
  },
  {
    id: 'Emergency Plumber',
    en: 'Emergency Plumber',
    hi: 'इमरजेंसी प्लंबर',
  },
  {
    id: 'Water Tank Cleaning',
    en: 'Water Tank Cleaning',
    hi: 'पानी टंकी सफाई',
  },
  {
    id: 'Bathroom Fitting',
    en: 'Bathroom Fitting',
    hi: 'बाथरूम फिटिंग',
  },
  {
    id: 'Fast Service',
    en: 'Fast Service',
    hi: 'फास्ट सर्विस',
  },
] as const;

export type ServiceTagId = ServiceOption['id'];

export const SERVICE_TAGS: readonly ServiceTagId[] = SERVICE_OPTIONS.map((item) => item.id);

export function getServiceLabel(id: ServiceTagId, lang: LanguageCode): string {
  const found = SERVICE_OPTIONS.find((item) => item.id === id);
  return found ? found[lang] : id;
}

export function buildDirectReviewUrl(placeId: string): string {
  const trimmed = placeId.trim();
  if (!trimmed) {
    return OFFICIAL_DIRECT_REVIEW_URL;
  }
  return `${DIRECT_REVIEW_BASE_URL}${encodeURIComponent(trimmed)}`;
}

export function isConfiguredPlaceId(placeId?: string): boolean {
  const trimmed = (placeId ?? '').trim();
  if (!trimmed) return false;
  if (
    trimmed.includes('INSERT_YOUR_PLACE_ID') ||
    trimmed.includes('YOUR_PLACE_ID') ||
    trimmed.includes('YOUR_GOOGLE_PLACE_ID') ||
    trimmed.includes('[') ||
    trimmed.includes(']')
  ) {
    return false;
  }
  return trimmed.length >= 6;
}

export function resolveGoogleReviewRedirectUrl(
  config: Pick<BusinessConfig, 'googlePlaceId' | 'googleReviewUrl' | 'googleMapsUrl'>
): string {
  const fallback = getSafeGoogleUrl(config.googleMapsUrl);

  if (isConfiguredPlaceId(config.googlePlaceId)) {
    return buildDirectReviewUrl(config.googlePlaceId);
  }

  const rawReviewUrl = (config.googleReviewUrl ?? '').trim();
  if (
    rawReviewUrl &&
    !rawReviewUrl.includes('INSERT_YOUR_PLACE_ID') &&
    !rawReviewUrl.includes('YOUR_PLACE_ID') &&
    !rawReviewUrl.includes('YOUR_GOOGLE_PLACE_ID') &&
    !rawReviewUrl.includes('[') &&
    !rawReviewUrl.includes(']')
  ) {
    try {
      const parsed = new URL(rawReviewUrl);
      if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
        return parsed.toString();
      }
    } catch {
      return fallback;
    }
  }

  return fallback;
}

export const DEFAULT_CONFIG: BusinessConfig = {
  brandName: 'Plumber Wallace',
  tagline: 'Reliable Plumbing Services at Your Doorstep',
  ratingScore: '4.9',
  googlePlaceId: OFFICIAL_PLACE_ID,
  googleReviewUrl: OFFICIAL_DIRECT_REVIEW_URL,
  whatsappNumber: OFFICIAL_WHATSAPP_NUMBER,
  phoneNumber: OFFICIAL_PHONE_NUMBER,
  googleMapsUrl: VERIFIED_GOOGLE_MAPS_URL,
};

export function getSafeGoogleUrl(url?: string): string {
  const trimmed = (url ?? '').trim();
  if (
    !trimmed ||
    trimmed.includes('INSERT_YOUR_PLACE_ID') ||
    trimmed.includes('YOUR_PLACE_ID') ||
    trimmed.includes('YOUR_GOOGLE_PLACE_ID') ||
    trimmed.includes('[') ||
    trimmed.includes(']')
  ) {
    return VERIFIED_GOOGLE_MAPS_URL;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
  } catch {
    // Fall back to verified Google Maps URL on invalid URL
  }
  return VERIFIED_GOOGLE_MAPS_URL;
}

export const REVIEW_TEMPLATES: Record<LanguageCode, Record<ServiceTagId, string[]>> = {
  en: {
    'Pipe Leakage Repair': [
      'Plumber Wallace provided excellent plumbing service. Very professional, punctual, and fixed the leakage instantly! Highly recommended.',
      'Had a hidden pipe leak fixed by Plumber Wallace today. Clean work, fair pricing, and zero mess left behind. Truly dependable!',
      'Quick diagnosis and permanent pipe leakage repair from Plumber Wallace. Arrived right on schedule and explained everything clearly.',
    ],
    'Tap Fitting': [
      'Plumber Wallace installed our new kitchen and bathroom taps neatly without any leaks. Polite technician and great value!',
      'Super clean tap fitting work by Plumber Wallace. Fast turnaround, proper tools, and transparent pricing. Five stars!',
      'Very satisfied with the mixer and tap replacement done by Plumber Wallace. Punctual, courteous, and thorough.',
    ],
    'Emergency Plumber': [
      'Called Plumber Wallace for an urgent midnight pipe burst and they arrived fast! Calm, skilled, and saved us from water damage.',
      'Best emergency plumbing response in the area. Plumber Wallace handled the shutoff and repair smoothly with honest rates.',
      'Lifesavers! Plumber Wallace responded immediately to our emergency call and restored water flow in under an hour.',
    ],
    'Water Tank Cleaning': [
      'Booked Plumber Wallace for overhead water tank cleaning and valve check. Hygienic, thorough, and super punctual team!',
      'Our water tank is spotless thanks to Plumber Wallace. They sanitized everything properly and checked the float valve too.',
      'Great experience with Plumber Wallace for tank cleaning and motor line maintenance. Honest pricing and reliable staff.',
    ],
    'Bathroom Fitting': [
      'Plumber Wallace completed our bathroom fitting and shower installation with great precision. Everything works smoothly!',
      'Clean workmanship on our bathroom fixtures and flush tank repair by Plumber Wallace. Neat finish and on-time service.',
      'Highly recommend Plumber Wallace for bathroom fittings. Skilled technician, zero damage to tiles, and very reasonable charges.',
    ],
    'Fast Service': [
      'Plumber Wallace provided excellent plumbing service. Very professional, punctual, and fixed the issue quickly! Highly recommended.',
      'Super fast service at our doorstep from Plumber Wallace. Booking was effortless and the repair was completed in one visit.',
      'Impressed by how fast and tidy Plumber Wallace worked. Honest quote upfront and top-quality repair.',
    ],
  },
  hi: {
    'Pipe Leakage Repair': [
      'Plumber Wallace ने पाइप लीकेज सुधार का काम बहुत ही सफाई और तेजी से किया। समय पर आए और काम बहुत बढ़िया रहा। सभी को सुझाव दूंगा!',
      'बहुत ही भरोसेमंद और प्रोफेशनल प्लंबिंग सर्विस। Plumber Wallace ने बिना किसी तोड़फोड़ के लीकेज तुरंत बंद कर दी।',
    ],
    'Tap Fitting': [
      'Plumber Wallace से नल फिटिंग और मिक्सर का काम करवाया। काम बहुत ही साफ-सुथरा और मजबूत है। वाजिब दाम और बढ़िया व्यवहार।',
      'नल फिटिंग के लिए Plumber Wallace की सर्विस शानदार रही। समय पर आना और बढ़िया काम इनकी खासियत है।',
    ],
    'Emergency Plumber': [
      'इमरजेंसी में Plumber Wallace को कॉल किया और वे बहुत जल्दी घर पहुंच गए। तुरंत रिपेयर करके बड़ा नुकसान बचा लिया। धन्यवाद!',
      '24/7 इमरजेंसी प्लंबर सेवा के लिए Plumber Wallace सबसे बेहतरीन हैं। तेज रिस्पॉन्स और ईमानदार चार्ज।',
    ],
    'Water Tank Cleaning': [
      'Plumber Wallace से पानी टंकी सफाई करवाई। पूरी टंकी बिल्कुल साफ और हाइजीनिक कर दी। बहुत ही मेहनती टीम!',
      'पानी टंकी सफाई और वाल्व चेक के लिए Plumber Wallace की सर्विस नंबर 1 है। समय की पूरी पाबंदी और सही कीमत।',
    ],
    'Bathroom Fitting': [
      'बाथरूम फिटिंग और शावर इंस्टॉलेशन का काम Plumber Wallace ने बहुत ही बारीकी और सफाई से किया। कोई लीकेज नहीं, बेहतरीन काम!',
      'Plumber Wallace की बाथरूम फिटिंग सर्विस बहुत अच्छी रही। टाइल्स को बिना नुकसान पहुंचाए सारा काम परफेक्ट किया।',
    ],
    'Fast Service': [
      'Plumber Wallace की फास्ट सर्विस बहुत तेज और भरोसेमंद है। कॉल करते ही समय पर पहुंचे और काम तुरंत पूरा किया। 5 स्टार!',
      'घर बैठे सबसे तेज और किफायती प्लंबिंग सर्विस। Plumber Wallace का काम और व्यवहार दोनों बहुत बढ़िया हैं।',
    ],
  },
};

const LOWER_STAR_TEMPLATES: Record<LanguageCode, Record<number, (label: string) => string>> = {
  en: {
    4: (label) =>
      `Good ${label.toLowerCase()} experience with Plumber Wallace. Skilled technician, neat finish, and fair pricing overall.`,
    3: (label) =>
      `Used Plumber Wallace for ${label.toLowerCase()}. The repair worked well, though arrival timing could be slightly faster.`,
    2: (label) =>
      `Booked Plumber Wallace for ${label.toLowerCase()}. The technician resolved the core issue, though the service experience had room for improvement.`,
    1: (label) =>
      `Reached out to Plumber Wallace for ${label.toLowerCase()}. Sharing feedback on our experience so the team can follow up and improve.`,
  },
  hi: {
    4: (label) =>
      `Plumber Wallace के साथ ${label} का अनुभव अच्छा रहा। कारीगर समझदार थे और काम सही दाम में पूरा हुआ।`,
    3: (label) =>
      `${label} के लिए Plumber Wallace की सेवा ली। काम ठीक रहा, हालांकि समय प्रबंधन थोड़ा बेहतर हो सकता था।`,
    2: (label) =>
      `${label} के लिए Plumber Wallace को बुलाया था। काम तो हो गया लेकिन अनुभव और बेहतर हो सकता था।`,
    1: (label) =>
      `${label} से जुड़ी सेवा के बारे में अपना अनुभव साझा कर रहा हूँ ताकि Plumber Wallace टीम इसे बेहतर बना सके।`,
  },
};

export function getReviewForSelection(
  lang: LanguageCode,
  tagId: ServiceTagId,
  stars: number,
  index: number
): string {
  const starCount = Math.max(1, Math.min(5, Math.round(stars)));
  const starFooter = `${'⭐'.repeat(starCount)} (${starCount}/5 Stars)`;

  if (starCount >= 5) {
    const list = REVIEW_TEMPLATES[lang][tagId];
    return `${list[index % list.length]}\n\n${starFooter}`;
  }

  const label = getServiceLabel(tagId, lang);
  return `${LOWER_STAR_TEMPLATES[lang][starCount](label)}\n\n${starFooter}`;
}

export function copyTextReliably(text: string): boolean {
  let copied = false;

  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
  if (isInIframe || !navigator.clipboard || !navigator.clipboard.writeText) {
    copied = fallbackExecCopy(text);
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {
      if (!copied) {
        fallbackExecCopy(text);
      }
    });
    copied = true;
  }

  return copied;
}

function fallbackExecCopy(text: string): boolean {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '-9999px';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  let success = false;
  try {
    success = document.execCommand('copy');
  } catch {
    success = false;
  }
  document.body.removeChild(textarea);
  return success;
}

export function buildWhatsappHref(config: Pick<BusinessConfig, 'whatsappNumber'>): string {
  const digits = config.whatsappNumber.replace(/\D/g, '') || OFFICIAL_WHATSAPP_NUMBER;
  return `https://wa.me/${digits}`;
}

export function buildTelHref(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, '') || OFFICIAL_PHONE_NUMBER;
  return `tel:${cleaned}`;
}
