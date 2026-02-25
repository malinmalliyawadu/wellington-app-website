import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrailForm } from "@/components/admin/trails/TrailForm";
import { createTrailAction } from "../actions";

export default function NewTrailPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/trails">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">New Trail</h1>
      </div>
      <TrailForm action={createTrailAction} />
    </div>
  );
}
