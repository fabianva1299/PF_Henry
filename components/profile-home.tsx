import VideoThumb from "@/public/images/profile.png";
import ModalVideo from "@/components/modal-video";

export default function profile() {
  return (
    <section id="aboutme" className="scroll-mt-24">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        {/* Hero content */}
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-20">
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-xl text-indigo-200/65"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                Hi, I'm Gabriel Gerardo Alvarado Vargas, here you can find all the information about me and engage with my projects.
              </p>

              {/* <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
                <div data-aos="fade-up" data-aos-delay={400}>
                  <a
                    className="btn group mb-4 w-full bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto"
                    href="#0"
                  >
                    <span className="relative inline-flex items-center">
                      Start Building
                      <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
                        -&gt;
                      </span>
                    </span>
                  </a>
                </div>                
              </div> */}

            </div>
          </div>

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
