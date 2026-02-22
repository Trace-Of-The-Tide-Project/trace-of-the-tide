import HexBackground from "@/components/ui/HexBackground";
import { ContributeResultButton } from "@/components/contribute/ContributeResultButton";
import { ContactUsLink } from "@/components/contribute/ContactUsLink";
import { theme } from "@/lib/theme";

function XIcon() {
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
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export default function ContributionErrorPage() {
  return (
    <div
      className="relative min-h-screen w-full select-none"
      style={{ backgroundColor: theme.bgDark }}
    >
      {/* Red-tinted hexagon pattern at top */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0" style={{ background: theme.bgDark }} />
        <div className="absolute inset-0 h-[320px] w-full">
          <HexBackground />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(127, 29, 29, 0.25) 0%, transparent 70%)",
            }}
            aria-hidden
          />
        </div>
      </section>

      {/* Centered error content */}
      <div className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-6 py-12">
        <div className="flex w-full max-w-md flex-col items-center text-center">
          <div
            className="mb-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-red-600"
            aria-hidden
          >
            <XIcon />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-white">
            Hmm... Something went wrong.
          </h1>
          <p className="mb-8 max-w-sm text-center text-sm text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit nulla vel
            consequat arcu nulla vel arcu amet vestibulum nibh.
          </p>
          <ContributeResultButton href="/contribute" variant="outline">
            Try again
          </ContributeResultButton>
          <ContactUsLink />
        </div>
      </div>
    </div>
  );
}
