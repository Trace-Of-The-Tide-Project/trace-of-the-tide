import { Suspense } from "react";
import Image from "next/image";
import HexBackground from "@/components/ui/HexBackground";
import { HexagonCard, AuthLinks } from "@/components/auth/shared";
import { RegisterForm } from "@/components/auth/register";
import { theme } from "@/lib/theme";

export default function RegisterPage() {
  return (
    <div
      className="min-h-screen relative overflow-x-hidden overflow-y-auto"
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
      <div className="relative min-h-screen flex flex-col items-center justify-center px-8 py-12 pt-16 sm:px-8 md:px-10">
        <div className="w-full max-w-5xl">
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
          <h1 className="text-xl font-semibold text-foreground text-center mb-6 cursor-crosshair select-none">
            {" "}
            Join Trace of the Tide
          </h1>
          <HexagonCard size="xl">
            <Suspense
              fallback={
                <div className="w-full max-w-md h-64 animate-pulse rounded-lg bg-white/5" />
              }
            >
              <RegisterForm />
            </Suspense>
          </HexagonCard>
          <AuthLinks
            primaryText="Already have an account?"
            primaryHref="/auth/login"
            primaryLinkLabel="Login"
            backHref="/"
            backLabel="Home page"
          />
        </div>
      </div>
    </div>
  );
}
