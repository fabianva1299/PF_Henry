"use client";

import { useState } from "react";
import Image from "next/image";
import gs1 from "@/public/images/gs1.png";
import ns1 from "@/public/images/ns1.png";
import dnd1 from "@/public/images/dnd1.png";
import pbi3 from "@/public/images/pbi3.png";
import Spotlight from "@/components/spotlight";
import Link from "next/link";

export default function Workflows() {
  const projects = [
    {
      href: "/projects/gym-schedule",
      image: gs1,
      alt: "Gym Schedule",
      tag: "GYM-SCHEDULE",
      description:
        "Web platform designed to manage gym schedules, classes, trainers, and available spots in a simple and organized way.",
    },
    {
      href: "/projects/novasite",
      image: ns1,
      alt: "NovaSite",
      tag: "NOVASITE",
      description:
        "Software development website focused on showcasing digital services, web projects, e-commerce solutions, and client contact.",
    },
    {
      href: "/projects/dnd",
      image: dnd1,
      alt: "Mea Culpa DND",
      tag: "MEA-CULPA-DND",
      description:
        "Online RPG platform inspired by fantasy role-playing, guild interaction, trading systems, and epic adventures.",
    },
    {
      href: "/projects/pbi",
      image: pbi3,
      alt: "POWER-BI",
      tag: "POWER-BI",
      description:
        "Power BI portfolio focused on data analysis, interactive dashboards, business intelligence, and professional projects, including my Udemy certification.",
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
              <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
                Learn about my projects
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
                            <span className="relative inline-flex items-center">View project<span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">-&gt;</span></span>
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
