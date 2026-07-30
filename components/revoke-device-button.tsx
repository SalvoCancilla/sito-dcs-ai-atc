"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function RevokeDeviceButton({ deviceId }: { deviceId: string }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  // Goes through the API route rather than deleting from the browser client:
  // RLS would also cover this, but keeping destructive writes server-side
  // means a policy mistake cannot be exploited straight from the console.
  async function revoke() {
    if (!confirm("Revoke this device? The slot will be freed.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/devices/${deviceId}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Unable to revoke device");
      }
      toast.success("Device revoked");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-destructive"
      onClick={revoke}
      disabled={loading}
    >
      {loading ? "Revoking…" : "Revoke"}
    </Button>
  );
}
