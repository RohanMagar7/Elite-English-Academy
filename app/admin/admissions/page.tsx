
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { idSchema, statusSchema } from "@/lib/validation";
import { useConfirmDelete } from "@/hooks/useConfirmDelete";
import { TableHead, TableBody, TableRow, Th, Td } from "@/components/ui";

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
      alert("Invalid status update.");
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
        alert((data.error as string) ?? "Update failed.");
      }
    } catch {
      alert("Unable to reach the server.");
    }

    getAdmissions();
  }

  const { requestDelete, dialog } = useConfirmDelete<string>(
      async (id) => {
    // STRICT: UUID required — rejected, never coerced.
    if (!idSchema.safeParse(id).success) {
      alert("Invalid id.");
      return;
    }
    try {
      const res = await fetch(`/api/admin/admissions?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert((data.error as string) ?? "Delete failed.");
      }
    } catch {
      alert("Unable to reach the server.");
    }

    getAdmissions();
      },
      "Delete this enquiry?",
  );

  return (
    <div className="admin-page">
            {dialog}

      <h1 className="admin-page-title mb-8">
        Admission Enquiries
      </h1>

      <div className="admin-table-wrap">

        <table className="admin-table">
          <TableHead>
            <tr>
              <Th >Student</Th>
              <Th >Phone</Th>
              <Th >Class</Th>
              <Th >Course</Th>
              <Th >Status</Th>
              <Th >Action</Th>
            </tr>
          </TableHead>

          <TableBody>
            {admissions.map((student) => (
              <TableRow key={student.id} className="admin-tbody-row">

                <Td className="p-3">
                  <div className="font-semibold">
                    {student.student_name}
                  </div>

                  <div className="text-sm text-slate-600">
                    {student.parent_name}
                  </div>

                  <div className="text-sm text-slate-600">
                    {student.email}
                  </div>
                </Td>

                <Td className="p-3">{student.phone}</Td>

                <Td className="p-3">{student.class_name}</Td>

                <Td className="p-3">{student.course}</Td>

                <Td className="p-3">
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
                </Td>

                <Td className="p-3">
                  <button
                    onClick={() => requestDelete(student.id)}
                    className="admin-btn-danger"
                  >
                    Delete
                  </button>
                </Td>

              </TableRow>
            ))}
          </TableBody>
        </table>

      </div>

    </div>
  );
}