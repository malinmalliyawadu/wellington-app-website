"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Trail } from "@/lib/types";

interface TrailFormProps {
  trail?: Trail;
  action: (formData: FormData) => Promise<{ error: string } | void>;
}

export function TrailForm({ trail, action }: TrailFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error: string } | null, formData: FormData) => {
      const result = await action(formData);
      return result ?? null;
    },
    null
  );

  return (
    <form action={formAction} className="space-y-6">
      {trail && (
        <>
          <input type="hidden" name="id" value={trail.id} />
          <input type="hidden" name="place_id" value={trail.placeId} />
        </>
      )}

      {state?.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={trail?.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={trail?.description}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                name="difficulty"
                defaultValue={trail?.difficulty ?? "moderate"}
              >
                <SelectTrigger id="difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="distance">Distance</Label>
              <Input
                id="distance"
                name="distance"
                placeholder="e.g. 4.2 km"
                defaultValue={trail?.distance}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="elevation">Elevation</Label>
              <Input
                id="elevation"
                name="elevation"
                placeholder="e.g. 350m"
                defaultValue={trail?.elevation}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                placeholder="e.g. 2-3 hours"
                defaultValue={trail?.duration}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="highlights">One per line</Label>
            <Textarea
              id="highlights"
              name="highlights"
              rows={4}
              placeholder={"Native bush\nHarbour views\nWaterfall"}
              defaultValue={trail?.highlights?.join("\n")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trailhead</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trailhead_label">Label</Label>
            <Input
              id="trailhead_label"
              name="trailhead_label"
              placeholder="e.g. Khandallah Park entrance"
              defaultValue={trail?.trailhead?.label}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="trailhead_lat">Latitude</Label>
              <Input
                id="trailhead_lat"
                name="trailhead_lat"
                type="number"
                step="any"
                placeholder="-41.2865"
                defaultValue={trail?.trailhead?.latitude}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trailhead_lng">Longitude</Label>
              <Input
                id="trailhead_lng"
                name="trailhead_lng"
                type="number"
                step="any"
                placeholder="174.7762"
                defaultValue={trail?.trailhead?.longitude}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coordinates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="coordinates">
              JSON array of {`{latitude, longitude}`} points
            </Label>
            <Textarea
              id="coordinates"
              name="coordinates"
              rows={6}
              placeholder={'[{"latitude": -41.2865, "longitude": 174.7762}]'}
              defaultValue={
                trail?.coordinates
                  ? JSON.stringify(trail.coordinates, null, 2)
                  : ""
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={pending}>
          {pending
            ? "Saving..."
            : trail
              ? "Update Trail"
              : "Create Trail"}
        </Button>
      </div>
    </form>
  );
}
