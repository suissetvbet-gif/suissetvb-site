import { useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { upsertUser } from "@/lib/auth";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function AuthCallback() {
  const [_, setLocation] = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          await upsertUser(session.user);
        }
      } catch (error) {
        console.error("Error during auth callback:", error);
      } finally {
        setLocation("/");
      }
    };

    handleAuthCallback();
  }, [setLocation]);

  return <LoadingScreen />;
}
