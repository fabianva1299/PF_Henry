"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "en" | "es";

interface Translations {
  testimonials: {
    title: string;
    categories: {
      projects: string;
      Tecnologías: string;
      getintouch: string;
    };
  };
  header: {
    projects: string;
    Tecnologías: string;
    getintouch: string;
  };
  common: {
    viewProject: string;
  };
  contactSection: {
    title: string;
    cellphone: {
      label: string;
      description: string;
      link: string;
    };
    linkedin: {
      label: string;
      description: string;
      link: string;
    };
    email: {
      label: string;
      description: string;
      link: string;
    };
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Record<Language, Translations>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Default translations - always available
const DEFAULT_TRANSLATIONS: Record<Language, Translations> = {
  en: {
    testimonials: {
      title: "",
      categories: {
        projects: "Projects",
        Tecnologías: "Tecnologías",
        getintouch: "Ponte en Contacto"
      }
    },
    header: {
      projects: "Projects",
      Tecnologías: "Tecnologías",
      getintouch: "Ponte en Contacto"
    },
    common: {
      viewProject: "Ver Proyecto"
    },
    contactSection: {
      title: "Ponte en Contacto",
      cellphone: {
        label: "PHONE",
        description: "Call or WhatsApp",
        link: "tel:+50686517609"
      },
      linkedin: {
        label: "LINKEDIN",
        description: "Professional Network",
        link: "https://www.linkedin.com/in/henry-alvarado-vargas-0a5566221/"
      },
      email: {
        label: "EMAIL",
        description: "Direct Message",
        link: "mailto:fabianva1299@gmail.com"
      }
    }
  },
  es: {
    testimonials: {
      title: "",
      categories: {
        projects: "Proyectos",
        Tecnologías: "Tecnologías",
        getintouch: "Contactos"
      }
    },
    header: {
      projects: "Proyectos",
      Tecnologías: "Tecnologías",
      getintouch: "Contactos"
    },
    common: {
      viewProject: "Ver proyecto"
    },
    contactSection: {
      title: "Ponte en Contacto",
      cellphone: {
        label: "TELÉFONO",
        description: "Llamada o WhatsApp",
        link: "tel:+50686517609"
      },
      linkedin: {
        label: "LINKEDIN",
        description: "Red Profesional",
        link: "https://www.linkedin.com/in/henry-alvarado-vargas-0a5566221/"
      },
      email: {
        label: "EMAIL",
        description: "Mensaje Directo",
        link: "mailto:fabianva1299@gmail.com"
      }
    }
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [translations, setTranslations] = useState<Record<Language, Translations>>(DEFAULT_TRANSLATIONS);

  useEffect(() => {
    async function loadTranslations() {
      try {
        const response = await fetch("/locales/translations.json");
        if (response.ok) {
          const data = await response.json();
          setTranslations(data);
        }
      } catch (error) {
        console.warn("Using default translations:", error);
      }
    }

    loadTranslations();
  }, []);

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
