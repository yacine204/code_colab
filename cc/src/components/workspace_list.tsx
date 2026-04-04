
import { useState, useEffect } from "react";
import Button from "./button";
import type { Workspace } from "../interfaces/Workspace";
import api from "../api/axios";
import { workspace_api } from "../api/workspace";

interface WorkspaceListProps {
    variant: "profile" | "dashboard";
}

export function WorkspaceList({ variant }: WorkspaceListProps) {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const result = await api.get(workspace_api.workspace);
                setWorkspaces(result.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetch();
    }, []);

    if (variant === "profile") {
        return (
            <div className="grid grid-cols-2 gap-3">
                {workspaces.map((ws) => (
                    <div
                        key={ws.id}
                        className="bg-[#0a0a0a] border border-[#1f1f1f] hover:border-green-500/20 rounded-lg p-4 cursor-pointer transition-colors flex flex-col gap-2 min-h-[120px]"
                    >
                        <p className="text-sm text-zinc-200 font-medium">{ws.name}</p>
                        <p className="text-[11px] text-green-500/60 font-mono truncate">
                            {ws.github_url ?? "no github url linked"}
                        </p>
                        <p className="text-[11px] text-zinc-600 italic mt-auto">
                            {ws.description ?? "no description"}
                        </p>
                    </div>
                ))}
                <div className="bg-[#0a0a0a] border border-dashed border-[#1f1f1f] rounded-lg p-4 flex items-center justify-center cursor-pointer hover:border-green-500/20 transition-colors min-h-[120px]">
                    <span className="text-xs text-zinc-600">+ new workspace</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex justify-end">
                <Button context="NEW" variant="run" />
            </div>
            {workspaces.map((ws) => (
                <div
                    key={ws.id}
                    className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-4 flex items-center justify-between hover:border-green-500/20 transition-colors"
                >
                    <div className="flex flex-col gap-1">
                        <p className="text-sm text-zinc-200 font-medium">{ws.name}</p>
                        <p className="text-[11px] text-zinc-600 font-mono">
                            {ws.github_url ?? "no github url"}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button context="JOIN" variant="run" />
                        <Button context="EDIT" />
                    </div>
                </div>
            ))}
        </div>
    );
}