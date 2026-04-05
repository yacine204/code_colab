import { useState } from "react"

interface MenuOption {
  label: string
  icon: React.ReactNode
  onClick: () => void
  variant?: "default" | "danger"
}

interface HamburgerMenuProps {
  options: MenuOption[]
  avatar?: string
  username?: string
}

function HamburgerMenu({ options, avatar, username }: HamburgerMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-6 left-6 z-50 flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/5 transition-colors"
      >
        <span className={`block w-5 h-px bg-green-500 transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`block w-5 h-px bg-green-500 transition-all duration-300 ${open ? "opacity-0" : ""}`} />
        <span className={`block w-5 h-px bg-green-500 transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {/* Overlay */}
      <div className={`fixed top-0 left-0 h-full w-full z-40 flex transition-all duration-300 ${open ? "visible" : "invisible"}`}>

        {/* Panel */}
        <div className={`w-64 h-full bg-[#111] border-r border-green-500/10 flex flex-col p-6 gap-2 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>

          {/* User info */}
          {(avatar || username) && (
            <>
              <div className="flex items-center gap-3 mb-6 mt-10">
                {avatar && <img src={avatar} className="w-9 h-9 rounded-full border border-green-500/20" />}
                {username && <span className="text-sm text-white/70 font-mono">{username}</span>}
              </div>
              <div className="w-full h-px bg-green-500/10 mb-2" />
            </>
          )}

          {/* Options */}
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => { opt.onClick(); setOpen(false) }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                opt.variant === "danger"
                  ? "text-red-400/70 hover:text-red-400 hover:bg-red-500/5"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>

        {/* Backdrop */}
        <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      </div>
    </>
  )
}

export default HamburgerMenu