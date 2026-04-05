import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import { workspace_api } from "../api/workspace"
import type { Workspace } from "../interfaces/Workspace"
import { useParams } from "react-router-dom"

interface WorkspaceContextType {
  workspace: Workspace | null
  loading: boolean
  error: string | null
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null)

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
    const { workspaceId } = useParams(); 
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("running")
    const token = localStorage.getItem('access')
    console.log("token: ",token)
    if(!token) return
    const fetchWorkspace = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${workspace_api.workspace}${workspaceId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          throw new Error(`Failed to load active workspace (${res.status})`)
        }

        const data: Workspace = await res.json()
        console.log("data: ",data)
        setWorkspace(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchWorkspace()
  }, [workspaceId])

  return (
    <WorkspaceContext.Provider value={{ workspace, loading, error }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext)
  if (!context) throw new Error("useWorkspace must be used inside <WorkspaceProvider>")
  return context
}