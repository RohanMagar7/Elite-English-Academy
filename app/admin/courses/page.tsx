/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { safeClientMessage } from "@/lib/client-errors";
import { useConfirmDelete } from "@/hooks/useConfirmDelete";
import { TableHead, TableBody, TableRow, Th, Td } from "@/components/ui";

interface Course {
    id: string;
    title: string;
    duration: string;
    fees: number;
    description: string | null;
    image_url?: string | null;
    eligibility?: string | null;
    mode?: string | null;
    level?: string | null;
    sort_order?: number;
    is_active?: boolean;
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState("");
    const [fees, setFees] = useState("");
    const [description, setDescription] = useState("");
    const [eligibility, setEligibility] = useState("");
    const [mode, setMode] = useState("");
    const [level, setLevel] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [imageUrl, setImageUrl] = useState("");
    const [file, setFile] = useState<File | null>(null);

    async function uploadCourseImage(selectedFile: File): Promise<string> {
        const buckets = ["courses", "gallery"];
        let lastError: Error | null = null;

        for (const bucket of buckets) {
            const fileName = `${Date.now()}-${selectedFile.name.replace(/\s+/g, "-")}`;
            const { error } = await supabase.storage.from(bucket).upload(fileName, selectedFile);

            if (!error) {
                const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
                return data.publicUrl;
            }

            lastError = error;
        }

        throw new Error(lastError?.message || "Unable to upload course image to storage.");
    }

    // Fetch all courses
    async function getCourses() {
        const { data, error } = await supabase
            .from("courses")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        setCourses(data || []);
    }

    useEffect(() => {
        getCourses();
    }, []);

    // Add or Update Course
    async function addCourse(e: React.FormEvent) {
        e.preventDefault();

        if (!title || !duration || !fees) {
            alert("Please fill all required fields.");
            return;
        }

        setLoading(true);

        try {
            let finalImageUrl = imageUrl.trim() || null;

            if (file) {
                finalImageUrl = await uploadCourseImage(file);
            }

            const payload = {
                title,
                duration,
                fees: Number(fees),
                description,
                eligibility: eligibility.trim() || null,
                mode: mode.trim() || null,
                level: level.trim() || null,
                sort_order: Number(sortOrder) || 0,
                is_active: isActive,
                image_url: finalImageUrl,
            };

            const { error } = editing
                ? await supabase.from("courses").update(payload).eq("id", editing)
                : await supabase.from("courses").insert([payload]);

            if (error) {
                console.error(error);
                alert(safeClientMessage(error, "Save failed. Please try again."));
                return;
            }

            alert(editing ? "Course Updated Successfully!" : "Course Added Successfully!");

            setTitle("");
            setDuration("");
            setFees("");
            setDescription("");
            setEligibility("");
            setMode("");
            setLevel("");
            setSortOrder("");
            setIsActive(true);
            setImageUrl("");
            setFile(null);
            setEditing(null);
            getCourses();
        } catch (error) {
            console.error(error);
            alert(safeClientMessage(error, "Unable to upload course image."));
        } finally {
            setLoading(false);
        }
    }

    function startEdit(course: Course) {
        setEditing(course.id);
        setTitle(course.title);
        setDuration(course.duration || "");
        setFees(String(course.fees ?? ""));
        setDescription(course.description || "");
        setEligibility(course.eligibility || "");
        setMode(course.mode || "");
        setLevel(course.level || "");
        setSortOrder(String(course.sort_order ?? 0));
        setIsActive(course.is_active ?? true);
        setImageUrl(course.image_url || "");
        setFile(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function cancelEdit() {
        setEditing(null);
        setTitle("");
        setDuration("");
        setFees("");
        setDescription("");
        setEligibility("");
        setMode("");
        setLevel("");
        setSortOrder("");
        setIsActive(true);
        setImageUrl("");
        setFile(null);
    }

    async function toggleCourse(id: string, active: boolean) {
        await supabase.from("courses").update({ is_active: !active }).eq("id", id);
        getCourses();
    }

    // Delete Course
    const { requestDelete, dialog } = useConfirmDelete<string>(
        async (id) => {
        const { error } = await supabase
            .from("courses")
            .delete()
            .eq("id", id);

        if (error) {
            alert(safeClientMessage(error, "Save failed. Please try again."));
            return;
        }

        getCourses();
        },
        "Delete this course?",
    );

    return (
        <div className="admin-page">
            {dialog}
            <h1 className="admin-page-title mb-6">
                Courses Management
            </h1>

            {/* Add Course Form */}
            <div className="admin-card mb-2">
                <form onSubmit={addCourse} className="space-y-4">

                    <input
                        type="text"
                        placeholder="Course Name"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input-default"
                    />

                    <input
                        type="text"
                        placeholder="Duration (Example: 3 Months)"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="input-default"
                    />

                    <input
                        type="number"
                        placeholder="Fees"
                        value={fees}
                        onChange={(e) => setFees(e.target.value)}
                        className="input-default"
                    />

                    <input
                        type="text"
                        placeholder="Eligibility (optional)"
                        value={eligibility}
                        onChange={(e) => setEligibility(e.target.value)}
                        className="input-default"
                    />

                    <input
                        type="text"
                        placeholder="Mode (Online / Offline / Online & Offline)"
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        className="input-default"
                    />

                    <input
                        type="text"
                        placeholder="Level / Audience (optional)"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="input-default"
                    />

                    <input
                        type="number"
                        placeholder="Sort Order"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="input-default"
                    />

                    <input
                        type="url"
                        placeholder="Course Image URL (optional)"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="input-default"
                    />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="input-default"
                    />

                    <textarea
                        placeholder="Course Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="input-default"
                    />

                    <label className="flex items-center gap-3 text-sm font-medium text-slate-800">
                        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                        Active (visible on website)
                    </label>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-blue-900 px-6 py-3 font-semibold text-white hover:bg-blue-800 disabled:bg-gray-400"
                        >
                            {loading ? "Saving..." : editing ? "Update Course" : "Add Course"}
                        </button>
                        {editing && (
                            <button type="button" onClick={cancelEdit} className="rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-blue-950 hover:bg-yellow-300">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Courses Table */}
            <div className="admin-table-wrap">
                <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                    All Courses
                </h2>

                <table className="admin-table">
                    <TableHead>
                        <tr >
                            <Th className="p-3">Course</Th>
                            <Th className="p-3">Duration</Th>
                            <Th className="p-3">Fees</Th>
                            <Th className="p-3">Description</Th>
                            <Th className="admin-tcenter">Action</Th>
                        </tr>
                    </TableHead>

                    <TableBody>
                        {courses.length === 0 ? (
                            <TableRow>
                                <Td
                                    colSpan={5}
                                    className="p-6 text-center text-slate-600"
                                >
                                    No courses available.
                                </Td>
                            </TableRow>
                        ) : (
                            courses.map((course) => (
                                <TableRow key={course.id} className="border-b hover:bg-slate-50">
                                    <Td className="p-3">
                                        <div className="flex items-center gap-3">
                                            {course.image_url ? (
                                                <img
                                                    src={course.image_url}
                                                    alt={course.title}
                                                    className="h-12 w-12 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-[10px] font-semibold text-blue-950">
                                                    IMG
                                                </div>
                                            )}
                                            <span className="admin-cell-main">
                                                {course.title}
                                            </span>
                                        </div>
                                    </Td>

                                    <Td className="p-3 text-slate-800">
                                        {course.duration}
                                    </Td>

                                    <Td className="p-3 text-green-700 font-semibold">
                                        ₹ {course.fees}
                                    </Td>

                                    <Td className="p-3 text-slate-600">
                                        {course.description}
                                    </Td>

                                    <Td className="admin-tcenter">
                                        <div className="flex flex-wrap justify-center gap-2">
                                            <button
                                                onClick={() => startEdit(course)}
                                                className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-blue-950 hover:bg-yellow-300"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => toggleCourse(course.id, !!course.is_active)}
                                                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${course.is_active ? "bg-green-600 hover:bg-green-700" : "bg-slate-500 hover:bg-gray-600"}`}
                                            >
                                                {course.is_active ? "Hide" : "Show"}
                                            </button>
                                            <button
                                                onClick={() => requestDelete(course.id)}
                                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </Td>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </table>
            </div>
        </div>
    );
}