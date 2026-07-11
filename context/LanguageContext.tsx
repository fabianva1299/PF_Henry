"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "en" | "es";

interface Translations {
  testimonials: {
    title: string;
    subtitle: string;
    categories: {
      projects: string;
      technologies: string;
      getintouch: string;
      aboutme: string;
    };
  };
  header: {
    projects: string;
    technologies: string;
    getintouch: string;
    aboutme: string;
  };
  common: {
    viewProject: string;
  };
  contactSection: {
    title: string;
    subtitle: string;
    github: {
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
      subtitle: "",
      categories: {
        projects: "Projects",
        technologies: "Technologies",
        getintouch: "Get In Touch",
        aboutme: "About Me"
      }
    },
    header: {
      projects: "Projects",
      technologies: "Technologies",
      getintouch: "Get In Touch",
      aboutme: "About Me"
    },
    common: {
      viewProject: "View project"
    },
    contactSection: {
      title: "Get In Touch",
      subtitle: "Let's connect and discuss your next project. Choose your preferred way to reach out.",
      github: {
        label: "GITHUB",
        description: "Version Control",
        link: "https://github.com/gaava21"
      },
      linkedin: {
        label: "LINKEDIN",
        description: "Professional Network",
        link: "https://www.linkedin.com/in/gaava21/"
      },
      email: {
        label: "EMAIL",
        description: "Direct Message",
        link: "mailto:gabo20032101@gmail.com"
      }
    }
  },
  es: {
    testimonials: {
      title: "",
      subtitle: "",
      categories: {
        projects: "Proyectos",
        technologies: "Tecnologías",
        getintouch: "Contactos",
        aboutme: "Acerca de mi"
      }
    },
    header: {
      projects: "Proyectos",
      technologies: "Technologies",
      getintouch: "Contactos",
      aboutme: "Acerca de mi"
    },
    common: {
      viewProject: "Ver proyecto"
    },
    contactSection: {
      title: "Ponte en Contacto",
      subtitle: "Conectemos y hablemos sobre tu próximo proyecto. Elige tu forma preferida de comunicación.",
      github: {
        label: "GITHUB",
        description: "Control de Versiones",
        link: "https://github.com/gaava21"
      },
      linkedin: {
        label: "LINKEDIN",
        description: "Red Profesional",
        link: "https://www.linkedin.com/in/gaava21/"
      },
      email: {
        label: "EMAIL",
        description: "Mensaje Directo",
        link: "mailto:gabo20032101@gmail.com"
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
