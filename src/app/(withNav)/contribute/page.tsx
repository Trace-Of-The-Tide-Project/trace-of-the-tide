"use client";

import { useState } from "react";
import HexBackground from "@/components/ui/HexBackground";
import { ContributionHexCard } from "@/components/contribute/ContributionHexCard";
import { ContributionForm } from "@/components/contribute/ContributionForm";
import {
  ContributeIcon,
  PersonalStoryIcon,
  PenLineIcon,
  PaletteIcon,
  MusicIcon,
  BookIcon,
  CameraIcon,
  FileTextIcon,
  IdCardIcon,
  GlobeIcon,
} from "@/components/ui/icons";
import { theme } from "@/lib/theme";

const CONTRIBUTION_TYPES = [
  { id: "personal-story", label: "Personal Story", icon: PersonalStoryIcon },
  { id: "testimony", label: "Testimony", icon: PenLineIcon },
  { id: "biography", label: "Biography", icon: IdCardIcon },
  { id: "artwork", label: "Artwork", icon: PaletteIcon },
  { id: "music", label: "Music", icon: MusicIcon },
  { id: "literature", label: "Literature", icon: BookIcon },
  { id: "photography", label: "Photography", icon: CameraIcon },
  { id: "history-document", label: "History document", icon: FileTextIcon },
  { id: "other", label: "Other", icon: GlobeIcon },
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

      {/* What would you like to contribute? + hex cards (honeycomb layout) */}
      <section>
        <div className="flex flex-col items-center gap-0">
          {/* Row 1: 3 cards */}
          <div className="flex justify-center gap-0">
            {CONTRIBUTION_TYPES.slice(0, 3).map(({ id, label, icon: Icon }) => (
              <ContributionHexCard
                key={id}
                icon={<Icon />}
                label={label}
                selected={selectedId === id}
                onClick={() => setSelectedId(id)}
              />
            ))}
          </div>
          {/* Row 2: 2 cards (offset for honeycomb) */}
          <div
            className="flex justify-center gap-0"
            style={{ marginLeft: "35px"}}
          >
            {CONTRIBUTION_TYPES.slice(3, 5).map(({ id, label, icon: Icon }) => (
              <ContributionHexCard
                key={id}
                icon={<Icon />}
                label={label}
                selected={selectedId === id}
                onClick={() => setSelectedId(id)}
              />
            ))}
          </div>
          {/* Row 3: 3 cards */}
          <div className="flex justify-center gap-0" >
            {CONTRIBUTION_TYPES.slice(5, 8).map(({ id, label, icon: Icon }) => (
              <ContributionHexCard
                key={id}
                icon={<Icon />}
                label={label}
                selected={selectedId === id}
                onClick={() => setSelectedId(id)}
              />
            ))}
          </div>
          {/* Row 4: 1 card */}
          <div className="flex justify-center gap-0" style={{ marginLeft: "150px" }}>
            {CONTRIBUTION_TYPES.slice(8, 9).map(({ id, label, icon: Icon }) => (
              <ContributionHexCard
                key={id}
                icon={<Icon />}
                label={label}
                selected={selectedId === id}
                onClick={() => setSelectedId(id)}
              />
            ))}
          </div>
        </div>

        {/* Contribution form */}
        <section className="  pt-12 pb-20">
          <ContributionForm />
        </section>
      </section>
    </div>
  );
}
