import DashboardCard from "@/components/DashboardCard";
import { BookOpen, Image, Bell, Star } from "lucide-react";

export default function AdminDashboard() {
    return (
        <>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
                Dashboard
            </h1>

            <p className="text-gray-600 mb-8">
                Welcome to Elite English Academy Admin Panel.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                <DashboardCard title="Courses" value="4" icon={<BookOpen size={36} />} />
                <DashboardCard title="Gallery Images" value="25" icon={<Image size={36} />} />
                <DashboardCard title="Notices" value="3" icon={<Bell size={36} />} />
                <DashboardCard title="Testimonials" value="12" icon={<Star size={36} />} />
            </div>
        </>
    );
}