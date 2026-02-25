"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPlaceAction(formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const address = formData.get("address") as string;
  const latitude = parseFloat(formData.get("latitude") as string);
  const longitude = parseFloat(formData.get("longitude") as string);
  const googlePlaceId = (formData.get("google_place_id") as string) || null;

  if (!name || !category || !address || isNaN(latitude) || isNaN(longitude)) {
    return { error: "All required fields must be filled" };
  }

  const { error } = await supabaseAdmin.from("places").insert({
    name,
    category,
    address,
    latitude,
    longitude,
    google_place_id: googlePlaceId,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/places");
  redirect("/admin/places");
}

export async function updatePlaceAction(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const address = formData.get("address") as string;
  const latitude = parseFloat(formData.get("latitude") as string);
  const longitude = parseFloat(formData.get("longitude") as string);
  const googlePlaceId = (formData.get("google_place_id") as string) || null;

  if (!id || !name || !category || !address || isNaN(latitude) || isNaN(longitude)) {
    return { error: "All required fields must be filled" };
  }

  const { error } = await supabaseAdmin
    .from("places")
    .update({ name, category, address, latitude, longitude, google_place_id: googlePlaceId })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/places");
  revalidatePath(`/place/${id}`);
  redirect("/admin/places");
}

export async function deletePlaceAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return { error: "Place ID is required" };

  // Check for dependencies
  const [{ count: postCount }, { count: eventCount }, { count: trailCount }] =
    await Promise.all([
      supabaseAdmin
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("place_id", id),
      supabaseAdmin
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("place_id", id),
      supabaseAdmin
        .from("trails")
        .select("*", { count: "exact", head: true })
        .eq("place_id", id),
    ]);

  const deps = [];
  if (postCount && postCount > 0) deps.push(`${postCount} posts`);
  if (eventCount && eventCount > 0) deps.push(`${eventCount} events`);
  if (trailCount && trailCount > 0) deps.push(`${trailCount} trails`);

  if (deps.length > 0) {
    return {
      error: `Cannot delete: place has ${deps.join(", ")} linked to it`,
    };
  }

  const { error } = await supabaseAdmin.from("places").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/places");
  redirect("/admin/places");
}
