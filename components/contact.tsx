"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface ContactCard {
  label: string;
  description: string;
  link: string;
  icon: React.ReactNode;
  displayValue: string;
}

export default function Contact() {
  const { t } = useLanguage();

  const contactCards: ContactCard[] = [
    {
      label: t("contactSection.cellphone.label"),
      description: t("contactSection.cellphone.description"),
      link: t("contactSection.cellphone.link"),
      displayValue: "8651-7609",
      icon: (
        <svg
          className="h-12 w-12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
    {
      label: t("contactSection.linkedin.label"),
      description: t("contactSection.linkedin.description"),
      link: t("contactSection.linkedin.link"),
      displayValue: "henry-alvarado-vargas",
      icon: (
        <svg
          className="h-12 w-12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      label: t("contactSection.email.label"),
      description: t("contactSection.email.description"),
      link: t("contactSection.email.link"),
      displayValue: "fabianva1299",
      icon: (
        <svg
          className="h-12 w-12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
    },
  ];

  return (
    <section id="getintouch" className="relative scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-400/.25),transparent)1] md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center">
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-handjet text-3xl font-semibold text-transparent md:text-4xl">
              {t("contactSection.title")}
            </h2>
          </div>

          {/* Contact cards */}
          <div className="mx-auto grid max-w-sm gap-8 sm:max-w-none sm:grid-cols-2 md:gap-x-8 md:gap-y-8 lg:grid-cols-3">
            {contactCards.map((card, index) => (
              <Link
                key={index}
                href={card.link}
                target={card.link.startsWith("mailto") ? undefined : "_blank"}
                rel={card.link.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="group relative"
              >
                <div className="relative rounded-2xl border border-gray-700 bg-linear-to-br from-gray-900/50 via-gray-800/25 to-gray-900/50 p-6 backdrop-blur-xs transition-all duration-300 hover:border-indigo-500/50 hover:from-gray-900 hover:via-gray-800/50 hover:to-gray-900">
                  <div className="flex flex-col items-start gap-4">
                    {/* Icon */}
                    <div className="text-indigo-500 transition-colors group-hover:text-indigo-400">
                      {card.icon}
                    </div>

                    {/* Label and description */}
                    <div>
                      <h3 className="text-sm font-semibold tracking-widest text-gray-400 group-hover:text-indigo-300">
                        {card.label}
                      </h3>
                      <p className="text-xs text-gray-500 group-hover:text-gray-400">
                        {card.description}
                      </p>
                    </div>

                    {/* Contact value */}
                    <div className="mt-2 text-sm font-mono text-indigo-200/65 group-hover:text-indigo-200">
                      {card.displayValue}
                    </div>

                    {/* Arrow indicator */}
                    <div className="mt-auto transition-all duration-300">
                      <svg
                        className="h-5 w-5 text-indigo-500 transform transition-transform group-hover:translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
