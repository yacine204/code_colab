import { useState } from "react"


const COMPILERS: Record<string, string> = {
  python:     "python-3.14",
  javascript: "nodejs-22",
  typescript: "typescript-deno",
  cpp:        "g++-15",
  java:       "java-21",
  rust:       "rust-1.93",
  go:         "go-1.26",
  c:          "gcc-15",
}

interface UseExecuteCodeProps {
  code: string
  language: string
  input?: string   
}

export function useExecuteCode({ code, language, input = "" }: UseExecuteCodeProps) {
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)

  const runCode = async () => {
    const compiler = COMPILERS[language]

    console.log("compiler:", compiler)
    console.log("code:", code)
    if (!compiler) {
      setOutput(`Language "${language}" is not supported`)
      return
    }

    setLoading(true)
    setOutput("")

    try {
      const res = await fetch("/compiler/api/run-code-sync/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": import.meta.env.VITE_ONLINECOMPILER_KEY,
        },
        body: JSON.stringify({
          compiler,
          code,
          input,
        }),
      })

      const data = await res.json()
      console.log("full response:", data) 
      if (data.error) {
        setOutput(data.error)
      } else {
        setOutput(data.output || "No output")
      }
    } catch (e) {
      setOutput("Network error — could not reach the compiler")
    } finally {
      setLoading(false)
    }
  }

  return { runCode, output, loading }
}