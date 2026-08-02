import type { IconType } from "react-icons";
import { FiBarChart2, FiCloud, FiDatabase, FiFigma, FiGitBranch, FiMonitor, FiTrendingUp } from "react-icons/fi";

import {
  SiBootstrap,
  SiCss,
  SiFigma,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiR,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";

interface Technology {
  name: string;
  icon: IconType;
  iconClassName: string;
}

interface TechnologyCategory {
  title: string;
  description: string;
  Tecnologías: Technology[];
}

const technologyCategories: TechnologyCategory[] = [
  {
    title: "Back-end y bases de datos",
    description:
      "Herramientas para API, lógica de negocio, autenticación y gestión de datos.",
    Tecnologías: [
      {
        name: "Python",
        icon: SiPython,
        iconClassName: "text-yellow-300",
      },
      {
        name: "MySQL",
        icon: FiDatabase,
        iconClassName: "text-blue-400",
      },
      {
        name: "PostgreSQL",
        icon: FiDatabase,
        iconClassName: "text-blue-300",
      },
      {
        name: "Supabase",
        icon: FiDatabase,
        iconClassName: "text-emerald-400",
      },
    ],
  },
  {
    title: "Análisis de datos e inteligencia empresarial",
    description:
      "Tecnologías que utilizo para transformar los datos en información útil.",
    Tecnologías: [
      {
        name: "Power BI",
        icon: FiBarChart2,
        iconClassName: "text-yellow-400",
      },
      {
        name: "Excel",
        icon: FiBarChart2,
        iconClassName: "text-emerald-500",
      },
      {
        name: "Tableau",
        icon: FiBarChart2,
        iconClassName: "text-blue-300",
      },
      {
        name: "Python",
        icon: SiPython,
        iconClassName: "text-yellow-300",
      },
      {
        name: "R",
        icon: FiTrendingUp,
        iconClassName: "text-blue-400",
      },
      {
        name: "SQL",
        icon: FiDatabase,
        iconClassName: "text-indigo-300",
      },
    ],
  },
];

export default function Features() {
  return (
    <section
      id="Tecnologías"
      className="relative scroll-mt-24 overflow-hidden"
    >
      {/* Background decoration */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 -mt-20 -translate-x-1/2"
        aria-hidden="true"
      >
        <img
          className="max-w-none opacity-70"
          src="/images/blurred-shape-gray.svg"
          width={760}
          height={668}
          alt=""
        />
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-80 -translate-x-[120%] opacity-50"
        aria-hidden="true"
      >
        <img
          className="max-w-none"
          src="/images/blurred-shape.svg"
          width={760}
          height={668}
          alt=""
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t border-white/10 py-12 md:py-20">
          {/* Section heading */}
          <div className="mx-auto max-w-3xl pb-10 text-center md:pb-14">
            <div className="mb-4 inline-flex items-center gap-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-300/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-300/50">
              <span className="font-handjet text-lg font-semibold uppercase tracking-[0.18em] text-indigo-300">
                Mi pila
              </span>
            </div>

            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-handjet text-4xl font-bold text-transparent md:text-5xl">
              Tecnologías
            </h2>

            <p className="mx-auto max-w-2xl font-inter text-base leading-relaxed text-indigo-200/65 md:text-lg">
              Tecnologías, marcos de trabajo y herramientas que utilizo para desarrollar aplicaciones, 
              analizar información y crear soluciones basadas en datos.
            </p>
          </div>
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded border border-indigo-300 text-indigo-200">
              <span className="font-handjet text-lg">›</span>
            </div>

            <h2 className="font-handjet text-3xl font-bold text-gray-100">
              Tecnologías
            </h2>
          </div>

          {/* Technology categories */}
          <div className="space-y-6">
            {technologyCategories.map((category, categoryIndex) => (
              <article
                key={category.title}
                data-aos="fade-up"
                data-aos-delay={categoryIndex * 75}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900/45 p-5 shadow-2xl shadow-black/20 backdrop-blur-sm transition duration-300 hover:border-indigo-400/30 hover:bg-gray-900/65 sm:p-7"
              >
                {/* Card glow */}
                <div
                  className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-indigo-500/10 blur-3xl transition duration-500 group-hover:bg-indigo-500/20"
                  aria-hidden="true"
                />

                <div className="relative">
                  {/* Category header */}
                  <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                    <div>
                      <h3 className="font-handjet text-2xl font-bold text-gray-100">
                        {category.title}
                      </h3>

                      <p className="mt-1 max-w-xl font-inter text-sm leading-relaxed text-indigo-200/55">
                        {category.description}
                      </p>
                    </div>

                    <span className="font-handjet text-sm uppercase tracking-widest text-indigo-300/60">
                      {String(categoryIndex + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Technology items */}
                  <div className="flex flex-wrap gap-3">
                    {category.Tecnologías.map((technology) => {
                      const Icon = technology.icon;

                      return (
                        <div
                          key={`${category.title}-${technology.name}`}
                          className="group/technology relative flex min-w-[105px] flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-indigo-300/10 bg-indigo-400/[0.06] px-4 py-4 transition duration-300 hover:-translate-y-1 hover:border-indigo-300/35 hover:bg-indigo-400/[0.12] hover:shadow-lg hover:shadow-indigo-500/10"
                        >
                          <div
                            className="absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-indigo-300 to-transparent transition-transform duration-300 group-hover/technology:scale-x-100"
                            aria-hidden="true"
                          />

                          <Icon
                            className={`h-7 w-7 transition duration-300 group-hover/technology:scale-110 ${technology.iconClassName}`}
                            aria-hidden="true"
                          />

                          <span className="font-handjet text-base font-semibold uppercase tracking-wide text-cyan-100/80 transition group-hover/technology:text-cyan-100">
                            {technology.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}