"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTrailAction(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const difficulty = formData.get("difficulty") as string;
  const distance = formData.get("distance") as string;
  const elevation = formData.get("elevation") as string;
  const duration = formData.get("duration") as string;
  const highlightsRaw = formData.get("highlights") as string;
  const trailheadLat = formData.get("trailhead_lat") as string;
  const trailheadLng = formData.get("trailhead_lng") as string;
  const trailheadLabel = formData.get("trailhead_label") as string;
  const coordinatesRaw = formData.get("coordinates") as string;

  if (!name || !description || !difficulty || !distance || !elevation || !duration) {
    return { error: "All required fields must be filled" };
  }

  const highlights = highlightsRaw
    ? highlightsRaw
        .split("\n")
        .map((h) => h.trim())
        .filter(Boolean)
    : [];

  const trailhead =
    trailheadLat && trailheadLng && trailheadLabel
      ? {
          latitude: parseFloat(trailheadLat),
          longitude: parseFloat(trailheadLng),
          label: trailheadLabel,
        }
      : null;

  let coordinates = null;
  if (coordinatesRaw) {
    try {
      coordinates = JSON.parse(coordinatesRaw);
    } catch {
      return { error: "Invalid coordinates JSON" };
    }
  }

  // Create shadow place for the trail
  const { data: place, error: placeError } = await supabaseAdmin
    .from("places")
    .insert({
      name,
      category: "trail",
      address: trailhead?.label ?? name,
      latitude: trailhead?.latitude ?? -41.2865,
      longitude: trailhead?.longitude ?? 174.7762,
    })
    .select("id")
    .single();

  if (placeError) {
    return { error: `Failed to create place: ${placeError.message}` };
  }

  const { error: trailError } = await supabaseAdmin.from("trails").insert({
    name,
    description,
    difficulty,
    distance,
    elevation,
    duration,
    highlights,
    place_id: place.id,
    trailhead,
    coordinates,
  });

  if (trailError) {
    // Clean up the place if trail creation fails
    await supabaseAdmin.from("places").delete().eq("id", place.id);
    return { error: `Failed to create trail: ${trailError.message}` };
  }

  revalidatePath("/admin/trails");
  redirect("/admin/trails");
}

export async function updateTrailAction(formData: FormData) {
  const id = formData.get("id") as string;
  const placeId = formData.get("place_id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const difficulty = formData.get("difficulty") as string;
  const distance = formData.get("distance") as string;
  const elevation = formData.get("elevation") as string;
  const duration = formData.get("duration") as string;
  const highlightsRaw = formData.get("highlights") as string;
  const trailheadLat = formData.get("trailhead_lat") as string;
  const trailheadLng = formData.get("trailhead_lng") as string;
  const trailheadLabel = formData.get("trailhead_label") as string;
  const coordinatesRaw = formData.get("coordinates") as string;

  if (!id || !name || !description || !difficulty || !distance || !elevation || !duration) {
    return { error: "All required fields must be filled" };
  }

  const highlights = highlightsRaw
    ? highlightsRaw
        .split("\n")
        .map((h) => h.trim())
        .filter(Boolean)
    : [];

  const trailhead =
    trailheadLat && trailheadLng && trailheadLabel
      ? {
          latitude: parseFloat(trailheadLat),
          longitude: parseFloat(trailheadLng),
          label: trailheadLabel,
        }
      : null;

  let coordinates = null;
  if (coordinatesRaw) {
    try {
      coordinates = JSON.parse(coordinatesRaw);
    } catch {
      return { error: "Invalid coordinates JSON" };
    }
  }

  const { error: trailError } = await supabaseAdmin
    .from("trails")
    .update({
      name,
      description,
      difficulty,
      distance,
      elevation,
      duration,
      highlights,
      trailhead,
      coordinates,
    })
    .eq("id", id);

  if (trailError) {
    return { error: `Failed to update trail: ${trailError.message}` };
  }

  // Update shadow place
  if (placeId) {
    await supabaseAdmin
      .from("places")
      .update({
        name,
        address: trailhead?.label ?? name,
        latitude: trailhead?.latitude ?? -41.2865,
        longitude: trailhead?.longitude ?? 174.7762,
      })
      .eq("id", placeId);
  }

  revalidatePath("/admin/trails");
  revalidatePath(`/trail/${id}`);
  redirect("/admin/trails");
}

export async function deleteTrailAction(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  const placeId = formData.get("place_id") as string;

  if (!id) throw new Error("Trail ID is required");

  const { error: trailError } = await supabaseAdmin
    .from("trails")
    .delete()
    .eq("id", id);

  if (trailError) throw new Error(`Failed to delete trail: ${trailError.message}`);

  // Try to delete shadow place (may fail if posts/events reference it)
  if (placeId) {
    await supabaseAdmin.from("places").delete().eq("id", placeId);
  }

  revalidatePath("/admin/trails");
  redirect("/admin/trails");
}
