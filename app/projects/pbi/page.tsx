import Image from "next/image";
import Link from "next/link";

import ns1 from "@/public/images/pbi2.png";
import CylinderGallery from "@/components/cylinder-gallery-pbi";

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
              POWER-BI
            </span>

            <h1 className="mt-6 text-4xl font-semibold md:text-6xl">
               Power BI Portfolio
            </h1>

            <p className="mt-6 text-lg text-indigo-200/65">
              A data analytics portfolio developed as part of the Udemy course
              “Power BI - Data Analysis and Business Intelligence,” focused on building
              interactive dashboards, transforming data, and presenting business insights
              through clear and professional visual reports.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-gray-800 px-3 py-1 text-sm">
                Power BI
              </span>
              <span className="rounded-full bg-gray-800 px-3 py-1 text-sm">
                Data Analysis
              </span>
              <span className="rounded-full bg-gray-800 px-3 py-1 text-sm">
                Business Intelligence
              </span>
              <span className="rounded-full bg-gray-800 px-3 py-1 text-sm">
                Udemy Certification
              </span>
            </div>

            <div className="mt-10 flex gap-4">
              <a
                href="https://sites.google.com/view/miportafoliogabriel"
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-indigo-600 text-white hover:bg-indigo-500"
              >
                Visit the site
              </a>

              <a
                href="https://www.udemy.com/certificate/UC-f43eb1f7-1409-4204-8da5-a66f1a16c321/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-gray-800 text-white hover:bg-gray-700"
              >
                View certificate
              </a>
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
            This Power BI portfolio brings together dashboards and data analysis projects
            created during the Udemy course “Power BI – Data Analysis and Business
            Intelligence.” The project focuses on transforming raw data into meaningful
            insights through interactive reports, visual storytelling, data modeling, and
            business-oriented analysis.
          </p>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
            <h3 className="text-xl font-semibold">Interactive Dashboards</h3>
            <p className="mt-3 text-indigo-200/65">
              Presents dynamic reports that allow users to explore indicators, trends, and
              business results in a clear and visual way.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
            <h3 className="text-xl font-semibold">Data Analysis</h3>
            <p className="mt-3 text-indigo-200/65">
              Applies data cleaning, transformation, and visualization techniques to convert
              information into useful insights for decision-making.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
            <h3 className="text-xl font-semibold">Business Intelligence</h3>
            <p className="mt-3 text-indigo-200/65">
              Demonstrates the use of Power BI as a business intelligence tool to monitor
              performance, analyze data, and support strategic decisions.
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
