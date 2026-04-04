import { useTheme } from "../context/context"

interface ButtonProps {
  context: string
  trigger?: () => void
  variant?: "run" | "default"
  loading?: boolean
  className?:string
}

function Button({ context, trigger, variant = "default", loading = false, className="" }: ButtonProps) {
  const { theme } = useTheme()

  const base = "px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"

  const styles = {
    run: "bg-green-600 hover:bg-green-500 text-white",
    default: theme === "dark"
      ? "bg-zinc-700/60 hover:bg-zinc-600/60 text-zinc-300"
      : "bg-zinc-200 hover:bg-zinc-300 text-zinc-800",
  }

  return (
    <button
      onClick={trigger}
      disabled={loading}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {loading ? "Running..." : context}
    </button>
  )
}

export default Button