"use client";

import { useState } from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { safeClientMessage } from "@/lib/client-errors";

/**
 * Standard destructive-delete flow for the admin panel.
 *
 * Replaces every `if (!window.confirm(...)) return;` pattern with the
 * shared accessible ConfirmDialog. Pages call `requestDelete(item)` from
 * their Delete button and render the returned `dialog` node once.
 *
 * @example
 * const { requestDelete, dialog } = useConfirmDelete<string>(
 *   async (id) => {
 *     await supabase.from("notices").delete().eq("id", id);
 *     getNotices();
 *   },
 *   "Delete this notice?",
 * );
 */
export function useConfirmDelete<T>(
  onDelete: (item: T) => Promise<void> | void,
  message = "Delete this item?",
  title = "Confirm delete",
) {
  const [pending, setPending] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);

  const requestDelete = (item: T) => setPending(item);

  const handleConfirm = async () => {
    if (pending === null) return;
    setDeleting(true);
    try {
      await onDelete(pending);
      setPending(null);
    } catch (err) {
      alert(safeClientMessage(err, "Delete failed. Please try again."));
    } finally {
      setDeleting(false);
    }
  };

  const dialog = (
    <ConfirmDialog
      isOpen={pending !== null}
      onCancel={() => setPending(null)}
      onConfirm={handleConfirm}
      title={title}
      message={message}
      loading={deleting}
      confirmLabel="Delete"
    />
  );

  return { requestDelete, dialog };
}
