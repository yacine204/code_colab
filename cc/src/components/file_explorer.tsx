import { useState } from "react";
import { useWorkspace } from "../context/workspaceContext";
import useGithubRepo from "../hooks/github_repo";
import type { GithubFile } from "../hooks/github_repo";

interface TreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: TreeNode[];
  file?: GithubFile;
}

const buildTree = (files: GithubFile[]): TreeNode[] => {
  const root: TreeNode[] = [];

  files
    .filter((f) => f.type === "blob")
    .forEach((file) => {
      const parts = file.path.split("/");
      let current = root;

      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;
        const existing = current.find((n) => n.name === part);

        if (existing) {
          if (!isFile) {
            if (!existing.children) existing.children = [];
            current = existing.children;
          }
        } else {
          const node: TreeNode = isFile
            ? { name: part, path: file.path, type: "file", file }
            : {
                name: part,
                path: parts.slice(0, index + 1).join("/"),
                type: "folder",
                children: [],
              };
          current.push(node);
          if (!isFile) current = node.children!;
        }
      });
    });

  const sort = (nodes: TreeNode[]): TreeNode[] =>
    nodes
      .sort((a, b) =>
        a.type === b.type
          ? a.name.localeCompare(b.name)
          : a.type === "folder"
            ? -1
            : 1,
      )
      .map((n) => ({
        ...n,
        children: n.children ? sort(n.children) : undefined,
      }));

  return sort(root);
};

const TreeNode = ({
  node,
  depth,
  onFileClick,
  activeFilePath,
}: {
  node: TreeNode;
  depth: number;
  onFileClick: (file: GithubFile) => void;
  activeFilePath: string | null;
}) => {
  const [open, setOpen] = useState(depth === 0);

  if (node.type === "folder") {
    return (
      <div>
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 px-2 py-0.5 cursor-pointer hover:bg-white/5 text-zinc-400 text-xs"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          <span>{open ? "▾" : "▸"}</span>
          <span>📁</span>
          <span>{node.name}</span>
        </div>
        {open &&
          node.children?.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              onFileClick={onFileClick}
              activeFilePath={activeFilePath}
            />
          ))}
      </div>
    );
  }

  const isActive = node.path === activeFilePath;
  return (
    <div
      onClick={() => node.file && onFileClick(node.file)}
      className={`flex items-center gap-1 px-2 py-0.5 cursor-pointer text-xs ${
        isActive
          ? "bg-blue-600/30 text-white"
          : "hover:bg-white/5 text-zinc-300"
      }`}
      style={{ paddingLeft: `${depth * 12 + 20}px` }}
    >
      <span>📄</span>
      <span>{node.name}</span>
    </div>
  );
};

interface FileExplorerProps {
  onFileOpen?: (content: string, path: string, language: string) => void;
  repoHook?: {
    branches: string[];
    tree: GithubFile[];
    activeBranch: string | null;
    setActiveBranch: (b: string) => void;
    fetchBlob: (file: GithubFile) => Promise<string>;
    loading: boolean;
    error: string | null;
  };
}
function FileExplorer({ onFileOpen, repoHook }: FileExplorerProps) {
  const { workspace, loading, error } = useWorkspace();

  const internalHook = useGithubRepo(
    repoHook ? "" : (workspace?.github_url ?? ""),
  );
  const {
    branches,
    tree,
    activeBranch,
    setActiveBranch,
    fetchBlob,
    loading: loadingGit,
    error: errorGit,
  } = repoHook ?? internalHook;

  const [activeFilePath, setActiveFilePath] = useState<string | null>(null);

  const handleFileClick = async (file: GithubFile) => {
    setActiveFilePath(file.path);
    const content = await fetchBlob(file);
    const ext = file.path.split(".").pop()?.toLowerCase() || "";
    const langMap: Record<string, string> = {
      c: "c",
      h: "cpp",
      cpp: "cpp",
      js: "javascript",
      ts: "typescript",
      tsx: "typescript",
      jsx: "javascript",
      py: "python",
      md: "markdown",
      json: "json",
      html: "html",
      css: "css",
      go: "go",
      rs: "rust",
    };
    const language = langMap[ext] || "plaintext";
    onFileOpen?.(content, file.path, language);
  };

  const nestedTree = buildTree(tree);

  if (loading)
    return (
      <div className="p-4 text-xs text-zinc-500">Loading workspace...</div>
    );
  if (error) return <div className="p-4 text-xs text-red-400">{error}</div>;
  if (!workspace)
    return <div className="p-4 text-xs text-zinc-500">No active workspace</div>;
  if (loadingGit)
    return <div className="p-4 text-xs text-zinc-500">Loading repo...</div>;
  if (errorGit)
    return <div className="p-4 text-xs text-red-400">{errorGit}</div>;

  return (
    <div className="flex flex-col h-full bg-[#252526] text-white overflow-hidden">
      {/* workspace name */}
      <div className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-white/10">
        {workspace.name}
      </div>

      {/* branch selector */}
      <div className="px-3 py-2 border-b border-white/10">
        <select
          value={activeBranch ?? ""}
          onChange={(e) => setActiveBranch(e.target.value)}
          className="w-full text-xs bg-zinc-800 border border-white/10 rounded px-2 py-1 text-zinc-300 outline-none"
        >
          {branches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      </div>

      {/* file tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {nestedTree.map((node) => (
          <TreeNode
            key={node.path}
            node={node}
            depth={0}
            onFileClick={handleFileClick}
            activeFilePath={activeFilePath}
          />
        ))}
      </div>
    </div>
  );
}

export default FileExplorer;
