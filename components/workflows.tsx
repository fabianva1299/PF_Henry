"use client";

import { useState } from "react";
import Image from "next/image";
import hv from "@/public/images/banhvi/hv.png";
import hv2 from "@/public/images/banhvi/hv2.png";
import hv3 from "@/public/images/banhvi/hv3.png";
import hv4 from "@/public/images/banhvi/hv4.png";
import hv5 from "@/public/images/banhvi/hv5.png";
import hv6 from "@/public/images/banhvi/hv6.png";
import hv7 from "@/public/images/banhvi/hv7.png";
import Spotlight from "./spotlight";
import Link from "next/link";

export default function Workflows() {
  const projects = [
    {
      href: "/projects/modelo01",
      image: hv,
      alt: "Modelo de Datos de Panel",
      tag: "MODELO DE PANEL DE DATOS",
      description:
        "El análisis utiliza modelos de datos de panel para evaluar cómo las variables macroeconómicas influyen en el desempeño financiero de las instituciones clientes del BANHVI.",
    },
    {
      href: "/projects/modelo02",
      image: hv2,
      alt: "K-means",
      tag: "K-MEANS",
      description:
        "El análisis utiliza el método K-means para agrupar las entidades de la cartera institucional del BANHVI según sus indicadores de morosidad, rentabilidad, cobertura crediticia y eficiencia operativa.",
    },
    {
      href: "/projects/modelo03",
      image: hv3,
      alt: "Modelo de Regresión lineal (IED)",
      tag: "MODELO DE REGRESION LINEAL (IED)",
      description:
        "El análisis econométrico evalúa los factores que influyen en la inversión extranjera directa en Costa Rica durante el periodo 2008-2023 mediante un modelo de regresión lineal.",
    },
    {
      href: "/projects/modelo04",
      image: hv4,
      alt: "Modelo de regresion Lineal",
      tag: "MODELO DE REGRESIÓN LINEAL",
      description:
        "El análisis econométrico examina cómo la educación, la experiencia, las horas trabajadas y diversas características personales y geográficas influyen en el salario.",
    },
    {
      href: "/projects/modelo05",
      image: hv5,
      alt: "Simulacion montecarlo",
      tag: "SIMULACIÓN MONTECARLO",
      description:
        "El proyecto utiliza una simulación Monte Carlo para proyectar posibles precios del petróleo WTI a tres y seis meses, representando la incertidumbre mediante distintos percentiles.",
    },
    {
      href: "/projects/modelo06",
      image: hv6,
      alt: "VAR ( USA Y AUSTRALIA)",
      tag: "VAR ( USA Y AUSTRALIA)",
      description:
        "El análisis utiliza un modelo de vectores autorregresivos (VAR) para estudiar la relación dinámica entre el PIB de Estados Unidos y Australia durante el periodo 1970-2000.",
    },
    {
      href: "/projects/modelo07",
      image: hv7,
      alt: "Series de Tiempo - EE",
      tag: "SERIES DE TIEMPO EE",
      description:
        "El análisis evalúa la estacionariedad y cointegración entre los títulos de la Reserva Federal y del Tesoro de Estados Unidos durante el periodo 1984-2009.",
    },
  ];

  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((current) =>
      current === 0 ? projects.length - 1 : current - 1
    );
  };

  const next = () => {
    setIndex((current) =>
      current === projects.length - 1 ? 0 : current + 1
    );
  };

  const visibleProjects = [
    projects[index],
    projects[(index + 1) % projects.length],
    projects[(index + 2) % projects.length],
  ];
  return (
    <section id="projects" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 md:pb-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-indigo-200/50">
              <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-handjet text-3xl font-semibold text-transparent md:text-4xl">
                Acerca de mis proyectos
              </h2>
            </div>

          </div>
          {/* Carousel: show 3 items and slide 1-by-1 */}
          <Spotlight className="group relative mx-auto flex w-full max-w-6xl items-center justify-center">
            <button
              onClick={prev}
              className="absolute left-0 z-20 hidden h-10 w-10 items-center justify-center rounded-full bg-gray-800/80 text-white hover:bg-indigo-600 md:flex"
              aria-label="Previous"
            >
              ←
            </button>

            <div className="relative h-[520px] w-full max-w-[1008px] overflow-hidden [perspective:1000px]">
              <div className="flex gap-6 transition-transform duration-500">
                {visibleProjects.map((p, i) => (
                  <Link
                    key={p.href + i}
                    href={p.href}
                    className="group/card relative h-full w-[320px] flex-shrink-0 overflow-hidden rounded-2xl bg-gray-800 p-px"
                  >
                    <div className="relative z-20 flex h-full min-h-[520px] flex-col overflow-hidden rounded-[inherit] bg-gray-950 after:absolute after:inset-0 after:bg-linear-to-br after:from-gray-900/50 after:via-gray-800/25 after:to-gray-900/50 [transform-style:preserve-3d] animate-cylinder">
                      <div className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-gray-700/50 bg-gray-800/65 text-gray-200 opacity-0 transition-opacity group-hover/card:opacity-100" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width={9} height={8} fill="none">
                          <path fill="#F4F4F5" d="m4.92 8-.787-.763 2.733-2.68H0V3.443h6.866L4.133.767 4.92 0 9 4 4.92 8Z" />
                        </svg>
                      </div>
                      <div className="relative h-56 w-full overflow-hidden bg-gray-900/20 flex items-center justify-center">
                        <Image className="h-full w-full object-contain" src={p.image} width={350} height={288} alt={p.alt} />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <div className="mb-3">
                          <span className="btn-sm relative rounded-full bg-gray-800/40 px-2.5 py-0.5 text-xs font-normal">
                            <span className="bg-linear-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">{p.tag}</span>
                          </span>
                        </div>
                        <p className="text-indigo-200/65">{p.description}</p>
                        <div className="mt-auto pt-5">
                          <span className="btn group inline-flex bg-linear-to-t from-indigo-600 to-indigo-500 text-white">
                            <span className="relative inline-flex items-center">Ver Proyecto<span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">-&gt;</span></span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <button
              onClick={next}
              className="absolute right-0 z-20 hidden h-10 w-10 items-center justify-center rounded-full bg-gray-800/80 text-white hover:bg-indigo-600 md:flex"
              aria-label="Next"
            >
              →
            </button>
          </Spotlight>
        </div>
      </div>
    </section>
  );
}
