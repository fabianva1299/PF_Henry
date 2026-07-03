"use client";

import { useState } from "react";
import Image from "next/image";

import pbi1 from "@/public/images/pbi1.png";
import pbi2 from "@/public/images/pbi2.png";
import pbi3 from "@/public/images/pbi3.png";
import pbi4 from "@/public/images/pbi4.png";
import pbi5 from "@/public/images/pbi5.png";

const images = [pbi1, pbi2, pbi3, pbi4, pbi5];

export default function CylinderGallery() {
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const next = () => {
    setIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="relative mx-auto flex w-full max-w-6xl items-center justify-center">
      <button
        onClick={prev}
        className="absolute left-0 z-20 rounded-full bg-gray-800/80 px-4 py-3 text-white hover:bg-indigo-600"
      >
        ←
      </button>

      <div className="relative h-[520px] w-[900px] [perspective:1000px]">
        <div
          key={index}
          className="absolute inset-0 transition-all duration-700 [transform-style:preserve-3d] animate-cylinder"
        >
          <Image
            src={images[index]}
            alt="Project image"
            fill
            className="rounded-2xl object-contain shadow-2xl"
          />
        </div>
      </div>

      <button
        onClick={next}
        className="absolute right-0 z-20 rounded-full bg-gray-800/80 px-4 py-3 text-white hover:bg-indigo-600"
      >
        →
      </button>
    </div>
  );
}