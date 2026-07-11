export const metadata = {
  title: "Home - Open PRO",
  description: "Page description",
};

import PageIllustration from "@/components/page-illustration";
import Hero from "@/components/profile-home";
import Workflows from "@/components/workflows";
import Features from "@/components/features";
import Contact from "@/components/contact";

export default function Home() {
  return (
    <div className="pt-16">
      <PageIllustration />
      <Workflows />
      <Features />
      <Contact />
      <Hero />
    </div>
  );
}
