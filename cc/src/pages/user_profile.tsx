import { useUser } from "../context/userContext";
import { EditableField } from "../components/editable_field";
import { InnerCard } from "../components/inner_card";
import { SectionLabel } from "../components/section_label";
import { WorkspaceList } from "../components/workspace_list";
import HamburgerMenu from "../components/hamburger_menu";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const GithubIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    className="w-4 h-4 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

function UserProfile() {
  const user = useUser();

  const [searchParams] = useSearchParams();
  const [githubConnected, setGithubConnected] = useState(false);

  useEffect(() => {
    const status = searchParams.get("github");
    if (status === "success") setGithubConnected(true);
  }, []);

  const handleConnectGithub = () => {
    const token = localStorage.getItem("access");
    window.location.href = `http://localhost:8000/api/auth/github/?state=${token}`

    
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8 flex justify-center">
      <HamburgerMenu
        avatar={user.avatar_url}
        username={user.pseudo}
        options={[
          {
            label: "Connect to GitHub",
            icon: <GithubIcon />,
            onClick: githubConnected ? () => {} : handleConnectGithub,
          },
          {
            label: "Logout",
            icon: <LogoutIcon />,
            onClick: () => {
              localStorage.removeItem("access");
              window.location.href = "/login";
            },
            variant: "danger",
          },
        ]}
      />

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
