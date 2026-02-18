import Link from "next/link";
import Image from "next/image";
import {
  FacebookIcon,
  TwitterXIcon,
  YoutubeIcon,
  InstagramIcon,
  EmailIcon,
  MapPinIcon,
} from "@/components/ui/icons";
import { theme } from "@/lib/theme";

const socialLinks = [
  { href: "https://facebook.com", icon: FacebookIcon, label: "Facebook" },
  { href: "https://x.com", icon: TwitterXIcon, label: "X (Twitter)" },
  { href: "https://youtube.com", icon: YoutubeIcon, label: "YouTube" },
  { href: "https://instagram.com", icon: InstagramIcon, label: "Instagram" },
];

const palestineLinks = [
  { href: "#", emoji: "🪨", title: "Stone", description: "Witness of life" },
  { href: "#", emoji: "🧂", title: "Salt", description: "Trace of time" },
  { href: "#", emoji: "🗺️", title: "Compass", description: "Trace of place" },
];

const fieldsLinks = [
  { href: "#", emoji: "⚓", title: "Harbour trails", description: "Mujaawarah with Culture" },
  { href: "#", emoji: "🌿", title: "Courtyard trails", description: "Mujaawarah with Knowledge" },
  { href: "#", emoji: "🌕", title: "Hill trails", description: "Mujaawarah with Arts" },
];

export function Footer() {
  return (
    <footer className="w-full" style={{ backgroundColor: theme.bgDark, color: "#e5e5e5" }}>
      {/* Top section - 4 columns */}
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand + social */}
          <div className="flex flex-col items-start gap-4">
            <Image
              src="/images/footer-Logo.png"
              alt="Trace of The Tide"
              width={100}
              height={24}
              className="h-6 w-auto object-contain"
            />
            <p className="max-w-xs text-sm text-gray-400">
              <span className="font-bold text-white">Trace of the tide</span> Preserving our
              collective memory through stories, testimonies, and cultural artifacts.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:text-white"
                  style={{ backgroundColor: theme.cardBorder }}
                  aria-label={label}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Palestine */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-400">
              Palestine (Architecture of stories)
            </h3>
            <ul className="space-y-3">
              {palestineLinks.map(({ href, emoji, title, description }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="flex items-center gap-2 text-sm transition-colors hover:opacity-90"
                  >
                    <span className="shrink-0 text-lg leading-none">{emoji}</span>
                    <span>
                      <span className="font-semibold text-white">{title}</span>{" "}
                      <span className="text-gray-400">{description}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Fields */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-400">Fields (Mosaic of Bali trails)</h3>
            <ul className="space-y-3">
              {fieldsLinks.map(({ href, emoji, title, description }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="flex items-start gap-2 text-sm transition-colors hover:opacity-90"
                  >
                    <span className="shrink-0 text-lg leading-none">{emoji}</span>
                    <span>
                      <span className="font-semibold text-white">{title}</span>{" "}
                      <span className="text-gray-400">{description}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-400">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:director@traceofthetides.org"
                  className="flex items-center gap-2 text-sm transition-colors hover:text-white"
                >
                  <span className="shrink-0 ">
                    <EmailIcon />
                  </span>
                  <span>director@traceofthetides.org</span>
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-sm">
                  <span className="shrink-0">
                    <MapPinIcon />
                  </span>
                  <span>Everywhere</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom section - copyright + legal */}
      <div className="border-t py-6" style={{ borderColor: theme.cardBorder }}>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row sm:px-8 lg:px-10">
          <p className="text-center text-sm text-gray-500 sm:text-left">
            © 2025 Trace of the Tides. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-400">
            <Link href="/privacy" className="transition-colors hover:text-gray-400">
              Privacy Policy
            </Link>
            <span style={{ color: "text-gray-400" }}>·</span>
            <Link href="/terms" className="transition-colors hover:text-gray-400">
              Terms of Service
            </Link>
            <span style={{ color: "text-gray-400" }}>·</span>
            <Link href="/gdpr" className="transition-colors hover:text-gray-400">
              GDPR
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
