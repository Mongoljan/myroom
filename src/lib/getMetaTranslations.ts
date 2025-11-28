// Server-side utility to get metadata translations
// Since metadata generation is on the server, we can't use React hooks

type Language = 'en' | 'mn';

const metaTranslations = {
  en: {
    siteName: "MyRoom",
    home: {
      title: "MyRoom - Modern Hotel Booking Platform",
      description: "Discover exceptional hotels worldwide with instant booking, real-time availability, and unmatched experiences."
    },
    search: {
      title: "Search Hotels | MyRoom",
      description: "Find and compare the best hotel deals. Search by location, dates, and amenities."
    },
    hotel: {
      titleTemplate: "{{name}} | MyRoom",
      descriptionTemplate: "Book {{name}} in {{location}}. Best rates guaranteed with instant confirmation.",
      notFound: "Hotel Not Found"
    },
    destinations: {
      titleTemplate: "{{name}} - Hotels & Accommodation | MyRoom",
      descriptionTemplate: "Find the best hotels and accommodation in {{name}}. Book now with instant confirmation."
    },
    booking: {
      title: "Complete Your Booking | MyRoom",
      description: "Secure your hotel reservation with instant confirmation."
    },
    manageBooking: {
      title: "Manage Booking | MyRoom",
      description: "View and manage your hotel reservation details."
    },
    login: {
      title: "Sign In | MyRoom",
      description: "Sign in to access your bookings and manage your account."
    },
    signup: {
      title: "Create Account | MyRoom",
      description: "Join MyRoom for exclusive deals and easy booking management."
    },
    terms: {
      title: "Terms of Service | MyRoom",
      description: "Read the terms and conditions for using MyRoom hotel booking platform."
    }
  },
  mn: {
    siteName: "MyRoom",
    home: {
      title: "MyRoom - Зочид буудал захиалгын платформ",
      description: "Дэлхийн өнцөг булан бүрээс зочид буудал олж, шууд захиалга хийгээрэй."
    },
    search: {
      title: "Зочид буудал хайх | MyRoom",
      description: "Хамгийн сайн зочид буудлын үнийг харьцуулж олоорой."
    },
    hotel: {
      titleTemplate: "{{name}} | MyRoom",
      descriptionTemplate: "{{location}}-д байрлах {{name}}-г захиалах. Хамгийн сайн үнийн баталгаа.",
      notFound: "Зочид буудал олдсонгүй"
    },
    destinations: {
      titleTemplate: "{{name}} - Зочид буудал & Байр | MyRoom",
      descriptionTemplate: "{{name}} дахь хамгийн сайн зочид буудлуудыг олоорой. Одоо захиалаарай."
    },
    booking: {
      title: "Захиалга баталгаажуулах | MyRoom",
      description: "Зочид буудлын захиалгаа баталгаажуулаарай."
    },
    manageBooking: {
      title: "Захиалга удирдах | MyRoom",
      description: "Таны зочид буудлын захиалгын мэдээллийг харах, удирдах."
    },
    login: {
      title: "Нэвтрэх | MyRoom",
      description: "Захиалгуудаа харах, бүртгэлээ удирдахын тулд нэвтрэнэ үү."
    },
    signup: {
      title: "Бүртгүүлэх | MyRoom",
      description: "MyRoom-д нэгдэж онцгой урамшуулал, хялбар захиалгын үйлчилгээ аваарай."
    },
    terms: {
      title: "Үйлчилгээний нөхцөл | MyRoom",
      description: "MyRoom зочид буудал захиалгын платформын үйлчилгээний нөхцөлийг уншина уу."
    }
  }
};

// Get the current language from cookies or default to 'mn'
export function getLanguageFromCookies(cookieHeader?: string): Language {
  if (!cookieHeader) return 'mn';
  
  const match = cookieHeader.match(/i18next=([^;]+)/);
  if (match) {
    const lang = match[1];
    return (lang === 'en' || lang === 'mn') ? lang : 'mn';
  }
  return 'mn';
}

// Get meta translations for a specific language
export function getMetaTranslations(lang: Language = 'mn') {
  return metaTranslations[lang] || metaTranslations.mn;
}

// Helper to replace template variables
export function formatMeta(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return result;
}

export type { Language };
export { metaTranslations };
