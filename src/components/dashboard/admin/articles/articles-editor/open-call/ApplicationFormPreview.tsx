"use client";

import type { ApplicationFormField } from "@/services/open-calls.service";
import { CONTRIBUTION_FORM_INPUT_BASE as inputBase } from "@/lib/constants";

function labelForName(name: string): string {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ApplicationFormPreview({ fields }: { fields: ApplicationFormField[] }) {
  return (
    <div className="rounded-xl border border-[#444444] bg-[#0a0a0a] p-5">
      <h4 className="mb-4 text-sm font-semibold text-white">Preview</h4>
      <div className="pointer-events-none flex flex-col gap-4 opacity-90">
        {fields.map((f, i) => (
          <PreviewField key={`preview-${i}-${f.name}`} field={f} />
        ))}
        <div className="pt-2 text-center">
          <span
            className="inline-block rounded-lg px-8 py-2.5 text-sm font-medium text-black"
            style={{ backgroundColor: "#C9A96E" }}
          >
            Submit application
          </span>
        </div>
      </div>
    </div>
  );
}

function PreviewField({ field: f }: { field: ApplicationFormField }) {
  const label = labelForName(f.name);
  const req = f.required ? " *" : "";

  if (f.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm text-gray-300">
        <span className="h-4 w-4 shrink-0 rounded border border-gray-500 bg-[#333]" />
        {label}
        {req}
      </label>
    );
  }

  if (f.type === "textarea") {
    return (
      <div>
        <p className="mb-1 text-xs text-gray-500">
          {label}
          {req}
        </p>
        <div className={`${inputBase} min-h-[100px] rounded-lg border border-[#444] bg-[#232323]`} />
      </div>
    );
  }

  if (f.type === "select") {
    return (
      <div>
        <p className="mb-1 text-xs text-gray-500">
          {label}
          {req}
        </p>
        <div className={`${inputBase} flex items-center rounded-lg border border-[#444] bg-[#232323] text-sm text-gray-500`}>
          {f.options[0] ?? "—"}
        </div>
      </div>
    );
  }

  if (f.type === "file_multiple") {
    return (
      <div>
        <p className="mb-1 text-xs text-gray-500">
          {label}
          {req}
        </p>
        <div className="rounded-lg border border-dashed border-gray-600 bg-[#1a1a1a] px-4 py-8 text-center text-xs text-gray-500">
          Drag and drop files (max {f.max_files}, {f.allowed_types.join(", ")}, up to {f.max_size_mb} MB)
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-1 text-xs text-gray-500">
        {label}
        {req}
      </p>
      <div className={`${inputBase} h-10 rounded-lg border border-[#444] bg-[#232323]`} />
    </div>
  );
}
