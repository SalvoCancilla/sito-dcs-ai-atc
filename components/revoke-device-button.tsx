"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function RevokeDeviceButton({ deviceId }: { deviceId: string }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function revoke() {
    if (!confirm("Revoke this device? The slot will be freed.")) return;
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase
        .from("devices")
        .delete()
        .eq("id", deviceId);
      if (error) throw error;
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
