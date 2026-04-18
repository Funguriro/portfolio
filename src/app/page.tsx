import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ChatInterface from "@/components/ChatInterface";
import ReviewsSlider from "@/components/ReviewsSlider";
import GitHubSection from "@/components/GitHubSection";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <ChatInterface />
      <ReviewsSlider />
      <GitHubSection />
      <Footer />
      <FloatingCTA />
      <ScrollToTop />
    </main>
  );
}
