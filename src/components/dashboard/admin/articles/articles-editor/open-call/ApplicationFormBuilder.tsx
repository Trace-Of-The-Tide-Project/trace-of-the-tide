"use client";

import { useCallback } from "react";
import type { ApplicationFormField } from "@/services/open-calls.service";
import { DEFAULT_OPEN_CALL_APPLICATION_FIELDS } from "@/services/open-calls.service";
import { ApplicationFormPreview } from "./ApplicationFormPreview";

const inputClass =
  "w-full rounded-lg border border-[#444444] bg-[#333333] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-gray-500";

type Props = {
  fields: ApplicationFormField[];
  onChange: (fields: ApplicationFormField[]) => void;
};

function newFieldForType(type: ApplicationFormField["type"]): ApplicationFormField {
  const base = { name: `field_${Date.now()}`, required: false } as const;
  switch (type) {
    case "text":
      return { ...base, type: "text", required: true };
    case "email":
      return { ...base, type: "email", required: true };
    case "phone":
      return { ...base, type: "phone", required: true };
    case "textarea":
      return { ...base, type: "textarea", required: true };
    case "checkbox":
      return { ...base, type: "checkbox", required: true };
    case "select":
      return { ...base, type: "select", required: true, options: ["Option A", "Option B"] };
    case "file_multiple":
      return {
        ...base,
        type: "file_multiple",
        required: false,
        max_files: 5,
        allowed_types: ["jpg", "png", "pdf"],
        max_size_mb: 20,
      };
    default:
      return { ...base, type: "text", required: true };
  }
}

export function ApplicationFormBuilder({ fields, onChange }: Props) {
  const move = useCallback(
    (index: number, dir: -1 | 1) => {
      const j = index + dir;
      if (j < 0 || j >= fields.length) return;
      const next = [...fields];
      [next[index], next[j]] = [next[j]!, next[index]!];
      onChange(next);
    },
    [fields, onChange],
  );

  const remove = useCallback(
    (index: number) => {
      onChange(fields.filter((_, i) => i !== index));
    },
    [fields, onChange],
  );

  const replace = useCallback(
    (index: number, field: ApplicationFormField) => {
      const next = [...fields];
      next[index] = field;
      onChange(next);
    },
    [fields, onChange],
  );

  const addField = useCallback(
    (type: ApplicationFormField["type"]) => {
      onChange([...fields, newFieldForType(type)]);
    },
    [fields, onChange],
  );

  const resetDefaults = useCallback(() => {
    onChange(DEFAULT_OPEN_CALL_APPLICATION_FIELDS.map((f) => JSON.parse(JSON.stringify(f))));
  }, [onChange]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-bold text-white">Edit form fields</h3>
        <button
          type="button"
          onClick={resetDefaults}
          className="text-xs font-medium text-[#C9A96E] underline hover:text-[#DBC99E]"
        >
          Reset to default template
        </button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
        <div className="min-w-0 flex-1 space-y-3">
          {fields.map((field, index) => (
            <FieldRow
              key={`${index}-${field.name}`}
              field={field}
              index={index}
              total={fields.length}
              onMove={move}
              onRemove={remove}
              onReplace={replace}
            />
          ))}

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-gray-500">Add field:</span>
            {(
              ["text", "email", "phone", "textarea", "select", "checkbox", "file_multiple"] as const
            ).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => addField(t)}
                className="rounded border border-[#444] bg-[#333] px-2 py-1 text-xs text-gray-300 hover:border-gray-500"
              >
                + {t}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full shrink-0 lg:w-[320px]">
          <ApplicationFormPreview fields={fields} />
        </div>
      </div>
    </div>
  );
}

function FieldRow({
  field,
  index,
  total,
  onMove,
  onRemove,
  onReplace,
}: {
  field: ApplicationFormField;
  index: number;
  total: number;
  onMove: (i: number, d: -1 | 1) => void;
  onRemove: (i: number) => void;
  onReplace: (i: number, f: ApplicationFormField) => void;
}) {
  const setName = (name: string) => {
    onReplace(index, { ...field, name } as ApplicationFormField);
  };
  const setRequired = (required: boolean) => {
    onReplace(index, { ...field, required } as ApplicationFormField);
  };

  return (
    <div className="rounded-lg border border-[#444] bg-[#141414] p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={index <= 0}
          onClick={() => onMove(index, -1)}
          className="rounded bg-[#333] px-2 py-1 text-xs text-white disabled:opacity-30"
        >
          Up
        </button>
        <button
          type="button"
          disabled={index >= total - 1}
          onClick={() => onMove(index, 1)}
          className="rounded bg-[#333] px-2 py-1 text-xs text-white disabled:opacity-30"
        >
          Down
        </button>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="ml-auto rounded bg-red-900/40 px-2 py-1 text-xs text-red-200 hover:bg-red-900/60"
        >
          Remove
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-gray-500">Field name (API key)</label>
          <input className={inputClass} value={field.name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">Type</label>
          <select
            className={inputClass}
            value={field.type}
            onChange={(e) => {
              const t = e.target.value as ApplicationFormField["type"];
              const nf = newFieldForType(t);
              onReplace(index, { ...nf, name: field.name, required: field.required });
            }}
          >
            <option value="text">text</option>
            <option value="email">email</option>
            <option value="phone">phone</option>
            <option value="textarea">textarea</option>
            <option value="select">select</option>
            <option value="checkbox">checkbox</option>
            <option value="file_multiple">file_multiple</option>
          </select>
        </div>
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm text-gray-300">
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) => setRequired(e.target.checked)}
          className="rounded border-gray-600"
        />
        Required
      </label>

      {field.type === "select" ? (
        <div className="mt-3">
          <label className="mb-1 block text-xs text-gray-500">Options (one per line)</label>
          <textarea
            className={`${inputClass} min-h-[80px] font-mono text-xs`}
            value={field.options.join("\n")}
            onChange={(e) => {
              const options = e.target.value
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean);
              onReplace(index, { ...field, type: "select", options });
            }}
          />
        </div>
      ) : null}

      {field.type === "file_multiple" ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-gray-500">Max files</label>
            <input
              type="number"
              min={1}
              className={inputClass}
              value={field.max_files}
              onChange={(e) =>
                onReplace(index, {
                  ...field,
                  type: "file_multiple",
                  max_files: Math.max(1, parseInt(e.target.value, 10) || 1),
                })
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Max size (MB)</label>
            <input
              type="number"
              min={1}
              className={inputClass}
              value={field.max_size_mb}
              onChange={(e) =>
                onReplace(index, {
                  ...field,
                  type: "file_multiple",
                  max_size_mb: Math.max(1, parseInt(e.target.value, 10) || 1),
                })
              }
            />
          </div>
          <div className="sm:col-span-3">
            <label className="mb-1 block text-xs text-gray-500">Allowed types (comma-separated)</label>
            <input
              className={inputClass}
              value={field.allowed_types.join(", ")}
              onChange={(e) => {
                const allowed_types = e.target.value
                  .split(",")
                  .map((s) => s.trim().toLowerCase())
                  .filter(Boolean);
                onReplace(index, { ...field, type: "file_multiple", allowed_types });
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
