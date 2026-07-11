"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./logo";
import { useLanguage } from "@/context/LanguageContext";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [activeSection, setActiveSection] = useState("projects");
  const pathname = usePathname();

  const navItems = [
    {
      id: "projects",
      labelKey: "projects",
      href: "/#projects",
      icon: (
        <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="16" height={16}>
          <path d="M.062 10.003a1 1 0 0 1 1.947.455c-.019.08.01.152.078.19l5.83 3.333c.052.03.115.03.168 0l5.83-3.333a.163.163 0 0 0 .078-.188 1 1 0 1 1 1.947-.459 2.161 2.161 0 0 1-1.032 2.384l-5.83 3.331a2.168 2.168 0 0 1-2.154 0l-5.83-3.331a2.162 2.162 0 0 1-1.032-2.382Zm7.854-7.981-5.83 3.332a.17.17 0 0 0 0 .295l5.828 3.33c.054.031.118.031.17.002l5.83-3.333a.17.17 0 0 0 0-.294L8.085 2.023a.172.172 0 0 0-.17-.001ZM9.076.285l5.83 3.332c1.458.833 1.458 2.935 0 3.768l-5.83 3.333c-.667.38-1.485.38-2.153-.001l-5.83-3.332c-1.457-.833-1.457-2.935 0-3.767L6.925.285a2.173 2.173 0 0 1 2.15 0Z" />
        </svg>
      ),
    },
    {
      id: "technologies",
      labelKey: "technologies",
      href: "/#technologies",
      icon: (
        <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="16" height={16}>
          <path d="M6.5 3.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM9 6.855A3.502 3.502 0 0 0 8 0a3.5 3.5 0 0 0-1 6.855v1.656L5.534 9.65a3.5 3.5 0 1 0 1.229 1.578L8 10.267l1.238.962a3.5 3.5 0 1 0 1.229-1.578L9 8.511V6.855Zm2.303 4.74c.005-.005.01-.01.013-.016l.012-.016a1.5 1.5 0 1 1-.025.032ZM3.5 11A1.497 1.497 0 0 1 5 12.5 1.5 1.5 0 1 1 3.5 11Z" />
        </svg>
      ),
    },
    {
      id: "getintouch",
      labelKey: "getintouch",
      href: "/#getintouch",
      icon: (
        <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="16" height={16}>
          <path d="M2.428 10c.665-1.815 1.98-3.604 3.44-4.802-.6-1.807-1.443-3.079-2.29-3.18-1.91-.227-2.246 2.04-.174 2.962a1 1 0 1 1-.813 1.827C-1.407 5.028-.589-.491 3.815.032c1.605.191 2.925 1.811 3.79 4.07.979-.427 1.937-.51 2.735-.092.818.429 1.143 1.123 1.294 2.148.015.1.022.149.043.32.542-.537 1.003-.797 1.693-.622.64.162.894.493 1.195 1.147l.018.04a1 1 0 0 1 1.133 1.61c-.46.47-1.12.574-1.744.398a1.661 1.661 0 0 1-.87-.592 2.127 2.127 0 0 1-.224-.349 3.225 3.225 0 0 1-.55.477c-.377.253-.8.368-1.259.267-.993-.218-1.21-.779-1.367-2.05-.027-.22-.033-.262-.046-.353-.067-.452-.144-.617-.244-.67-.225-.118-.665-.013-1.206.278.297 1.243.475 2.587.516 3.941H15a1 1 0 0 1 0 2H8.68l-.025.285c-.173 1.918-.906 3.381-2.654 3.668-1.5.246-3.013-.47-3.677-1.858-.29-.637-.39-1.35-.342-2.095H1a1 1 0 0 1 0-2h1.428Zm2.11 0h2.175a18.602 18.602 0 0 0-.284-2.577c-.205.202-.408.42-.606.654A9.596 9.596 0 0 0 4.537 10Zm2.135 2H3.942c-.032.465.03.888.194 1.25.258.538.89.836 1.54.73.546-.09.888-.772.988-1.875L6.673 12Z" />
        </svg>
      ),
    },
    {
      id: "aboutme",
      labelKey: "aboutme",
      href: "/#aboutme",
      icon: (
        <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="16" height={16}>
          <path d="M3.757 3.758a6 6 0 0 1 8.485 8.485 5.992 5.992 0 0 1-5.301 1.664 1 1 0 1 0-.351 1.969 8 8 0 1 0-4.247-2.218 1 1 0 0 0 1.415-.001L9.12 8.294v1.827a1 1 0 1 0 2 0v-4.2a.997.997 0 0 0-1-1.042H5.879a1 1 0 1 0 0 2h1.829l-4.599 4.598a6 6 0 0 1 .648-7.719Z" />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    if (pathname !== "/") return;

    const sections = navItems.map((item) => document.getElementById(item.id));

    const handleScroll = () => {
      // Offset of 240px to trigger the active class slightly before reaching the element
      const scrollPosition = window.scrollY + 240;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const top = section.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(navItems[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial run

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        window.history.pushState(null, "", `#${id}`);
        setActiveSection(id);
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-gray-950/90 px-4 py-4 backdrop-blur-xl sm:px-6 md:px-8">
      <div className="mx-auto max-w-6xl w-full flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex-1 flex items-center justify-start">
          <Logo />
        </div>

        {/* Center: Navigation capsule */}
        <div className="relative inline-flex flex-wrap justify-center rounded-[1.25rem] border border-white/10 bg-gray-950/80 p-0.5 md:p-1 shadow-lg shadow-black/20 backdrop-blur-xl">
          {navItems.map(({ id, labelKey, icon, href }) => {
            const isActive = pathname === "/" ? activeSection === id : false;
            const labelText = t(`testimonials.categories.${labelKey}`);

            return (
              <Link
                key={id}
                href={href}
                onClick={(e) => handleNavClick(e, id)}
                className={`flex h-8 items-center gap-2 whitespace-nowrap rounded-full px-2.5 md:px-3 text-xs md:text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-indigo-200 ${
                  isActive
                    ? "relative bg-linear-to-b from-gray-900 via-gray-800/60 to-gray-900 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,--theme(--color-indigo-500/0),--theme(--color-indigo-500/.5))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]"
                    : "opacity-65 transition-opacity hover:opacity-90"
                }`}
              >
                <span className={`fill-current ${isActive ? "text-indigo-500" : "text-gray-600"}`}>
                  {icon}
                </span>
                <span>{labelText}</span>
              </Link>
            );
          })}
        </div>

        {/* Right: Name & Language Switcher */}
        <div className="flex-1 flex items-center justify-end gap-3 md:gap-4">
          <span className="hidden lg:inline text-sm font-medium text-gray-300">
            Gabriel Alvarado Vargas
          </span>
          <button
            onClick={() => setLanguage(language === "en" ? "es" : "en")}
            className="text-xs font-semibold text-gray-400 hover:text-white border border-white/10 rounded-full px-2.5 py-1 bg-gray-900/50 hover:bg-gray-800 transition-colors shadow-sm focus:outline-hidden cursor-pointer"
            aria-label="Toggle language"
          >
            {language === "en" ? "ES" : "EN"}
          </button>
        </div>
      </div>
    </header>
  );
}
