"use client";

import { useState } from "react";
import HexBackground from "@/components/ui/HexBackground";
import { ContributionHexCard } from "@/components/contribute/ContributionHexCard";
import { ContributionForm } from "@/components/contribute/ContributionForm";
import {
  ContributeIcon,
  PersonalStoryIcon,
  PenLineIcon,
  PersonIcon,
  GiftIcon,
  GridIcon,
  SunIcon,
  CompassIcon,
} from "@/components/ui/icons";
import { theme } from "@/lib/theme";

const CONTRIBUTION_TYPES = [
  { id: "personal-story", label: "Personal Story", icon: PersonalStoryIcon },
  { id: "testimony", label: "Testimony", icon: PenLineIcon },
  { id: "biography", label: "Biography", icon: PersonIcon },
  { id: "artwork", label: "Artwork", icon: GiftIcon },
  { id: "music", label: "Music", icon: SunIcon },
  { id: "literature", label: "Literature", icon: PenLineIcon },
  { id: "photography", label: "Photography", icon: GridIcon },
  { id: "history-document", label: "History document", icon: PenLineIcon },
  { id: "other", label: "Other", icon: CompassIcon },
] as const;

export default function ContributePage() {
  const [selectedId, setSelectedId] = useState<string | null>("personal-story");

  return (
    <div className="relative min-h-screen w-full" style={{ backgroundColor: theme.bgDark }}>
      {/* Upper hero: hex background */}
      <section className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: theme.bgDark,
          }}
        />
        <div className="absolute inset-0 h-[420px] w-full">
          <HexBackground />
        </div>

        {/* Hero content: icon, title, description */}
        <div className="relative z-10 flex flex-col items-center px-6 pt-16 pb-14 sm:pt-20 sm:pb-16">
          <span className="text-gray-400">
            <ContributeIcon />
          </span>
          <h1 className="mt-6 text-center text-3xl font-bold text-white select-none sm:text-4xl">
            Contribute to Trace of the Tides
          </h1>
          <p className="mt-6 text-center text-lg font-medium select-none text-gray-400">
            What would you like to contribute?
          </p>
        </div>
      </section>

      {/* What would you like to contribute? + hex cards (3x3 grid) */}
      <section className="relative mx-auto max-w-4xl px-6 pb-16 sm:px-8">
        <div
          className="mt-8 grid justify-center gap-y-3 gap-x-8"
          style={{ gridTemplateColumns: "repeat(3, 120px)" }}
        >
          {CONTRIBUTION_TYPES.map(({ id, label, icon: Icon }) => (
            <ContributionHexCard
              key={id}
              icon={<Icon />}
              label={label}
              selected={selectedId === id}
              onClick={() => setSelectedId(id)}
            />
          ))}
        </div>

        {/* Contribution form */}
        <section className="  pt-12 pb-20">
          <ContributionForm />
        </section>
      </section>
    </div>
  );
}
