import Image from "next/image";
import { theme } from "@/lib/theme";

type TripHeroProps = {
  image: string;
  title: string;
  price: string;
  difficulty: string;
  from: string;
  to: string;
};

export function TripHero({
  image,
  title,
  price,
  difficulty,
  from,
  to,
}: TripHeroProps) {
  return (
    <div className="relative h-[340px] w-full sm:h-[400px]">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 sm:px-10 sm:pb-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3">
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: theme.accentGold, color: "#1a1a1a" }}
            >
              {price}
            </span>
            <span className="rounded-full border border-gray-400 px-3 py-1 text-xs font-medium text-white">
              {difficulty}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            {title}
          </h1>

          <p className="mt-2 flex items-center gap-2 text-sm text-gray-300">
            <span>{from}</span>
            <span style={{ color: theme.accentGold }}>→</span>
            <span>{to}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
