import Image from "next/image";
import HexBackground from "@/components/ui/HexBackground";
import { HexagonCard, AuthLinks } from "@/components/auth/shared";
import { theme } from "@/lib/theme";

type SearchParams = { email?: string };

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { email } = await searchParams;
  const safeEmail = typeof email === "string" ? email : "";

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: theme.pageBackground }}>
      <div
        className="tott-auth-top-band absolute top-0 left-0 right-0 z-0"
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
              <Image src="/images/Brand.png" alt="" width={120} height={48} className="h-12 w-auto object-contain" />
            </div>
          </div>

          <h1 className="text-xl font-semibold text-foreground text-center mb-2">Almost there</h1>
          <p className="text-neutral-400 text-sm text-center mb-6 max-w-md mx-auto">
            We have sent a verification message to your inbox. Open it and tap the link to confirm your email and start
            your journey.
          </p>

          <HexagonCard size="medium">
            <div className="w-full max-w-md flex flex-col items-center text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: `${theme.accentGold}33` }}
                aria-hidden
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={theme.accentGold}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-neutral-100 mb-3">Email verification sent</h2>
              <p className="text-neutral-400 text-sm mb-3 max-w-sm mx-auto leading-relaxed">
                Click the link in that email when you are ready. It opens this site, verifies your address in one step,
                then takes you to your profile so you can begin.
              </p>
              {safeEmail ? (
                <p className="text-neutral-500 text-xs mb-2 max-w-sm mx-auto break-all">
                  Sent to <span className="text-neutral-300">{safeEmail}</span>
                </p>
              ) : null}
              <p className="text-neutral-500 text-xs mb-2 max-w-sm mx-auto">
                If you do not see it in a minute or two, check spam or promotions.
              </p>
            </div>
          </HexagonCard>

          <AuthLinks
            primaryText="Wrong address?"
            primaryHref="/auth/register"
            primaryLinkLabel="Sign up again"
            backHref="/"
            backLabel="Home page"
          />
        </div>
      </div>
    </div>
  );
}
