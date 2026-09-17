
"use client";
import { notify } from "@/components/ui/notify";
import { confirmDialog } from "@/components/ui/ConfirmDialog";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { idSchema, statusSchema } from "@/lib/validation";

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
    // STRICT client check with the same rules the server enforces; rejects bad input.
    if (!idSchema.safeParse(id).success || !statusSchema.safeParse(status).success) {
      notify.error("Invalid status update.");
      return;
    }
    try {
      const res = await fetch("/api/admin/admissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        notify.error((data.error as string) ?? "Update failed.");
      }
    } catch {
      notify.error("Unable to reach the server.");
    }

    getAdmissions();
  }

  async function deleteAdmission(id: string) {
    if (!(await confirmDialog({ message: "Delete enquiry?", tone: "danger" }))) return;
    // STRICT: UUID required — rejected, never coerced.
    if (!idSchema.safeParse(id).success) {
      notify.error("Invalid id.");
      return;
    }
    try {
      const res = await fetch(`/api/admin/admissions?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        notify.error((data.error as string) ?? "Delete failed.");
      }
    } catch {
      notify.error("Unable to reach the server.");
    }

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