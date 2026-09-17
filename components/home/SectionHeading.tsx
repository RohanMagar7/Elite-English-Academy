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
            <span className="sticky-tag">{eyebrow}</span>
            <h2 className="mt-4 font-section text-pencil">
                {title}
            </h2>
            {description ? (
                <p className="mx-auto mt-4 max-w-2xl text-pencil/75 sm:text-lg">
                    {description}
                </p>
            ) : null}
        </div>
    );
}
