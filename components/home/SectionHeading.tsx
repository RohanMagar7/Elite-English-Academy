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
	const centered = align === "center";

	return (
		<div className={`${centered ? "text-center" : "text-left"} ${className}`.trim()}>
			<span className="badge-text inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 font-semibold text-secondary">
				{eyebrow}
			</span>
			<h2 className="mt-4 font-section font-black text-primary sm:text-4xl">
				{title}
			</h2>
			{description ? (
				<p
					className={`mt-4 max-w-2xl font-body text-muted sm:text-lg ${
						centered ? "mx-auto" : ""
					}`}
				>
					{description}
				</p>
			) : null}
		</div>
	);
}
