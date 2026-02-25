"use client";

import { theme } from "@/lib/theme";

type TripBookingFormProps = {
  price: string;
};

const inputClass =
  "w-full rounded-lg border border-gray-700 bg-[#1a1a1a] px-4 py-3 text-sm text-white placeholder-gray-500 transition-colors hover:border-gray-500 focus:border-[#C9A96E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E] focus:ring-offset-0";

export function TripBookingForm({ price }: TripBookingFormProps) {
  return (
    <div className="rounded-xl border border-gray-700/50 bg-[#111111] p-6">
      <h3 className="text-lg font-semibold text-white">Join this adventure</h3>
      <p className="mt-1 text-xs text-gray-400">
        Secure your spot on this amazing journey!
      </p>

      <form className="mt-5 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Fatima El-Khoury"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            placeholder="e.g., fatima@email.com"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">
            Additional message{" "}
            <span className="font-normal text-gray-500">(Optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Any special requests or questions?"
            className={inputClass}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-gray-700/50 bg-[#0d0d0d] px-4 py-3">
          <span className="text-sm text-gray-400">Trip price:</span>
          <span className="text-lg font-bold text-white">{price}</span>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg py-3.5 text-base font-semibold transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black"
          style={{ backgroundColor: theme.accentGold, color: "#1a1a1a" }}
        >
          Book Now
        </button>

        <p className="text-center text-xs text-gray-500">
          By booking, you agree to our terms and conditions. You&apos;ll receive
          a confirmation email shortly.
        </p>
      </form>
    </div>
  );
}
