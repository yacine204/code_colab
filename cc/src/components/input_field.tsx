import { useTheme } from "../context/context"

interface InputProps {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: "text" | "email" | "password"
  disabled?: boolean
  error?: string
  label?: string
  name?:string
}

function Input({ placeholder, value, onChange, type = "text", disabled = false, error, label, name }: InputProps) {
  const { theme } = useTheme()

  const base = "w-full px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 outline-none disabled:opacity-40 disabled:cursor-not-allowed"

  const styles = theme === "dark"
    ? "bg-[#0a0a0a] border border-zinc-800 text-zinc-300 placeholder-zinc-600 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/10"
    : "bg-white border border-zinc-300 text-zinc-800 placeholder-zinc-400 focus:border-green-600 focus:ring-1 focus:ring-green-600/20"

  const errorStyle = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
    : ""

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className={`text-xs font-medium tracking-wide uppercase ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        name={name}
        className={`${base} ${styles} ${errorStyle}`}
      />
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  )
}

export default Input