import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import AboutSection from "@/components/AboutSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import CoursesSection from "@/components/CoursesSection";
import TestimonialSection from "@/components/TestimonialCard";
import NoticeSection from "@/components/NoticeCard";
import GallerySection from "@/components/GalleryCard";
import Footer from "@/components/Footer";
import CallToAction from "@/components/CallToAction";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function HomePage() {
    return (
        <>
            <Navbar />
            <main>
                <div id="home" className="scroll-mt-24">
                    <Hero />
                </div>
                <div id="stats" className="scroll-mt-24">
                    <Stats />
                </div>
                <div id="about" className="scroll-mt-24">
                    <AboutSection />
                </div>
                <div id="why-us" className="scroll-mt-24">
                    <WhyChooseUs />
                </div>
                <div id="courses" className="scroll-mt-24">
                    <CoursesSection />
                </div>
                <div id="testimonials" className="scroll-mt-24">
                    <TestimonialSection />
                </div>
                <div id="notices" className="scroll-mt-24">
                    <NoticeSection />
                </div>
                <div id="admission" className="scroll-mt-24">
                    <CallToAction />
                </div>
                <div id="gallery" className="scroll-mt-24">
                    <GallerySection />
                </div>
            </main>
            <FloatingWhatsApp />
            <Footer />
        </>
    );
}
