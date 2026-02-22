import HexBackground from "@/components/ui/HexBackground";
import { HexImageGrid } from "@/components/ui/HexImageGrid";
import { OpenCallForm } from "@/components/open-call/OpenCallForm";
import { ContributeIcon } from "@/components/ui/icons";
import { theme } from "@/lib/theme";

export default function OpenCallPage() {
  return (
    <div className="relative min-h-screen w-full" style={{ backgroundColor: theme.bgDark }}>
      <div className="absolute inset-0">
        <HexBackground />
      </div>

      <div className="relative z-10">
        {/* Hex images (left) + Article & Form (right) */}
        <section className="flex flex-col items-start lg:flex-row">
          <HexImageGrid className="pl-8 pt-16 lg:pt-20" />

          {/* Article + Form (flex column) */}
          <div className="flex min-w-0 flex-1 flex-col gap-10 px-6 pt-16 pb-16 sm:px-10 sm:pt-24 sm:pb-24 lg:pl-6 lg:pr-10">
            {/* Article */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                <span
                  className="rounded px-2.5 py-0.5 text-xs font-semibold uppercase"
                  style={{ backgroundColor: theme.accentGold, color: "#1a1a1a" }}
                >
                  Edition
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: theme.accentGold }}
                  />
                  Author
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: theme.accentGold }}
                  />
                  Date
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: theme.accentGold }}
                  />
                  Category
                </span>
              </div>

              <h1 className="text-2xl font-bold leading-snug text-white sm:text-3xl">
                British Restrict Jewish Immigration to Palestine
              </h1>

              <div className="space-y-4 text-sm leading-relaxed text-gray-400">
                <p>
                  As Great Britain launched the Palestine campaign in 1917 during World War I, and
                  its forces were close to conquering Jerusalem, it issued the Balfour Declaration
                  that expressed its support for the establishment of a Jewish National Home in
                  Palestine. Though Palestinians were relieved that the hardships of the war and the
                  Ottoman rule (which had become increasingly unpopular in the years preceding the
                  war) will be finally over, they realized at the same time that efforts toward Arab
                  independence were being undermined in favor of a system of control that will be
                  sanctioned by the League of Nations, will divide the Levant into five entities
                  under British or French mandate, and will put, in particular, Palestine under a
                  British mandate with the implementation of the Balfour declaration as an integral
                  part of the latter.
                </p>
                <p>
                  Jewish immigration, though uneven, significantly increased Palestine&apos;s Jewish
                  population, and Zionist institutions grew stronger and increasingly entrenched
                  within the Mandate&apos;s governing structures. As Palestinian political leaders
                  sought to engage the British administration, popular forms of resistance
                  periodically erupted into violent clashes, the most significant being the al-Buraq
                  Uprising of 1929 and widespread anti-British demonstrations in 1933. By the end of
                  1935, Palestine stood poised on the brink of full-blown revolt.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-xl border border-gray-700/50 bg-[#1a1a1a]/60 p-6 sm:p-8">
              <OpenCallForm />
            </div>

            {/* Support this trace */}
            <div
              className="flex items-center gap-4 rounded-xl border border-gray-700/50 px-5 py-4"
              style={{ backgroundColor: "rgba(26,26,26,0.6)" }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center"
                style={{
                  clipPath: "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)",
                  backgroundColor: "#2a2a2a",
                }}
              >
                <span className="text-gray-400" style={{ transform: "scale(0.6)" }}>
                  <ContributeIcon />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-white">Support this trace</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-gray-400">
                  Lorem ipsum dolor sit amet adipiscing elit suscipit aliquam et porttitor purus.
                </p>
              </div>
              <a
                href="/contribute"
                className="shrink-0 rounded-lg px-5 py-2 text-sm font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: theme.accentGold, color: "#1a1a1a" }}
              >
                Support this
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
