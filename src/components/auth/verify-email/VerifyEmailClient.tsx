"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { EmailIcon } from "@/components/ui/icons";
import { AuthInput } from "@/components/ui/AuthInput";
import { theme } from "@/lib/theme";
import { resendVerificationEmail, verifyEmail } from "@/services/auth.service";

type Status = "loading" | "success" | "error" | "missing";

export function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ran = useRef(false);
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendBusy, setResendBusy] = useState(false);
  const [resendFeedback, setResendFeedback] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const e = searchParams.get("email");
    if (e) setResendEmail(e);
  }, [searchParams]);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("missing");
      setMessage("This verification link is missing a token. Use the link from your email.");
      return;
    }
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        const result = await verifyEmail(token);
        setStatus("success");
        setMessage(
          result.loggedIn
            ? "Your email is verified. Starting your journey…"
            : "Your email is verified. Sign in to open your profile."
        );
        const dest = result.loggedIn ? "/profile" : "/auth/login";
        router.replace(dest);
        router.refresh();
      } catch (err) {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Verification failed.");
      }
    })();
  }, [router, searchParams]);

  async function handleResendVerification() {
    setResendFeedback(null);
    setResendBusy(true);
    try {
      await resendVerificationEmail(resendEmail);
      setResendFeedback({
        tone: "success",
        text: "Check your inbox for a new verification link.",
      });
    } catch (err) {
      setResendFeedback({
        tone: "error",
        text: err instanceof Error ? err.message : "Could not resend the email.",
      });
    } finally {
      setResendBusy(false);
    }
  }

  return (
    <div className="w-full max-w-md flex flex-col items-center text-center">
      {status === "loading" && (
        <>
          <div
            className="h-12 w-12 rounded-full border-2 border-t-transparent animate-spin mb-6"
            style={{ borderColor: `${theme.accentGold} transparent transparent transparent` }}
            aria-hidden
          />
          <h1 className="text-xl font-semibold text-white mb-2">Verifying your email…</h1>
          <p className="text-neutral-400 text-sm">Please wait a moment.</p>
        </>
      )}
      {(status === "error" || status === "missing") && (
        <>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-red-500/20 border border-red-400/40"
            aria-hidden
          >
            <span className="text-2xl text-red-300">!</span>
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">Could not verify email</h1>
          <p className="text-neutral-400 text-sm mb-8">{message}</p>

          <div className="w-full border-t border-white/10 pt-8 mt-2 text-left space-y-4">
            <p className="text-sm text-white font-medium text-center">Need a new link?</p>
            <AuthInput
              id="resend-email"
              name="resend-email"
              type="email"
              label="Email address"
              placeholder="you@example.com"
              autoComplete="email"
              value={resendEmail}
              onChange={(ev) => setResendEmail(ev.target.value)}
              icon={<EmailIcon />}
            />
            {resendFeedback && (
              <p
                className={`text-sm text-center ${resendFeedback.tone === "success" ? "text-green-400" : "text-red-400"}`}
              >
                {resendFeedback.text}
              </p>
            )}
            <button
              type="button"
              onClick={() => void handleResendVerification()}
              disabled={resendBusy}
              className="w-full py-3 rounded-lg font-medium text-black transition-colors disabled:opacity-60 cursor-pointer select-none"
              style={{ backgroundColor: theme.accentGold }}
            >
              {resendBusy ? "Sending…" : "Resend verification email"}
            </button>
          </div>

          <Link
            href="/auth/login"
            className="w-full mt-8 py-3 rounded-lg font-medium text-white transition-colors hover:opacity-90 cursor-pointer select-none block text-center border border-white/20"
          >
            Back to log in
          </Link>
        </>
      )}
      {status === "success" && (
        <>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-green-500/20 border border-green-400/40"
            aria-hidden
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-green-400">
              <path d="M20 6L9 17l-5-5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">Email verified</h1>
          <p className="text-neutral-400 text-sm">{message}</p>
        </>
      )}
    </div>
  );
}
