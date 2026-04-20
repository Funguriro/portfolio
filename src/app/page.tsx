import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import ServicesSection from "@/components/sections/ServicesSection";
import InfluencersSlider from "@/components/sections/InfluencersSlider";
import CorporatesSection from "@/components/sections/CorporatesSection";
import ChatInterface from "@/components/chat/ChatInterface";
import ReviewsSlider from "@/components/sections/ReviewsSlider";
import GitHubSection from "@/components/sections/GitHubSection";
import Footer from "@/components/sections/Footer";
import FloatingCTA from "@/components/ui/FloatingCTA";
import ScrollToTop from "@/components/ui/ScrollToTop";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <ServicesSection />
      <CorporatesSection />
      <InfluencersSlider />
      <ReviewsSlider />
      <ChatInterface />
      <GitHubSection />
      <Footer />
      <FloatingCTA />
      <ScrollToTop />
    </main>
  );
}
