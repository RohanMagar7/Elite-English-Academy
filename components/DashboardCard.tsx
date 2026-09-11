import { ReactNode } from "react";

interface DashboardCardProps {
    title: string;
    value: string;
    icon: ReactNode;
}

export default function DashboardCard({ title, value, icon }: DashboardCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <h2 className="text-3xl font-bold text-blue-900">{value}</h2>
            </div>
            <div className="text-yellow-500">{icon}</div>
        </div>
    );
}