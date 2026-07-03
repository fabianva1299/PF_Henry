"use client";

import { useState } from "react";
import Image from "next/image";

import dnd1 from "@/public/images/dnd1.png";
import dnd2 from "@/public/images/dnd2.png";
import dnd3 from "@/public/images/dnd3.png";
import dnd4 from "@/public/images/dnd4.png";
import dnd5 from "@/public/images/dnd5.png";
import dnd6 from "@/public/images/dnd6.png";
import dnd7 from "@/public/images/dnd7.png";
import dnd8 from "@/public/images/dnd8.png";
import dnd9 from "@/public/images/dnd9.png";
import dnd10 from "@/public/images/dnd10.png";
import dnd11 from "@/public/images/dnd11.png";
import dnd12 from "@/public/images/dnd12.png";
import dnd13 from "@/public/images/dnd13.png";


const images = [dnd1, dnd2, dnd3, dnd4, dnd5, dnd6, dnd7, dnd8, dnd9, dnd10, dnd11, dnd12, dnd13];

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