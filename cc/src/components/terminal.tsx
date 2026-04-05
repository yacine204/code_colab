import Editor from "@monaco-editor/react"
import { useEffect, useState } from "react"
import { useExecuteCode } from "../hooks/executeCode"
import Button from "./button"
import { useTheme } from "../context/themeContext"

const LANGUAGES = [
  { label: "Python",     value: "python" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "C++",        value: "cpp" },
  { label: "Java",       value: "java" },
  { label: "Rust",       value: "rust" },
  { label: "Go",         value: "go" },
  { label: "C",          value: "c" },
]

interface TerminalPrompts {
  language?: string
  height?: string
  width?: string
  externalCode?: string
  externalLanguage?: string
  onCodeChange?: (value: string) => void
}

function Terminal({ language = "python", height, width, externalCode, externalLanguage, onCodeChange }: TerminalPrompts) {
  const { theme: currentTheme } = useTheme()
  const [selectedLang, setSelectedLang] = useState(language)
  const [code, setCode] = useState("")
  const { runCode, output, loading } = useExecuteCode({ code, language: selectedLang })

  const isDark = currentTheme === "dark"

  useEffect(() => {
    if (externalCode !== undefined) setCode(externalCode)
    if (externalLanguage !== undefined) setSelectedLang(externalLanguage)
  }, [externalCode, externalLanguage])

  return (
    <div className={`flex flex-col h-full rounded-xl overflow-hidden border ${
      isDark ? "bg-[#0f0f13] border-white/10 text-white"
             : "bg-white border-zinc-200 text-zinc-900"
    }`}>

      {/* Toolbar */}
      <div className={`flex items-center gap-3 px-4 py-2 border-b shrink-0 ${
        isDark ? "bg-[#16161d] border-white/10" : "bg-zinc-50 border-zinc-200"
      }`}>
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className={`text-xs font-mono px-2 py-1 rounded-md border outline-none cursor-pointer transition-colors ${
            isDark
              ? "bg-zinc-800 border-white/10 text-zinc-300 hover:border-white/20"
              : "bg-white border-zinc-300 text-zinc-700 hover:border-zinc-400"
          }`}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
        <div className="ml-auto">
          <Button context="Run" variant="run" trigger={runCode} loading={loading} />
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <Editor
          width={width ?? "100%"}
          height="100%"
          language={selectedLang}
          theme={isDark ? "vs-dark" : "light"}
          value={code}
          onChange={(value) => onCodeChange?.(value ?? "")}  
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 12 },
          }}
        />
      </div>

      {/* Output */}
      <div className={`border-t font-mono text-sm shrink-0 min-h-[120px] max-h-[200px] overflow-y-auto ${
        isDark ? "bg-[#0a0a0f] border-white/10" : "bg-zinc-900 border-zinc-200"
      }`}>
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/5 sticky top-0 bg-inherit">
          <span className="w-2 h-2 rounded-full bg-zinc-600" />
          <span className="w-2 h-2 rounded-full bg-zinc-600" />
          <span className="w-2 h-2 rounded-full bg-zinc-600" />
          <span className="ml-2 text-xs text-zinc-600">output</span>
        </div>
        <div className="px-4 py-3">
          {loading ? (
            <div className="flex gap-2 items-center">
              <span className="text-zinc-600 select-none">$</span>
              <span className="text-zinc-500">running</span>
              <span className="flex gap-0.5 ml-1">
                <span className="w-1 h-1 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1 h-1 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1 h-1 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          ) : output ? (
            output.split("\n").map((line, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-zinc-600 select-none">$</span>
                <span className="text-emerald-400 whitespace-pre-wrap">{line}</span>
              </div>
            ))
          ) : (
            <div className="flex gap-2 items-center">
              <span className="text-zinc-600 select-none">$</span>
              <span className="text-zinc-600">waiting for output</span>
              <span className="w-2 h-4 bg-zinc-600 animate-pulse ml-0.5" />
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default Terminal