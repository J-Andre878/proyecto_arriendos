"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CheckTermsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const hasChecked = useRef(false);

  useEffect(() => {
    const checkTerms = async () => {
      // Solo verificar una sola vez en toda la sesión
      if (hasChecked.current) return;
      
      if (status === "authenticated" && session?.user?.email) {
        hasChecked.current = true;
        try {
          const response = await fetch("/api/profile");
          const data = await response.json();
          
          // Si el usuario no ha aceptado términos y no está en la página de aceptar
          if (!data.user?.accepted_terms && !window.location.pathname.includes("/accept-terms")) {
            router.push("/accept-terms");
          }
        } catch (err) {
          console.error("Error checking terms:", err);
        }
      }
    };

    checkTerms();
  }, [status, session, router]);

  return <>{children}</>;
}
