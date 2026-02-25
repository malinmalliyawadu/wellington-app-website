"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deletePostAction(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  if (!id) throw new Error("Post ID is required");

  // Delete post media first
  await supabaseAdmin.from("post_media").delete().eq("post_id", id);

  const { error } = await supabaseAdmin.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}
