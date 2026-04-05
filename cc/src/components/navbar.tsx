import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/userContext";

const GithubLogo = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const links = [
  { label: "Profile", path: "/profile" },
  { label: "Workspaces", path: "/workspaces" },
];

function NavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useUser();

  const handleConnectGithub = () => {
    const token = localStorage.getItem("access");
    window.location.href = `http://localhost:8000/api/auth/github/?state=${token}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    window.location.href = "/login";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center gap-6 px-6 py-3 bg-[#0d0d0d] border-b border-white/5">
      {/* logo */}
      <div className="flex items-center gap-2 text-zinc-300 mr-2">
        <GithubLogo />
        <span className="text-sm font-semibold tracking-tight">CoLabCode</span>
      </div>

      {/* links */}
      <div className="flex items-center gap-1">
        {links.map((link) => {
          const active = pathname === link.path;
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                active
                  ? "bg-white/10 text-zinc-200"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>

      {/* right side */}
      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={handleConnectGithub}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <GithubLogo />
          Connect GitHub
        </button>

        {user && (
          <div className="flex items-center gap-2 pl-3 border-l border-white/10">
            <img src={user.avatar_url} className="w-6 h-6 rounded-full" />
            <span className="text-xs text-zinc-400">{user.pseudo}</span>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="text-xs px-3 py-1.5 rounded-md text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default NavBar;