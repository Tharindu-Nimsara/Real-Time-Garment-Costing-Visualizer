import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Scissors, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register, authError, authLoading, clearAuthError } = useAuth();

  const [tab, setTab] = useState("login"); // "login" | "register"
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAuthError();
    let result;
    if (tab === "login") {
      result = await login(email, password);
    } else {
      result = await register(name, email, password);
    }
    if (result.success) navigate("/");
  };

  const switchTab = (t) => {
    setTab(t);
    clearAuthError();
    setName(""); setEmail(""); setPassword("");
  };

  return (
    <div className="min-h-screen bg-ink-900 flex">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="30%" x2="100%" y2="70%" stroke="#b0ac9d" strokeWidth="0.5" strokeDasharray="6 4" />
          <line x1="0" y1="60%" x2="100%" y2="20%" stroke="#b0ac9d" strokeWidth="0.5" strokeDasharray="4 6" />
          <line x1="20%" y1="0" x2="80%" y2="100%" stroke="#b0ac9d" strokeWidth="0.5" strokeDasharray="5 5" />
        </svg>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="absolute border border-ink-300 opacity-5"
            style={{ width: `${80+i*35}px`, height: `${80+i*35}px`, top: `${10+i*9}%`, left: `${5+i*7}%`, transform: `rotate(${i*18}deg)`, borderRadius: i%3===0?"50%":"4px" }} />
        ))}

        <div className="relative z-10 animate-fade-up opacity-0-init">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-clay-500 rounded-lg flex items-center justify-center">
              <Scissors size={18} className="text-white" />
            </div>
            <span className="font-display text-cream text-xl font-semibold tracking-wide">M.S.R. Apparels</span>
          </div>
          <h1 className="font-display text-5xl font-semibold text-cream leading-tight mb-6">
            Garment Costing,<br /><span className="text-clay-400">Instantly.</span>
          </h1>
          <p className="text-ink-300 text-lg leading-relaxed max-w-sm">
            Calculate fabric costs, accessories, stitching and margins — live in a buyer meeting.
          </p>
        </div>

        <div className="relative z-10 space-y-3 animate-fade-up opacity-0-init" style={{ animationDelay: "200ms" }}>
          {[
            { icon: "⚡", text: "Real-time cost calculation" },
            { icon: "🎨", text: "Live garment preview" },
            { icon: "📄", text: "Print-ready cost sheets" },
            { icon: "☁️", text: "Logo upload via Cloudinary" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-ink-700 rounded-lg flex items-center justify-center text-sm">{icon}</div>
              <span className="text-ink-300 text-sm">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-14 bg-cream">
        <div className="w-full max-w-sm animate-fade-up opacity-0-init">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-clay-500 rounded flex items-center justify-center">
              <Scissors size={14} className="text-white" />
            </div>
            <span className="font-display text-ink-900 text-lg font-semibold">M.S.R. Apparels</span>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-ink-100 rounded-xl p-1 mb-8">
            {["login", "register"].map((t) => (
              <button key={t} onClick={() => switchTab(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all capitalize ${tab === t ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-700"}`}>
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="font-display text-3xl font-semibold text-ink-900 mb-1">
              {tab === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-ink-400 text-sm">
              {tab === "login" ? "Sign in to your account to continue" : "Register to access the costing system"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name — register only */}
            {tab === "register" && (
              <div className="animate-fade-in opacity-0-init">
                <label className="block text-xs text-ink-500 uppercase tracking-widest mb-2">Full Name</label>
                <input type="text" value={name} onChange={(e) => { setName(e.target.value); clearAuthError(); }}
                  placeholder="e.g. Ashan Fernando" autoComplete="name" required
                  className="w-full px-4 py-3 text-sm bg-white border border-ink-200 rounded-xl text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-ink-500 transition-all" />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs text-ink-500 uppercase tracking-widest mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); clearAuthError(); }}
                placeholder="you@company.com" autoComplete="email" required autoFocus={tab === "login"}
                className={`w-full px-4 py-3 text-sm bg-white border rounded-xl text-ink-900 placeholder:text-ink-300 focus:outline-none transition-all ${authError ? "border-red-300 focus:border-red-400" : "border-ink-200 focus:border-ink-500"}`} />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-ink-500 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => { setPassword(e.target.value); clearAuthError(); }}
                  placeholder="Enter your password" autoComplete={tab === "login" ? "current-password" : "new-password"} required
                  className={`w-full px-4 py-3 pr-11 text-sm bg-white border rounded-xl text-ink-900 placeholder:text-ink-300 focus:outline-none transition-all ${authError ? "border-red-300 focus:border-red-400" : "border-ink-200 focus:border-ink-500"}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-500 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {authError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl animate-fade-in opacity-0-init">
                <AlertCircle size={14} className="text-red-500 shrink-0" />
                <p className="text-red-600 text-sm">{authError}</p>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={authLoading || !email || !password || (tab === "register" && !name)}
              className="w-full py-3 bg-ink-900 text-cream text-sm font-medium rounded-xl hover:bg-ink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
              {authLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-cream" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {tab === "login" ? "Signing in..." : "Registering..."}
                </>
              ) : (
                tab === "login" ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-ink-300 mt-8">
            Access restricted to authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}
