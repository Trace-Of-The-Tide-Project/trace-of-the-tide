import HexBackground from "@/components/ui/HexBackground";
import { ContributeResultButton } from "@/components/contribute/ContributeResultButton";
import { ContactUsLink } from "@/components/contribute/ContactUsLink";
import { theme } from "@/lib/theme";

function CheckIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function ContributionSuccessPage() {
  return (
    <div
      className="relative min-h-screen w-full select-none"
      style={{ backgroundColor: theme.bgDark }}
    >
      {/* Hexagon pattern at top */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0" style={{ background: theme.bgDark }} />
        <div className="absolute inset-0 h-[280px] w-full">
          <HexBackground />
        </div>
      </section>

      {/* Centered success content */}
      <div className="relative z-10 flex min-h-[60vh] select-none flex-col items-center justify-center px-6 py-12">
        <div className="flex w-full max-w-md flex-col select-none items-center text-center">
          <div
            className="mb-6 flex h-16 w-16 shrink-0 select-none items-center justify-center rounded-full bg-green-500"
            aria-hidden
          >
            <CheckIcon />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-white">
            Thank you for your contribution!
          </h1>
          <ContributeResultButton href="/">Back to home</ContributeResultButton>
          <ContactUsLink />
        </div>
      </div>
    </div>
  );
}
