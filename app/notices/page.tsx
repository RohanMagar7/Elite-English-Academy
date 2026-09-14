import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NoticeSection from "@/components/NoticeCard";
import { academy } from "@/lib/site";

export default function NoticesPage() {
    return (
        <>
            <Navbar />
            <NoticeSection />
            <Footer />
        </>
    );
}

