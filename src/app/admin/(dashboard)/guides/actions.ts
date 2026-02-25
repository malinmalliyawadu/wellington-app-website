"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateGuideAction(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const coverImageUrl = (formData.get("cover_image_url") as string) || null;

  if (!id || !title) {
    return { error: "Title is required" };
  }

  const { error } = await supabaseAdmin
    .from("guides")
    .update({ title, description, cover_image_url: coverImageUrl })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/guides");
  revalidatePath(`/guide/${id}`);
  redirect("/admin/guides");
}

export async function deleteGuideAction(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  if (!id) throw new Error("Guide ID is required");

  // Delete guide_places first, then the guide
  await supabaseAdmin.from("guide_places").delete().eq("guide_id", id);

  const { error } = await supabaseAdmin.from("guides").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/guides");
  redirect("/admin/guides");
}
