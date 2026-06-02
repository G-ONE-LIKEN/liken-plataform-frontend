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

function GoogleColorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

type GoogleAuthButtonProps = {
  text?: "signin_with" | "signup_with" | "continue_with";
  onCredential: (credential: string) => Promise<void> | void;
  disabled?: boolean;
};

export function GoogleAuthButton({
  text = "continue_with",
  onCredential,
  disabled,
}: GoogleAuthButtonProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [buttonWidth, setButtonWidth] = useState(360);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const syncWidth = () => {
      const nextWidth = Math.max(Math.round(host.getBoundingClientRect().width), 240);
      setButtonWidth((current) => (current === nextWidth ? current : nextWidth));
    };

    syncWidth();

    const observer = new ResizeObserver(syncWidth);
    observer.observe(host);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!env.googleClientId) return;

    loadGoogleScript()
      .then(() => {
        if (cancelled || !googleButtonRef.current || !window.google?.accounts?.id) return;

        googleButtonRef.current.innerHTML = "";
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

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          width: buttonWidth,
          text,
          shape: "rectangular",
        });
        setReady(true);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "No se pudo cargar Google."),
      );

    return () => {
      cancelled = true;
    };
  }, [buttonWidth, disabled, onCredential, text]);

  if (!env.googleClientId) {
    return <p className="text-xs text-[var(--color-danger)]">Google OAuth no esta configurado.</p>;
  }

  return (
    <div className="grid gap-2">
      <div ref={hostRef} className="relative w-full">
        <div
          aria-hidden="true"
          className={`pointer-events-none flex w-full items-center justify-center gap-3 rounded border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2.5 text-sm font-medium text-[var(--color-foreground)] transition-colors ${disabled || isLoading || !ready ? "opacity-50" : ""}`}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-[var(--color-foreground-muted)]" />
          ) : (
            <GoogleColorIcon />
          )}
          <span>{isLoading ? "Validando..." : "Continuar con Google"}</span>
        </div>

        <div
          ref={googleButtonRef}
          aria-label="Continuar con Google"
          className={`absolute inset-0 overflow-hidden rounded ${disabled || isLoading || !ready ? "pointer-events-none opacity-0" : "opacity-[0.01]"}`}
        />
      </div>

      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}
