import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/sections/Hero";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/ui/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#050508] bg-grid-pattern overflow-hidden">
      {/* Subtle top ambient radial lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-blue-500/[0.07] via-indigo-500/[0.03] to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Floating Glass Navigation */}
      <Navbar />

      <main className="relative z-10 flex flex-col">
        {/* Hero Section with 3D Canvas */}
        <Hero />

        {/* Live Vercel Projects Showcase */}
        <ProjectsSection />

        {/* Services & Chatbots & Tech Stack */}
        <ServicesSection />

        {/* Contact CTA */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
