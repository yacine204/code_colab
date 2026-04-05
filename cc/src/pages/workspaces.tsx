import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Workspace } from "../interfaces/Workspace";
import api from "../api/axios";
import { workspace_api } from "../api/workspace";
import Button from "../components/button";
import { workspaceMemberApi } from "../api/workspace_member";
import { useUser } from "../context/userContext";
import EditWorkspace from "../components/edit_workspace";
import NavBar from "../components/navbar";
const GithubIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

function Workspaces() {
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(
    null,
  );
  const handleSave = (updated: Workspace) => {
    setWorkspaces((prev) =>
      prev.map((ws) => (ws.id === updated.id ? updated : ws)),
    );
  };
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const user = useUser();

  const handleJoin = async (workspaceId: number) => {
    try {
      await api.patch(`${workspaceMemberApi.base}${workspaceId}/`, {
        action: "join",
      });
      navigate(`/codespace/${workspaceId}`);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const result = await api.get(workspace_api.workspace);
        setWorkspaces(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchWorkspaces();
  }, []);

  const filtered = workspaces.filter((ws) =>
    ws.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 px-8 pb-8 flex justify-center">
      <NavBar></NavBar>
      <div className="w-full max-w-4xl bg-[#111] border border-green-500/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-sm font-semibold text-zinc-300">
              Workspaces
            </span>
            <span className="text-xs text-zinc-600 ml-2">
              {workspaces.length} workspaces
            </span>
          </div>
          <Button
            context="+ New"
            variant="run"
            trigger={() => navigate("/codespace/new")}
          />
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Find a workspace..."
          className="w-full bg-[#0d0d0d] border border-[#1f1f1f] focus:border-green-500/20 rounded-lg px-3 py-2 text-sm text-zinc-300 placeholder-zinc-700 outline-none mb-4 transition-colors"
        />

        <div className="flex flex-col divide-y divide-[#1a1a1a]">
          {filtered.map((ws) => (
            <div
              key={ws.id}
              className="flex items-start justify-between py-4 gap-4"
            >
              <div className="flex flex-col gap-1.5 flex-1">
                <span
                  className="text-sm font-semibold text-green-500 cursor-pointer hover:underline"
                  onClick={() => navigate(`/codespace/${ws.id}`)}
                >
                  {ws.name}
                </span>
                <span className="text-xs text-zinc-600 italic">
                  {ws.description ?? "no description"}
                </span>
                <div className="flex items-center gap-3 mt-1">
                  {ws.owner === user?.id && (
                    <span className="text-[11px] text-green-500 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5">
                      owner
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[11px] text-zinc-600 font-mono">
                    <GithubIcon />
                    {ws.github_url ?? "no github linked"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  context="Join"
                  variant="run"
                  trigger={() => handleJoin(ws.id)}
                />
                <Button
                  context="Edit"
                  trigger={() => setEditingWorkspace(ws)}
                />
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-sm text-zinc-700 italic py-8 text-center">
              no workspaces found
            </p>
          )}
        </div>
      </div>
      {editingWorkspace && (
        <EditWorkspace
          workspace={editingWorkspace}
          onClose={() => setEditingWorkspace(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default Workspaces;
