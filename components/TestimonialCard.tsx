"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestimonialSection() {
	const [items, setItems] = useState<any[]>([]);

	useEffect(() => {
		async function load() {
			const { data } = await supabase
				.from("testimonials")
				.select("*")
				.eq("is_active", true)
				.order("created_at", { ascending: false })
				.limit(6);

			setItems(data || []);
		}

		load();
	}, []);

	if (items.length === 0) {
		return null;
	}

	return (
		<section className="py-20 bg-gray-50">
			<div className="max-w-7xl mx-auto px-8">
				<h2 className="text-4xl font-bold text-center text-blue-900 mb-10">What Parents Say</h2>

				<div className="grid md:grid-cols-3 gap-6">
					{items.map((t) => (
						<div key={t.id} className="rounded-2xl bg-white p-6 shadow">
							<p className="text-gray-700">{t.message}</p>

							<div className="mt-4 flex items-center gap-4">
								<img src={t.avatar || "/icons/avatar.png"} alt={t.name} className="h-12 w-12 rounded-full object-cover" />
								<div>
									<div className="font-semibold text-blue-900">{t.name}</div>
									<div className="text-sm text-gray-500">{t.course || "Parent"}</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

