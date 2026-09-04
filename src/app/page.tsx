import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { Services } from "@/components/Services";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Gallery } from "@/components/Gallery";
import { FeaturedBanner } from "@/components/FeaturedBanner";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { MobileCTA } from "@/components/MobileCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        <EmergencyBanner />
        <WhyChooseUs />
        <Gallery />
        <FeaturedBanner />
        <About />
        <Contact />
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}
