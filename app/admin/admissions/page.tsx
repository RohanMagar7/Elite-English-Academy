
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Admission {
  id: string;
  student_name: string;
  parent_name: string;
  phone: string;
  email: string;
  class_name: string;
  course: string;
  preferred_batch: string;
  status: string;
}

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);

  async function getAdmissions() {
    const { data } = await supabase
      .from("admissions")
      .select("*")
      .order("created_at", { ascending: false });

    setAdmissions(data || []);
  }

  useEffect(() => {
    getAdmissions();
  }, []);

  async function updateStatus(id: string, status: string) {
    await supabase
      .from("admissions")
      .update({ status })
      .eq("id", id);

    getAdmissions();
  }

  async function deleteAdmission(id: string) {
    if (!confirm("Delete enquiry?")) return;

    await supabase
      .from("admissions")
      .delete()
      .eq("id", id);

    getAdmissions();
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold text-blue-900 mb-8">
        Admission Enquiries
      </h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Course</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {admissions.map((student) => (
              <tr key={student.id} className="border-b">

                <td className="p-3">
                  <div className="font-semibold">
                    {student.student_name}
                  </div>

                  <div className="text-sm text-gray-500">
                    {student.parent_name}
                  </div>

                  <div className="text-sm text-gray-500">
                    {student.email}
                  </div>
                </td>

                <td className="p-3">{student.phone}</td>

                <td className="p-3">{student.class_name}</td>

                <td className="p-3">{student.course}</td>

                <td className="p-3">
                  <select
                    value={student.status}
                    onChange={(e) =>
                      updateStatus(student.id, e.target.value)
                    }
                    className="border rounded px-2 py-1 text-black"
                  >
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Joined</option>
                  </select>
                </td>

                <td className="p-3">
                  <button
                    onClick={() => deleteAdmission(student.id)}
                    className="bg-red-600 text-white px-3 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}