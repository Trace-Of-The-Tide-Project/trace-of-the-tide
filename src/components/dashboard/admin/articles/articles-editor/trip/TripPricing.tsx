"use client";

const inputClass =
  "w-full rounded-lg border border-[#444444] bg-[#333333] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-gray-500";

const selectClass =
  "w-full rounded-lg border border-[#444444] bg-[#333333] px-3 py-2 text-sm text-gray-400 outline-none focus:border-gray-500";

const CURRENCIES = ["USD", "EUR", "GBP", "ILS", "JOD", "EGP", "AED", "SAR"] as const;

type TripPricingProps = {
  price: string;
  onPriceChange: (v: string) => void;
  currency: string;
  onCurrencyChange: (v: string) => void;
};

export function TripPricing({
  price,
  onPriceChange,
  currency,
  onCurrencyChange,
}: TripPricingProps) {
  return (
    <section className="rounded-lg border border-[#333333] p-4 space-y-4">
      <h3 className="text-sm font-bold text-white">Pricing</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-400">
            Price
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
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
