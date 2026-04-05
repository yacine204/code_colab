import { useEffect, useState } from "react"

export interface GithubFile {
  path: string
  type: string
  url: string
  sha: string
  size: number
  mode: string
}

const useGithubRepo = (github_url: string) => {
  const [branches, setBranches] = useState<string[]>([])
  const [tree, setTree] = useState<GithubFile[]>([])
  const [blobs, setBlobs] = useState<Record<string, string>>({})
  const [activeBranch, setActiveBranch] = useState<string | null>(null)
  const [activeFile, setActiveFile] = useState<GithubFile | null>(null)  // track active file
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const api_url: string = github_url.replace(
    "https://github.com/",
    "https://api.github.com/repos/"
  )

  // fetch branches on mount
  useEffect(() => {
    if (!github_url) return
    const fetchBranches = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${api_url}/branches`)
        if (!res.ok) throw new Error(`Failed to fetch branches: ${res.status}`)
        const data = await res.json()
        const branch_names: string[] = data.map((b: { name: string }) => b.name)
        setBranches(branch_names)
        setActiveBranch(branch_names[0])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchBranches()
  }, [github_url])

  // fetch tree when active branch changes
  useEffect(() => {
    if (!activeBranch) return
    const fetchTree = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${api_url}/git/trees/${activeBranch}?recursive=1`)
        if (!res.ok) throw new Error(`Failed to fetch tree: ${res.status}`)
        const data = await res.json()
        setTree(data.tree)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchTree()
  }, [activeBranch])

  // fetch blob only when file is clicked, cache it
  const fetchBlob = async (file: GithubFile): Promise<string> => {
    setActiveFile(file)  // track which file is open
    const key = `${activeBranch}/${file.path}`
    if (blobs[key]) return blobs[key]
    const res = await fetch(file.url)
    const data = await res.json()
    const content = atob(data.content.replace(/\n/g, ""))
    setBlobs(prev => ({ ...prev, [key]: content }))
    return content
  }

  // commit current file to backend
  const commitFile = async (content: string, message: string, workspaceName: string) => {
    if (!activeFile) throw new Error("No file selected")

    const token = localStorage.getItem("access")
    const res = await fetch("http://localhost:8000/github/commit/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        repo_url:       github_url,        
        file_path:      activeFile.path,   
        file_sha:       activeFile.sha,    
        content:        content,           // current content from Monaco
        message:        message,           // commit message
        branch:         workspaceName,     
      })
    })

    if (!res.ok) throw new Error("Commit failed")

    const key = `${activeBranch}/${activeFile.path}`
    setBlobs(prev => ({ ...prev, [key]: content }))

    return await res.json()
  }
  
  const getBlobKey = (file: GithubFile) => `${activeBranch}/${file.path}`

  return {
    branches,
    tree,
    blobs,
    activeBranch,
    activeFile,      
    setActiveBranch,
    fetchBlob,
    commitFile,       
    getBlobKey,
    loading,
    error,
  }
}

export default useGithubRepo