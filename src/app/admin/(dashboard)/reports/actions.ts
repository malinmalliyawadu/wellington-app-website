"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function updateReportStatusAction(
  formData: FormData
): Promise<void> {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  const adminNotes = formData.get("adminNotes") as string | null;

  if (!id || !status) throw new Error("Report ID and status are required");

  const update: Record<string, unknown> = { status };
  if (adminNotes !== null) update.admin_notes = adminNotes;
  if (status === "reviewed" || status === "dismissed") {
    update.resolved_at = new Date().toISOString();
  }

  const { error } = await supabaseAdmin
    .from("reports")
    .update(update)
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/reports");
}

export async function deleteReportAction(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  if (!id) throw new Error("Report ID is required");

  const { error } = await supabaseAdmin
    .from("reports")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/reports");
}

export async function deleteReportedContentAction(
  formData: FormData
): Promise<void> {
  const contentType = formData.get("contentType") as string;
  const contentId = formData.get("contentId") as string;
  const reportId = formData.get("reportId") as string;

  if (!contentType || !reportId) throw new Error("Missing required fields");

  if (contentType === "post" && contentId) {
    await supabaseAdmin.from("post_media").delete().eq("post_id", contentId);
    const { error } = await supabaseAdmin
      .from("posts")
      .delete()
      .eq("id", contentId);
    if (error) throw new Error(error.message);
  } else if (contentType === "comment" && contentId) {
    const { error } = await supabaseAdmin
      .from("comments")
      .delete()
      .eq("id", contentId);
    if (error) throw new Error(error.message);
  }

  // Mark report as reviewed
  await supabaseAdmin
    .from("reports")
    .update({
      status: "reviewed",
      admin_notes: "Reported content deleted",
      resolved_at: new Date().toISOString(),
    })
    .eq("id", reportId);

  revalidatePath("/admin/reports");
}
