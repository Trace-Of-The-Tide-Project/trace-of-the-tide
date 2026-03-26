'use client'

import { theme } from '@/lib/theme'

const inputBaseClass = `w-full pl-10 pr-4 py-3.5 rounded-lg bg-black border text-base text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[${theme.accentGoldFocus}]/50 focus:border-[${theme.accentGoldFocus}] caret-transparent`

type AuthInputProps = {
  id: string
  name: string
  type?: 'text' | 'email' | 'password' | 'tel'
  label: string
  placeholder: string
  required?: boolean
  minLength?: number
  autoComplete?: string
  icon: React.ReactNode
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  /** Right-side slot (e.g. show/hide password button). Use pr-12 on input when provided. */
  rightSlot?: React.ReactNode
  /** Optional content to show on the right of the label (e.g. "Forgot password?" link). */
  labelRight?: React.ReactNode
  inputClassName?: string
}

export function AuthInput({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  required,
  minLength,
  autoComplete,
  icon,
  value,
  onChange,
  rightSlot,
  labelRight,
  inputClassName,
}: AuthInputProps) {
  const hasRightSlot = Boolean(rightSlot)
  const prClass = hasRightSlot ? 'pr-12' : 'pr-4'
  const baseWithPr = inputBaseClass.replace('pr-4', prClass)

  return (
    <div>
      {(label || labelRight) ? (
        <div className="flex items-center justify-between mb-1.5">
          {label ? (
            <label htmlFor={id} className="block text-sm font-medium text-white cursor-default select-none">
              {label}
            </label>
          ) : null}
          {labelRight}
        </div>
      ) : null}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
          {icon}
        </span>
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className={inputClassName ?? baseWithPr}
          style={{ borderColor: theme.inputBorder }}
          suppressHydrationWarning
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  )
}
