"use client";

export type FilterOption = {
  id: string;
  label: string;
};

type CreatePageFiltersProps = {
  options: FilterOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function CreatePageFilters({ options, selectedId, onSelect }: CreatePageFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {options.map((opt) => {
        const isSelected = opt.id === selectedId;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={`whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              isSelected
                ? "border-transparent text-[#1a1a1a]"
                : "border-[#444444] bg-[#333333] text-gray-300 hover:border-gray-500 hover:text-white"
            }`}
            style={isSelected ? { backgroundColor: "#C9A96E" } : undefined}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
