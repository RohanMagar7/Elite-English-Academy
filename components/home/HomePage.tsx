/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import AboutSection from "@/components/AboutSection";
import TrainerCards from "@/components/TrainerCards";
import WhyChooseUs from "@/components/WhyChooseUs";
import CoursesSection from "@/components/CoursesSection";
import SuccessStories from "@/components/SuccessStories";
import BatchTimings from "@/components/BatchTimings";
import TestimonialSection from "@/components/TestimonialCard";
import NoticeSection from "@/components/NoticeCard";
import FaqSection from "@/components/FaqSection";
import GallerySection from "@/components/GalleryCard";
import Footer from "@/components/Footer";
import CallToAction from "@/components/CallToAction";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollToTop from "@/components/ScrollToTop";

export default function HomePage() {
    return (
        <>
            <AnnouncementBanner />
            <Navbar />
            <main>
                <div id="home" className="scroll-mt-24">
                    <Hero />
                </div>
                <div id="stats" className="scroll-mt-24">
                    <Stats />
                </div>
                <div id="success-stories" className="scroll-mt-24">
                    <SuccessStories />
                </div>
                <div id="about" className="scroll-mt-24">
                    <AboutSection />
                </div>
                <div id="trainers" className="scroll-mt-24">
                    <TrainerCards />
                </div>
                <div id="why-us" className="scroll-mt-24">
                    <WhyChooseUs />
                </div>
                <div id="courses" className="scroll-mt-24">
                    <CoursesSection />
                </div>
                <div id="batches" className="scroll-mt-24">
                    <BatchTimings />
                </div>
                <div id="testimonials" className="scroll-mt-24">
                    <TestimonialSection />
                </div>
                <div id="notices" className="scroll-mt-24">
                    <NoticeSection />
                </div>
                <div id="faqs" className="scroll-mt-24">
                    <FaqSection />
                </div>
                <div id="admission" className="scroll-mt-24">
                    <CallToAction />
                </div>
                <div id="gallery" className="scroll-mt-24">
                    <GallerySection />
                </div>
            </main>
            <ScrollToTop />
            <FloatingWhatsApp />
            <Footer />
        </>
    );
}
