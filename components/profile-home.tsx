import VideoThumb from "@/public/images/profile.png";

export default function profile() {
  return (
    <section id="aboutme" className="scroll-mt-24">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        {/* Hero content */}
        <div className="py-12 md:py-20">
          {/* Section header */}

          <div className="relative mx-auto w-full max-w-3xl">
            <img
              src={VideoThumb.src}
              alt="Modal video thumbnail"
              width={1104}
              height={576}
              className="w-full rounded-xl"
              style={{
                WebkitMaskImage:
                  "radial-gradient(circle, black 70%, transparent 100%)",
                maskImage:
                  "radial-gradient(circle, black 70%, transparent 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
