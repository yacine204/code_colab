const base_api: string= import.meta.env.VITE_BASE_API

export const workspace_api = {
    workspace: base_api+"workspace/",
    workspaceById: (id: number) => `${base_api}workspace/${id}/`,
}

    