import Image from "next/image";
import Link from "next/link";

import hv2 from "@/public/images/banhvi/hv2.png";

export default function k_means() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Link
          href="/"
          className="group inline-flex items-center justify-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/[0.08] px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200 transition-all duration-300 hover:border-indigo-400/60 hover:bg-indigo-500/[0.15] hover:text-white"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          Volver
        </Link>

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>

            <h1 className="mt-6 text-4xl font-semibold md:text-6xl">
              K-MEANS
            </h1>

            <p className="mt-6 text-lg text-indigo-200/65">
              PENDIENTE
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-gray-800 px-3 py-1 text-sm">
                R
              </span>
              <span className="rounded-full bg-gray-800 px-3 py-1 text-sm">
                R-STUDIO
              </span>
            </div>

            <div className="mt-10 flex gap-4">
              <a
                href="/articles/ma_page2"
                rel="noopener noreferrer"
                className="btn bg-indigo-600 text-white hover:bg-indigo-500"
              >
                Resumen Técnico
              </a>
            </div>
          </div>

          <div className="relative">
            <Image
              src={hv2}
              alt="Mea Culpa RPG online platform"
              width={1100}
              height={750}
              className="rounded-2xl border border-gray-800 shadow-2xl"
            />
          </div>
        </div>

        <section className="mt-24">
          <h2 className="text-3xl font-semibold">Acerca del proyecto</h2>

          <p className="mt-4 max-w-3xl text-indigo-200/65">
            El análisis utiliza el método K-means para agrupar las entidades de la cartera institucional
            del BANHVI según sus indicadores de morosidad, rentabilidad, cobertura crediticia y eficiencia 
            operativa. Donde los resultados permiten identificar perfiles de riesgo y desempeño mediante centroides.
          </p>
        </section>
      </section>
    </main>
  );
}
