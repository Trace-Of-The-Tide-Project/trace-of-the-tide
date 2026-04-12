"use client";

const inputClass =
  "w-full rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-input-bg)] px-3 py-2 text-sm text-foreground placeholder-gray-500 outline-none focus:border-gray-500";

const selectClass =
  "w-full rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-input-bg)] px-3 py-2 text-sm text-foreground outline-none focus:border-gray-500";

const CURRENCIES = ["USD", "EUR", "GBP", "ILS", "JOD", "EGP", "AED", "SAR"] as const;

type TripPricingProps = {
  minPrice: string;
  onMinPriceChange: (v: string) => void;
  currency: string;
  onCurrencyChange: (v: string) => void;
};

export function TripPricing({
  minPrice,
  onMinPriceChange,
  currency,
  onCurrencyChange,
}: TripPricingProps) {
  return (
    <section className="rounded-lg border border-[var(--tott-card-border)] p-4 space-y-4">
      <h3 className="text-sm font-bold text-foreground">Pricing</h3>
      <p className="text-xs text-gray-500">
        Minimum contribution only. On the public trip page, travelers use a scale starting at this amount; they can
        slide higher (no fixed cap in the editor).
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-400">
            Minimum price
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            placeholder="0.00"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-400">
            Currency
          </label>
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className={selectClass}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
