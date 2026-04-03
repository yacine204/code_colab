import { createContext, useContext, useState } from "react";

type Theme = "dark" | "light"

const ThemeContext = createContext<{
    theme: Theme
    toggleTheme: ()=> void
}>({
    theme: "dark",
    toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark")

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === "dark" ? "dark" : ""}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)