import { useState } from "react";
import api from "../api/axios";
import { workspace_api } from "../api/workspace";
import type { Workspace } from "../interfaces/Workspace";

interface EditWorkspaceProps {
  workspace: Workspace;
  onClose: () => void;
  onSave: (updated: Workspace) => void;
}

function EditWorkspace({ workspace, onClose, onSave }: EditWorkspaceProps) {
  const [name, setName] = useState(workspace.name);
  const [githubUrl, setGithubUrl] = useState(workspace.github_url ?? "");
  const [description, setDescription] = useState(workspace.description ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await api.patch(`${workspace_api.workspace}${workspace.id}/`, {
        name,
        github_url: githubUrl,
        description,
      });
      onSave(res.data);
      onClose();
    } catch (err: any) {
      setError(err.message ?? "Failed to update workspace");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#111] border border-green-500/10 rounded-2xl p-6 w-full max-w-md flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-300">Edit Workspace</span>
          <button
            onClick={onClose}
            className="text-zinc-600 hover:text-zinc-400 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* fields */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#0d0d0d] border border-[#1f1f1f] focus:border-green-500/30 rounded-lg px-3 py-2 text-sm text-zinc-300 placeholder-zinc-700 outline-none transition-colors"
              placeholder="workspace name"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500">GitHub URL</label>
            <input
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="bg-[#0d0d0d] border border-[#1f1f1f] focus:border-green-500/30 rounded-lg px-3 py-2 text-sm text-zinc-300 placeholder-zinc-700 outline-none transition-colors font-mono"
              placeholder="https://github.com/user/repo"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-[#0d0d0d] border border-[#1f1f1f] focus:border-green-500/30 rounded-lg px-3 py-2 text-sm text-zinc-300 placeholder-zinc-700 outline-none transition-colors resize-none"
              placeholder="what's this workspace about?"
            />
          </div>
        </div>

        {error && <span className="text-xs text-red-400">{error}</span>}

        {/* actions */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="text-xs px-4 py-2 rounded-lg border border-white/10 text-zinc-500 hover:text-zinc-300 hover:border-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="text-xs px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditWorkspace;