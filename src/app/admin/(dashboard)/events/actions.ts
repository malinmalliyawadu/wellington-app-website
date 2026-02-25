"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEventAction(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const placeId = formData.get("place_id") as string;
  const date = formData.get("date") as string;
  const startTime = formData.get("start_time") as string;
  const endTime = (formData.get("end_time") as string) || null;
  const imageUrl = (formData.get("image_url") as string) || null;
  const category = formData.get("category") as string;
  const ticketUrl = (formData.get("ticket_url") as string) || null;
  const priceRaw = formData.get("price") as string;
  const price = priceRaw ? parseFloat(priceRaw) : null;

  if (!title || !description || !placeId || !date || !startTime || !category) {
    return { error: "All required fields must be filled" };
  }

  const { error } = await supabaseAdmin.from("events").insert({
    title,
    description,
    place_id: placeId,
    date,
    start_time: startTime,
    end_time: endTime,
    image_url: imageUrl,
    category,
    ticket_url: ticketUrl,
    price,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export async function updateEventAction(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const placeId = formData.get("place_id") as string;
  const date = formData.get("date") as string;
  const startTime = formData.get("start_time") as string;
  const endTime = (formData.get("end_time") as string) || null;
  const imageUrl = (formData.get("image_url") as string) || null;
  const category = formData.get("category") as string;
  const ticketUrl = (formData.get("ticket_url") as string) || null;
  const priceRaw = formData.get("price") as string;
  const price = priceRaw ? parseFloat(priceRaw) : null;

  if (!id || !title || !description || !placeId || !date || !startTime || !category) {
    return { error: "All required fields must be filled" };
  }

  const { error } = await supabaseAdmin
    .from("events")
    .update({
      title,
      description,
      place_id: placeId,
      date,
      start_time: startTime,
      end_time: endTime,
      image_url: imageUrl,
      category,
      ticket_url: ticketUrl,
      price,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/events");
  revalidatePath(`/event/${id}`);
  redirect("/admin/events");
}

export async function deleteEventAction(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  if (!id) throw new Error("Event ID is required");

  const { error } = await supabaseAdmin.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/events");
  redirect("/admin/events");
}
