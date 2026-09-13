type SectionBadgeProps = {
    label: string;
    className?: string;
};

export default function SectionBadge({ label, className = "" }: SectionBadgeProps) {
    return (
        <span
            className={`inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-[#2563EB] ${className}`.trim()}
        >
            {label}
        </span>
    );
}
