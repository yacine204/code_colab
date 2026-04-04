import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import { workspace_api } from "../api/workspace"
import Input from "../components/input_field"
import Button from "../components/button"

interface WorkspaceForm {
    name: string
    github_url: string
    description: string
}

function CreateWorkspace() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState<WorkspaceForm>({
        name: "",
        github_url: "",
        description: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        if (!form.name.trim()) return
        setLoading(true)
        try {
            const result = await api.post(workspace_api.workspace, form)
            navigate(`/workspace/${result.data.id}`)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
            <div className="w-full max-w-lg bg-[#111] border border-green-500/10 rounded-2xl p-8">

                <div className="text-[11px] tracking-widest text-green-500 uppercase font-medium mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
                    colab.code
                </div>

                <h1 className="text-lg font-semibold text-zinc-100 mb-1">Create workspace</h1>
                <p className="text-sm text-zinc-500 mb-7">Set up a new collaborative environment</p>

                <div className="flex flex-col gap-4">
                    <div>
                        <Input
                            label="Name"
                            name="name"
                            placeholder="my-workspace"
                            value={form.name}
                            onChange={handleChange}
                        />
                        <p className="text-[11px] text-zinc-700 mt-1">Lowercase, hyphens allowed</p>
                    </div>

                    <Input
                        label="Github URL (optional)"
                        name="github_url"
                        placeholder="https://github.com/org/repo"
                        value={form.github_url}
                        onChange={handleChange}
                    />

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-600">
                            Description <span className="text-zinc-700">(optional)</span>
                        </label>
                        <textarea
                            name="description"
                            placeholder="What is this workspace for?"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            className="bg-[#0a0a0a] border border-[#1f1f1f] focus:border-green-500/40 rounded-lg px-3 py-2 text-sm text-zinc-300 placeholder-zinc-700 outline-none resize-none transition-colors"
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-7">
                    <Button context="Cancel" trigger={() => navigate(-1)} />
                    <Button context="Create workspace" variant="run" loading={loading} trigger={handleSubmit} />
                </div>

            </div>
        </div>
    )
}

export default CreateWorkspace