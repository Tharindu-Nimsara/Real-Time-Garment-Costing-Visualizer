import { Link, useLocation, useNavigate } from "react-router-dom";
import { Scissors, LayoutDashboard, Palette, Calculator, FileText, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/design", label: "Design", icon: Palette },
  { to: "/costing", label: "Costing", icon: Calculator },
  { to: "/result", label: "Result", icon: FileText },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-ink-900 border-b border-ink-700">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-clay-400 rounded flex items-center justify-center group-hover:bg-clay-300 transition-colors">
            <Scissors size={14} className="text-white" />
          </div>
          <span className="font-display text-cream text-base font-semibold tracking-wide">M.S.R. Apparels</span>
        </Link>

        <div className="flex items-center gap-1">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link key={to} to={to} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-body transition-all ${active ? "bg-clay-500 text-cream" : "text-ink-300 hover:text-cream hover:bg-ink-700"}`}>
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.slice(1).map(({ to }, i) => {
              const active = pathname === to;
              const done = (to === "/design" && ["/costing", "/result"].includes(pathname)) || (to === "/costing" && pathname === "/result");
              return (
                <div key={to} className="flex items-center gap-1">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono transition-all ${active ? "bg-clay-400 text-white" : done ? "bg-sage-500 text-white" : "bg-ink-700 text-ink-400"}`}>
                    {done ? "✓" : i + 1}
                  </div>
                  {i < 2 && <div className="w-4 h-px bg-ink-700" />}
                </div>
              );
            })}
          </div>

          <div className="hidden md:block w-px h-5 bg-ink-700" />

          {user && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-clay-500 flex items-center justify-center text-[10px] font-mono text-white font-semibold">
                {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </div>
              <div className="hidden lg:block">
                <p className="text-cream text-xs font-medium leading-none">{user.name}</p>
                <p className="text-ink-400 text-[10px] leading-none mt-0.5">{user.role}</p>
              </div>
            </div>
          )}

          <button onClick={handleLogout} title="Sign out" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-ink-400 hover:text-cream hover:bg-ink-700 transition-all text-xs">
            <LogOut size={13} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
