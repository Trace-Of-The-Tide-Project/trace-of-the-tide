"use client";

import type { ComponentType } from "react";
import {
  ContributeIcon,
  GiftIcon,
  HeartHandshakeIcon,
  SquareCheckIcon,
  StarIcon,
  SunIcon,
} from "@/components/ui/icons";
import type { BadgeIconId } from "@/lib/dashboard/system-settings-constants";

export const BADGE_ICON_OPTIONS: { id: BadgeIconId; Icon: ComponentType }[] = [
  { id: "gift", Icon: GiftIcon },
  { id: "star", Icon: StarIcon },
  { id: "handshake", Icon: HeartHandshakeIcon },
  { id: "check", Icon: SquareCheckIcon },
  { id: "sun", Icon: SunIcon },
  { id: "contribute", Icon: ContributeIcon },
];

export function BadgeIconRenderer({ iconId }: { iconId: BadgeIconId }) {
  const entry = BADGE_ICON_OPTIONS.find((o) => o.id === iconId);
  const Icon = entry?.Icon ?? StarIcon;
  return <Icon />;
}
