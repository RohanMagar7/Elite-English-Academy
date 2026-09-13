type SectionHeadingProps = {
    eyebrow: string;
    title: string;
    description?: string;
    align?: "left" | "center";
    className?: string;
};

export default function SectionHeading({
    eyebrow,
    title,
    description,
    align = "center",
    className = "",
}: SectionHeadingProps) {
    const alignment = align === "left" ? "text-left" : "text-center";

    return (
        <div className={`${alignment} ${className}`.trim()}>
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-[#2563EB]">
                {eyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-blue-950 sm:text-4xl">
                {title}
            </h2>
            {description ? (
                <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                    {description}
                </p>
            ) : null}
        </div>
    );
}
