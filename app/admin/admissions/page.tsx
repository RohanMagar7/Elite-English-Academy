
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
    <div className="admin-page">

      <h1 className="admin-page-title mb-8">
        Admission Enquiries
      </h1>

      <div className="admin-table-wrap">

        <table className="admin-table">
          <thead>
            <tr>
              <th >Student</th>
              <th >Phone</th>
              <th >Class</th>
              <th >Course</th>
              <th >Status</th>
              <th >Action</th>
            </tr>
          </thead>

          <tbody>
            {admissions.map((student) => (
              <tr key={student.id} className="admin-tbody-row">

                <td className="p-3">
                  <div className="font-semibold">
                    {student.student_name}
                  </div>

                  <div className="text-sm text-slate-600">
                    {student.parent_name}
                  </div>

                  <div className="text-sm text-slate-600">
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
                    className="admin-select"
                  >
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Joined</option>
                  </select>
                </td>

                <td className="p-3">
                  <button
                    onClick={() => deleteAdmission(student.id)}
                    className="admin-btn-danger"
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