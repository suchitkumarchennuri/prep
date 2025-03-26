"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        toast.success("Signed out successfully", {
          style: {
            background: "#22c55e",
            color: "#ffffff",
          },
        });
        router.push("/sign-in");
      } else {
        toast.error(result.message, {
          style: {
            background: "#ef4444",
            color: "#ffffff",
          },
        });
      }
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out", {
        style: {
          background: "#ef4444",
          color: "#ffffff",
        },
      });
    }
  };

  return (
    <Button variant="outline" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
