import Image from "next/image";
import Link from "next/link";

import dnd1 from "@/public/images/dnd1.png";
import CylinderGallery from "@/components/cylinder-gallery-dnd";

export default function MeaCulpaPage() {
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
              MEA CULPA
            </span>

            <h1 className="mt-6 text-4xl font-semibold md:text-6xl">
              Mea Culpa
            </h1>

            <p className="mt-6 text-lg text-indigo-200/65">
              An online RPG platform focused on a digital role-playing experience
              featuring guilds, trading, epic adventures, and mechanics designed to
              strengthen interaction among players.
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
                RPG Online
              </span>
            </div>

            <div className="mt-10 flex gap-4">
              <a
                href="https://meaculpadnd.com/"
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
                Ver código
              </a> */}
            </div>
          </div>

          <div className="relative">
            <Image
              src={dnd1}
              alt="Mea Culpa RPG online platform"
              width={1100}
              height={750}
              className="rounded-2xl border border-gray-800 shadow-2xl"
            />
          </div>
        </div>

        <section className="mt-24">
          <h2 className="text-3xl font-semibold">About the Project</h2>

          <p className="mt-4 max-w-3xl text-indigo-200/65">
            Mea Culpa is an online role-playing platform designed to create an
            immersive experience set in a fantasy universe. The
            project incorporates elements such as guilds, trade, and adventures,
            allowing users to participate in a digital community
            focused on exploration, progression, and interaction among
            players.
          </p>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
            <h3 className="text-xl font-semibold">Guild System</h3>
            <p className="mt-3 text-indigo-200/65">
              It allows you to organize the player experience through groups,
              collaboration, and participation within a role-playing community.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
            <h3 className="text-xl font-semibold">In-game trading</h3>
            <p className="mt-3 text-indigo-200/65">
              It incorporates exchange mechanisms that strengthen the
              domestic economy and interaction among platform users.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
            <h3 className="text-xl font-semibold">Epic Adventures</h3>
            <p className="mt-3 text-indigo-200/65">
              It offers a narrative experience focused on exploration,
              fantasy, character development, and participation in
              online role-playing campaigns.
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
