import { Suspense } from "react";
import Image from "next/image";
import HexBackground from "@/components/ui/HexBackground";
import { HexagonCard, AuthLinks } from "@/components/auth/shared";
import { VerifyEmailClient } from "@/components/auth/verify-email";
import { theme } from "@/lib/theme";

export default function VerifyEmailPage() {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: theme.pageBackground }}
    >
      <div
        className="absolute top-0 left-0 right-0 z-0"
        style={{
          height: "220px",
          background: theme.authBandGradient,
        }}
      >
        <HexBackground />
      </div>
      <div className="fixed inset-0 -z-10" style={{ background: theme.pageBackground }} />
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 pt-16">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Image
                src="/images/Brand.png"
                alt=""
                width={120}
                height={48}
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>
          <h1 className="text-xl font-semibold text-foreground text-center mb-2">
            Email verification
          </h1>
          <p className="text-neutral-400 text-sm text-center mb-6 max-w-md mx-auto">
            Confirming the link from your inbox.
          </p>
          <HexagonCard size="medium">
            <Suspense
              fallback={
                <div className="w-full max-w-md h-40 animate-pulse rounded-lg bg-white/5" />
              }
            >
              <VerifyEmailClient />
            </Suspense>
          </HexagonCard>
          <AuthLinks
            primaryText="Wrong account?"
            primaryHref="/auth/register"
            primaryLinkLabel="Create an account"
            backHref="/"
            backLabel="Home page"
          />
        </div>
      </div>
    </div>
  );
}
