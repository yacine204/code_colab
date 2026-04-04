import { useUser } from "../context/userContext";
import { EditableField } from "../components/editable_field";
import { InnerCard } from "../components/inner_card";
import { SectionLabel } from "../components/section_label";
import { WorkspaceList } from "../components/workspace_list";

function UserProfile() {
    const user = useUser();
    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-8 flex justify-center">
            <div className="w-full max-w-4xl bg-[#111] border border-green-500/10 rounded-2xl p-6 flex flex-col gap-4">

                {/* top row */}
                <div className="grid grid-cols-[180px_1fr] gap-4">
                    <InnerCard className="flex flex-col items-center justify-center gap-3">
                        <img
                            src={user.avatar_url}
                            className="w-20 h-20 rounded-full border border-green-500/20"
                        />
                        <div className="flex items-center gap-1.5 text-[11px] text-green-500 tracking-wide">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
                            online
                        </div>
                    </InnerCard>
                    <InnerCard className="flex flex-col justify-center gap-3">
                        <EditableField label="Pseudo" value={user.pseudo} field="pseudo" />
                        <EditableField label="Email" value={user.email} field="email" />
                    </InnerCard>
                </div>

                {/* bottom row */}
                <div className="grid grid-cols-[180px_1fr] gap-4">
                    <InnerCard className="flex flex-col gap-3">
                        <SectionLabel text="About" />
                        <EditableField
                            label=""
                            value={user.description ?? ""}
                            field="description"
                        />
                    </InnerCard>
                    <InnerCard>
                        <SectionLabel text="Workspaces" />
                        <WorkspaceList variant="profile" />
                    </InnerCard>
                </div>

            </div>
        </div>
    );
}

export default UserProfile;