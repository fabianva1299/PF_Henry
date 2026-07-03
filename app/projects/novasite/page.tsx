import Image from "next/image";
import Link from "next/link";

import ns1 from "@/public/images/ns1.png";
import CylinderGallery from "@/components/cylinder-gallery-ns";

export default function NovaSitePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-indigo-300 hover:text-indigo-200"
        >
          ← Back to the top
        </Link>

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <span className="rounded-full bg-gray-800 px-3 py-1 text-sm text-indigo-300">
              NOVASITE
            </span>

            <h1 className="mt-6 text-4xl font-semibold md:text-6xl">
              NovaSite
            </h1>

            <p className="mt-6 text-lg text-indigo-200/65">
              A digital platform focused on developing modern web solutions,
              custom applications, e-commerce, and scalable enterprise
              systems for businesses seeking to strengthen their
              technological presence.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-gray-800 px-3 py-1 text-sm">
                Next.js
              </span>
              <span className="rounded-full bg-gray-800 px-3 py-1 text-sm">
                TypeScript
              </span>
              <span className="rounded-full bg-gray-800 px-3 py-1 text-sm">
                Tailwind CSS
              </span>
              <span className="rounded-full bg-gray-800 px-3 py-1 text-sm">
                Software Development
              </span>
            </div>

            <div className="mt-10 flex gap-4">
              <a
                href="https://www.novacr.site/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-indigo-600 text-white hover:bg-indigo-500"
              >
                Visit the site
              </a>

              {/* <a
                href="#"
                className="btn bg-gray-800 text-white hover:bg-gray-700"
              >
                View code
              </a> */}
            </div>
          </div>

          <div className="relative">
            <Image
              src={ns1}
              alt="NovaSite website"
              width={1100}
              height={750}
              className="rounded-2xl border border-gray-800 shadow-2xl"
            />
          </div>
        </div>

        <section className="mt-24">
          <h2 className="text-3xl font-semibold">About the Project</h2>

          <p className="mt-4 max-w-3xl text-indigo-200/65">
            NovaSite is a web platform designed to showcase
            software development services in a professional, modern, and visually
            appealing way. The site highlights solutions such as web development,
            e-commerce, technical maintenance, and custom backend development, as well
            as featuring notable projects, the team, and contact
            information for potential clients.
          </p>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
            <h3 className="text-xl font-semibold">Digital Services</h3>
            <p className="mt-3 text-indigo-200/65">
              It offers services such as web development, online stores,
              technical maintenance, and backend solutions tailored to each
              business.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
            <h3 className="text-xl font-semibold">Modern design</h3>
            <p className="mt-3 text-indigo-200/65">
              It features an attractive, responsive visual interface designed to
              convey innovation, trust, and professionalism.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
            <h3 className="text-xl font-semibold">Business Approach</h3>
            <p className="mt-3 text-indigo-200/65">
              It makes it easy for visitors to learn about the team, view featured projects,
              and contact the studio to get started on a digital solution.
            </p>
          </div>
        </section>

        <section className="mt-24">
          <h2 className="mb-8 text-center text-3xl font-semibold">
            Project Gallery
          </h2>

          <CylinderGallery />
        </section>
      </section>
    </main>
  );
}
