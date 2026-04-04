import { useState } from "react"
import api from "../api/axios"
import { userApi } from "../api/user"

export function EditableField({ label, value, field }: { label: string, value: string, field: string }) {
    const [editing, setEditing] = useState(false)
    const [val, setVal] = useState(value)
    const [temp, setTemp] = useState(value)

    const save = async () => {
    if (!temp.trim()) {
        cancel()
        return
    }
    await api.patch(userApi.me, { [field]: temp })
    setVal(temp)
    setEditing(false)
    }

    const cancel = () => {
        setTemp(val)
        setEditing(false)
    }

    return (
        <div
            className="relative group bg-[#111] border border-[#1f1f1f] hover:border-green-500/20 rounded-lg px-3 py-2 transition-colors cursor-pointer"
            onClick={() => !editing && setEditing(true)}
        >
            <p className="text-[10px] uppercase tracking-widest text-zinc-600">{label}</p>
            {editing ? (
                <>
                    <input
                        autoFocus
                        value={temp}
                        onChange={e => setTemp(e.target.value)}
                        onClick={e => e.stopPropagation()}
                        onKeyDown={e => {
                            if (e.key === "Escape") cancel()
                            if (e.key === "Enter") save()
                        }}
                        className="bg-transparent outline-none text-sm text-green-400 font-medium w-full caret-green-500"
                    />
                    <div className="flex gap-2 mt-2" onClick={e => e.stopPropagation()}>
                        <button onClick={save} className="text-[11px] bg-green-500 text-black font-semibold px-2.5 py-0.5 rounded">Save</button>
                        <button onClick={cancel} className="text-[11px] text-zinc-500 border border-zinc-700 px-2.5 py-0.5 rounded">Cancel</button>
                    </div>
                </>
            ) : (
                <>
                    <p className="text-sm text-zinc-300 font-medium">{val}</p>
                    <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-green-500" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                </>
            )}
        </div>
    )
}

