import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceForm } from "@/components/admin/places/PlaceForm";
import { createPlaceAction } from "../actions";

export default function NewPlacePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/places">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">New Place</h1>
      </div>
      <PlaceForm action={createPlaceAction} />
    </div>
  );
}
