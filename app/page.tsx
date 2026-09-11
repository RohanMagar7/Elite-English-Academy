import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import CoursesSection from "@/components/CoursesSection";
import NoticeSection from "@/components/NoticeCard";
import GallerySection from "@/components/GalleryCard";
import Footer from "@/components/Footer";
import CallToAction from "@/components/CallToAction";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <AboutSection />
      <CoursesSection />
      <NoticeSection />
      <CallToAction />
      <GallerySection />
      <Footer />
    </>
  );
}