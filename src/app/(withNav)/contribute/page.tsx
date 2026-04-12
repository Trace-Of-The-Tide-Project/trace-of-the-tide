"use client";

import { useEffect, useMemo, useState } from "react";
import HexBackground from "@/components/ui/HexBackground";
import { ContributionHexCard } from "@/components/contribute/ContributionHexCard";
import { ContributionForm } from "@/components/contribute/ContributionForm";
import { ContributeIcon } from "@/components/ui/icons";
import { theme } from "@/lib/theme";
import {
  CONTRIBUTION_TYPE_ORDER,
  getContributionTypeIcon,
} from "@/lib/contributions/contribution-type-icons";
import {
  fetchContributionTypes,
  type ContributionType,
} from "@/services/contributions.service";

export default function ContributePage() {
  const [types, setTypes] = useState<ContributionType[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [typesError, setTypesError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoadingTypes(true);
      setTypesError(null);
      try {
        const list = await fetchContributionTypes();
        if (cancelled) return;
        setTypes(list);
        const preferred =
          list.find((t) => t.name === "Personal Story")?.id ?? list[0]?.id ?? null;
        setSelectedTypeId(preferred);
      } catch (err) {
        if (cancelled) return;
        setTypesError(err instanceof Error ? err.message : "Failed to load contribution types");
        setTypes([]);
        setSelectedTypeId(null);
      } finally {
        if (!cancelled) setIsLoadingTypes(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const orderedTypes = useMemo(() => {
    if (!types.length) return [];
    const index = new Map<string, number>();
    CONTRIBUTION_TYPE_ORDER.forEach((n, i) => index.set(n, i));
    return [...types].sort((a, b) => {
      const ai = index.get(a.name) ?? 999;
      const bi = index.get(b.name) ?? 999;
      if (ai !== bi) return ai - bi;
      return a.name.localeCompare(b.name);
    });
  }, [types]);

  return (
    <div className="relative min-h-screen w-full" style={{ backgroundColor: theme.pageBackground }}>
      {/* Upper hero: hex background */}
      <section className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: theme.pageBackground,
          }}
        />
        <div className="absolute inset-0 h-[200px] w-full">
          <HexBackground />
        </div>

        {/* Hero content: icon, title, description */}
        <div className="relative z-10 flex flex-col items-center px-6 pt-16 pb-14 sm:pt-20 sm:pb-16">
          <span className="text-gray-400">
            <ContributeIcon />
          </span>
          <h1 className="mt-6 text-center text-3xl font-bold text-foreground select-none sm:text-4xl">
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
          {typesError && (
            <div className="mb-6 w-full max-w-3xl rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-200">
              {typesError}
            </div>
          )}

          {/* Row 1: 3 cards */}
          <div className="flex justify-center gap-0">
            {(isLoadingTypes ? [] : orderedTypes).slice(0, 3).map((t) => {
              const Icon = getContributionTypeIcon(t.name);
              return (
                <ContributionHexCard
                  key={t.id}
                  icon={<Icon />}
                  label={t.name}
                  selected={selectedTypeId === t.id}
                  onClick={() => setSelectedTypeId(t.id)}
                />
              );
            })}
          </div>
          {/* Row 2: 2 cards (offset for honeycomb) */}
          <div
            className="flex justify-center gap-0"
            style={{ marginLeft: "35px"}}
          >
            {(isLoadingTypes ? [] : orderedTypes).slice(3, 5).map((t) => {
              const Icon = getContributionTypeIcon(t.name);
              return (
                <ContributionHexCard
                  key={t.id}
                  icon={<Icon />}
                  label={t.name}
                  selected={selectedTypeId === t.id}
                  onClick={() => setSelectedTypeId(t.id)}
                />
              );
            })}
          </div>
          {/* Row 3: 3 cards */}
          <div className="flex justify-center gap-0" >
            {(isLoadingTypes ? [] : orderedTypes).slice(5, 8).map((t) => {
              const Icon = getContributionTypeIcon(t.name);
              return (
                <ContributionHexCard
                  key={t.id}
                  icon={<Icon />}
                  label={t.name}
                  selected={selectedTypeId === t.id}
                  onClick={() => setSelectedTypeId(t.id)}
                />
              );
            })}
          </div>
          {/* Row 4: 1 card */}
          <div className="flex justify-center gap-0" style={{ marginLeft: "150px" }}>
            {(isLoadingTypes ? [] : orderedTypes).slice(8, 9).map((t) => {
              const Icon = getContributionTypeIcon(t.name);
              return (
                <ContributionHexCard
                  key={t.id}
                  icon={<Icon />}
                  label={t.name}
                  selected={selectedTypeId === t.id}
                  onClick={() => setSelectedTypeId(t.id)}
                />
              );
            })}
          </div>
        </div>

        {/* Contribution form */}
        <section className="  pt-12 pb-20">
          <ContributionForm selectedTypeId={selectedTypeId} />
        </section>
      </section>
    </div>
  );
}
