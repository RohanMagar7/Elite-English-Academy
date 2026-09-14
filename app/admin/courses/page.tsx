"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Course {
    id: string;
    title: string;
    duration: string;
    fees: number;
    description: string | null;
    image_url?: string | null;
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState("");
    const [fees, setFees] = useState("");
    const [description, setDescription] = useState("");
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

    // Add Course
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

            const { error } = await supabase.from("courses").insert([
                {
                    title,
                    duration,
                    fees: Number(fees),
                    description,
                    image_url: finalImageUrl,
                },
            ]);

            if (error) {
                console.error(error);
                alert(error.message);
                return;
            }

            alert("Course Added Successfully!");

            setTitle("");
            setDuration("");
            setFees("");
            setDescription("");
            setImageUrl("");
            setFile(null);
            getCourses();
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : "Unable to upload course image.");
        } finally {
            setLoading(false);
        }
    }

    // Delete Course
    async function deleteCourse(id: string) {
        const confirmDelete = confirm("Delete this course?");
        if (!confirmDelete) return;

        const { error } = await supabase
            .from("courses")
            .delete()
            .eq("id", id);

        if (error) {
            alert(error.message);
            return;
        }

        getCourses();
    }

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-blue-900 mb-6">
                Courses Management
            </h1>

            {/* Add Course Form */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                <form onSubmit={addCourse} className="space-y-4">

                    <input
                        type="text"
                        placeholder="Course Name"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />

                    <input
                        type="text"
                        placeholder="Duration (Example: 3 Months)"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />

                    <input
                        type="number"
                        placeholder="Fees"
                        value={fees}
                        onChange={(e) => setFees(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />

                    <input
                        type="url"
                        placeholder="Course Image URL (optional)"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black file:mr-4 file:rounded file:border-0 file:bg-blue-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                    />

                    <textarea
                        placeholder="Course Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-blue-900 px-6 py-3 font-semibold text-white hover:bg-blue-800 disabled:bg-gray-400"
                    >
                        {loading ? "Saving..." : "Add Course"}
                    </button>
                </form>
            </div>

            {/* Courses Table */}
            <div className="bg-white rounded-2xl shadow-md p-6 overflow-x-auto">
                <h2 className="text-xl font-semibold mb-4 text-blue-900">
                    All Courses
                </h2>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b bg-gray-50 text-left text-gray-700">
                            <th className="p-3">Course</th>
                            <th className="p-3">Duration</th>
                            <th className="p-3">Fees</th>
                            <th className="p-3">Description</th>
                            <th className="p-3 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {courses.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="p-6 text-center text-gray-500"
                                >
                                    No courses available.
                                </td>
                            </tr>
                        ) : (
                            courses.map((course) => (
                                <tr key={course.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            {course.image_url ? (
                                                <img
                                                    src={course.image_url}
                                                    alt={course.title}
                                                    className="h-12 w-12 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-[10px] font-semibold text-blue-900">
                                                    IMG
                                                </div>
                                            )}
                                            <span className="font-medium text-gray-900">
                                                {course.title}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="p-3 text-gray-700">
                                        {course.duration}
                                    </td>

                                    <td className="p-3 text-green-700 font-semibold">
                                        ₹ {course.fees}
                                    </td>

                                    <td className="p-3 text-gray-600">
                                        {course.description}
                                    </td>

                                    <td className="p-3 text-center">
                                        <button
                                            onClick={() => deleteCourse(course.id)}
                                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}