"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { env } from "@/shared/config/env";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              width?: number;
              text?: "signin_with" | "signup_with" | "continue_with";
              shape?: "rectangular" | "pill" | "circle" | "square";
            },
          ) => void;
        };
      };
    };
  }
}

let googleScriptPromise: Promise<void> | null = null;

function loadGoogleScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>("script[data-google-identity]");
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("No se pudo cargar Google.")), { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.dataset.googleIdentity = "true";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("No se pudo cargar Google."));
      document.head.appendChild(script);
    });
  }
  return googleScriptPromise;
}

type GoogleAuthButtonProps = {
  text?: "signin_with" | "signup_with" | "continue_with";
  onCredential: (credential: string) => Promise<void> | void;
  disabled?: boolean;
};

export function GoogleAuthButton({ text = "continue_with", onCredential, disabled }: GoogleAuthButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!env.googleClientId) {
      return;
    }
    loadGoogleScript()
      .then(() => {
        if (cancelled || !buttonRef.current || !window.google?.accounts?.id) return;
        buttonRef.current.innerHTML = "";
        window.google.accounts.id.initialize({
          client_id: env.googleClientId,
          callback: async (response) => {
            if (!response.credential || disabled) return;
            setIsLoading(true);
            setError(null);
            try {
              await onCredential(response.credential);
            } catch (err) {
              setError(err instanceof Error ? err.message : "No se pudo ingresar con Google.");
            } finally {
              setIsLoading(false);
            }
          },
        });
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          width: 360,
          text,
          shape: "rectangular",
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "No se pudo cargar Google."));
    return () => {
      cancelled = true;
    };
  }, [disabled, onCredential, text]);

  if (!env.googleClientId) {
    return <p className="text-xs text-[var(--color-danger)]">Google OAuth no esta configurado.</p>;
  }

  return (
    <div className="grid gap-2">
      <div className={disabled || isLoading ? "pointer-events-none opacity-60" : undefined} ref={buttonRef} />
      {isLoading && (
        <div className="inline-flex items-center gap-2 text-xs text-[var(--color-foreground-muted)]">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Validando Google...
        </div>
      )}
      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}
