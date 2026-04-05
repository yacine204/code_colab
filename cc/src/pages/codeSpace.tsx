import Terminal from "../components/terminal";
import FileExplorer from "../components/file_explorer";
import { useState } from "react";
import { useWorkspace } from "../context/workspaceContext";
import useGithubRepo from "../hooks/github_repo";
import { useUser } from "../context/userContext";
import { useNavigate, useParams } from "react-router-dom";

function CodeSpace() {
  const user = useUser();
  const navigate = useNavigate();
  const { workspace } = useWorkspace();
  const { workspaceId } = useParams();
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("python");
  const [commitMessage, setCommitMessage] = useState("");
  const [committing, setCommitting] = useState(false);
  const [prUrl, setPrUrl] = useState<string | null>(null);
  const [commitError, setCommitError] = useState<string | null>(null);

  const handleLeave = async () => {
    if (!workspace?.id) return navigate("/workspaces");
    const token = localStorage.getItem("access");
    await fetch(`http://localhost:8000/workspace-member/${workspaceId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action: "leave" }),
    });
    navigate("/workspaces");
  };

  const {
    branches,
    tree,
    activeBranch,
    activeFile,
    setActiveBranch,
    fetchBlob,
    commitFile,
    loading: loadingGit,
    error: errorGit,
  } = useGithubRepo(workspace?.github_url ?? "");

  const handleFileOpen = (content: string, path: string, lang: string) => {
    setCode(content);
    setLanguage(lang);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleCommit = async () => {
    if (!commitMessage.trim()) return;
    if (!activeFile) return;
    if (!workspace) return;

    setCommitting(true);
    setCommitError(null);
    setPrUrl(null);

    try {
      const res = await commitFile(code, commitMessage, workspace.name);
      setPrUrl(res.pr_url);
      setCommitMessage("");
    } catch (err: any) {
      setCommitError(err.message);
    } finally {
      setCommitting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#1a1a1f] p-4 gap-3 overflow-hidden">

      {/* LEFT — sidebar */}
      <div className="flex flex-col w-48 shrink-0 gap-3">

        {/* nav card */}
        <div className="bg-[#111116] border border-white/10 rounded-xl p-3 flex flex-col gap-2">
          {/* user */}
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            {user?.avatar_url && (
              <img src={user.avatar_url} className="w-6 h-6 rounded-full shrink-0" />
            )}
            <span className="text-xs text-zinc-400 truncate">{user?.pseudo}</span>
          </div>

          {/* workspace name */}
          {workspace && (
            <div className="text-[11px] text-zinc-600 font-mono truncate px-1">
              📁 {workspace.name}
            </div>
          )}

          {/* nav links */}
          <button
            onClick={() => navigate("/profile")}
            className="text-xs text-left text-zinc-500 hover:text-zinc-300 hover:bg-white/5 px-2 py-1 rounded transition-colors"
          >
            Profile
          </button>
          <button
            onClick={() => navigate("/workspaces")}
            className="text-xs text-left text-zinc-500 hover:text-zinc-300 hover:bg-white/5 px-2 py-1 rounded transition-colors"
          >
            Workspaces
          </button>

          {/* leave */}
          <button
            onClick={handleLeave}
            className="text-xs text-left text-red-400/60 hover:text-red-400 hover:bg-red-500/10 px-2 py-1 rounded transition-colors mt-1"
          >
            Leave Codespace
          </button>
        </div>

        {/* git console */}
        <div className="bg-[#111116] border border-white/10 rounded-xl p-3 flex flex-col gap-2">
          <span className="text-xs text-orange-400 font-mono">$ git</span>

          {/* active file indicator */}
          <div className="text-xs text-zinc-500 font-mono truncate">
            {activeFile ? `${activeFile.path}` : "no file selected"}
          </div>

          {/* commit message input */}
          <input
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="commit message..."
            className="text-xs bg-zinc-800 border border-white/10 rounded px-2 py-1 text-zinc-300 outline-none placeholder:text-zinc-600 font-mono"
          />

          {/* commit button */}
          <button
            onClick={handleCommit}
            disabled={committing || !activeFile || !commitMessage.trim()}
            className="text-xs px-2 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-mono"
          >
            {committing ? "pushing..." : "commit + PR"}
          </button>

          {/* PR link */}
          {prUrl && (
            <a
              href={prUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-green-400 hover:underline font-mono truncate"
            >
              view pr
            </a>
          )}

          {/* error */}
          {commitError && (
            <span className="text-xs text-red-400 font-mono">{commitError}</span>
          )}
        </div>
      </div>

      {/* MIDDLE — chat */}
      <div className="flex flex-col w-56 shrink-0 bg-[#111116] border border-white/10 rounded-xl overflow-hidden">
        <div className="flex-1" />
        <div className="border-t border-white/10 p-3 flex flex-col gap-2">
          <div className="h-8 rounded-lg bg-zinc-800 border border-white/10" />
          <div className="h-24 rounded-lg bg-zinc-800 border border-white/10" />
        </div>
      </div>

      {/* FILE EXPLORER */}
      <div className="flex flex-col w-56 shrink-0 bg-[#111116] border border-white/10 rounded-xl overflow-hidden">
        <div className="px-3 py-2 border-b border-white/10">
          <span className="text-xs text-zinc-400 uppercase tracking-widest">
            Project Folder Structure
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          <FileExplorer
            onFileOpen={handleFileOpen}
            repoHook={{
              branches,
              tree,
              activeBranch,
              setActiveBranch,
              fetchBlob,
              loading: loadingGit,
              error: errorGit,
            }}
          />
        </div>
      </div>

      {/* TERMINAL */}
      <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden">
        <Terminal
          externalCode={code}
          externalLanguage={language}
          height="100%"
          onCodeChange={handleCodeChange}
        />
      </div>

    </div>
  );
}

export default CodeSpace;