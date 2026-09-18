"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { safeClientMessage } from "@/lib/client-errors";
import { Input, Select, Textarea } from "@/components/ui";

const RATING_OPTIONS = ["5", "4", "3", "2", "1"];

const EMPTY_FORM = {
  name: "",
  message: "",
  course: "",
  avatar: "",
  rating: "5",
  is_active: true,
};

export default function AddTestimonial() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("testimonials").insert([
      {
        name: form.name,
        message: form.message,
        course: form.course,
        avatar: form.avatar,
        is_active: form.is_active,
      },
    ]);
    setLoading(false);
    if (error) return alert(safeClientMessage(error, "Save failed. Please try again."));
    alert("Testimonial added.");
    setForm(EMPTY_FORM);
  }

  return (
    <div className="max-w-3xl">
      <h2 className="admin-page-title">Add Testimonial</h2>

      <form onSubmit={submit} className="admin-card mt-4 space-y-4">
        <div className="admin-form-grid">
          <Input
            label="Student name"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
          <Input
            label="Course"
            hint="Shown under the student's name (e.g. IELTS Preparation)."
            value={form.course}
            onChange={(e) => update("course", e.target.value)}
          />
          <Input
            label="Avatar URL"
            hint="Leave empty to auto-generate an avatar."
            value={form.avatar}
            onChange={(e) => update("avatar", e.target.value)}
          />
          <Select
            label="Rating"
            hint="Stars shown on the public review card."
            options={RATING_OPTIONS}
            value={form.rating}
            onChange={(e) => update("rating", e.target.value)}
          />
        </div>

        <Textarea
          label="Review"
          required
          rows={4}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
        />

        <label className="admin-check-row max-w-xs">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={(e) => update("is_active", e.target.checked)}
          />
          Active — shown on the public site
        </label>

        <div>
          <button disabled={loading} className="admin-btn-primary w-full sm:w-auto">
            {loading ? "Saving..." : "Add Testimonial"}
          </button>
        </div>
      </form>

      <p className="admin-hint mt-3">
        New testimonials appear on the public site once active. Manage all reviews from the
        Testimonials page.
      </p>
    </div>
  );
}
