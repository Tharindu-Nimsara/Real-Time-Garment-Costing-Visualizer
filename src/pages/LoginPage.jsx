import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Scissors, Eye, EyeOff, AlertCircle } from "lucide-react";

// Demo credentials — replace with real API call when backend is ready
const DEMO_USERS = [
  { username: "admin", password: "admin123", role: "Admin", name: "Ashan Fernando" },
  { username: "sales1", password: "sales123", role: "Sales", name: "Dilini Perera" },
  { username: "sales2", password: "sales456", role: "Sales", name: "Kamal Silva" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 700));

    const user = DEMO_USERS.find(
      (u) => u.username === username.trim() && u.password === password
    );

    if (user) {
      login(user);
      navigate("/");
    } else {
      setError("Invalid username or password.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-ink-900 flex">

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 relative overflow-hidden">

        {/* Background fabric pattern */}
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute border border-ink-300"
              style={{
                width: `${80 + i * 30}px`,
                height: `${80 + i * 30}px`,
                top: `${10 + i * 7}%`,
                left: `${5 + i * 6}%`,
                transform: `rotate(${i * 15}deg)`,
                borderRadius: i % 3 === 0 ? "50%" : "4px",
              }}
            />
          ))}
        </div>

        {/* Thread lines decoration */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="30%" x2="100%" y2="70%" stroke="#b0ac9d" strokeWidth="0.5" strokeDasharray="6 4" />
          <line x1="0" y1="60%" x2="100%" y2="20%" stroke="#b0ac9d" strokeWidth="0.5" strokeDasharray="4 6" />
          <line x1="20%" y1="0" x2="80%" y2="100%" stroke="#b0ac9d" strokeWidth="0.5" strokeDasharray="5 5" />
        </svg>

        {/* Brand mark */}
        <div className="relative z-10 animate-fade-up opacity-0-init">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-clay-500 rounded-lg flex items-center justify-center">
              <Scissors size={18} className="text-white" />
            </div>
            <span className="font-display text-cream text-xl font-semibold tracking-wide">StitchCost</span>
          </div>

          <div>
            <h1 className="font-display text-5xl font-semibold text-cream leading-tight mb-6">
              Garment Costing,<br />
              <span className="text-clay-400">Instantly.</span>
            </h1>
            <p className="text-ink-300 text-lg leading-relaxed max-w-sm">
              Calculate fabric costs, accessories, stitching and margins — live in a buyer meeting.
            </p>
          </div>
        </div>

        {/* Feature pills */}
        <div className="relative z-10 space-y-3 animate-fade-up opacity-0-init" style={{ animationDelay: "200ms" }}>
          {[
            { icon: "⚡", text: "Real-time cost calculation" },
            { icon: "🎨", text: "Live garment preview" },
            { icon: "📄", text: "Print-ready cost sheets" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-ink-700 rounded-lg flex items-center justify-center text-sm">
                {icon}
              </div>
              <span className="text-ink-300 text-sm">{text}</span>
            </div>
          ))}

          {/* Demo credentials hint */}
          <div className="mt-8 p-4 bg-ink-800 rounded-xl border border-ink-700">
            <p className="text-ink-400 text-xs uppercase tracking-widest mb-2">Demo credentials</p>
            <div className="space-y-1">
              <p className="text-ink-300 text-xs font-mono">admin / admin123</p>
              <p className="text-ink-300 text-xs font-mono">sales1 / sales123</p>
              <p className="text-ink-300 text-xs font-mono">sales2 / sales456</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-14 bg-cream">
        <div className="w-full max-w-sm animate-fade-up opacity-0-init">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-clay-500 rounded flex items-center justify-center">
              <Scissors size={14} className="text-white" />
            </div>
            <span className="font-display text-ink-900 text-lg font-semibold">StitchCost</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="font-display text-3xl font-semibold text-ink-900 mb-1">Welcome back</h2>
            <p className="text-ink-400 text-sm">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <label className="block text-xs text-ink-500 uppercase tracking-widest mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                placeholder="Enter your username"
                autoComplete="username"
                autoFocus
                className={`w-full px-4 py-3 text-sm bg-white border rounded-xl text-ink-900 placeholder:text-ink-300 focus:outline-none transition-all ${
                  error ? "border-red-300 focus:border-red-400" : "border-ink-200 focus:border-ink-500"
                }`}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-ink-500 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 pr-11 text-sm bg-white border rounded-xl text-ink-900 placeholder:text-ink-300 focus:outline-none transition-all ${
                    error ? "border-red-300 focus:border-red-400" : "border-ink-200 focus:border-ink-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl animate-fade-in opacity-0-init">
                <AlertCircle size={14} className="text-red-500 shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full py-3 bg-ink-900 text-cream text-sm font-medium rounded-xl hover:bg-ink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-cream" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-xs text-ink-300 mt-8">
            Access restricted to authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}
