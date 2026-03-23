import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import GarmentPreview from "../components/GarmentPreview";
import CostSummaryCard from "../components/CostSummaryCard";
import { GARMENT_TYPES, GARMENT_COLORS, FABRIC_TYPES, FABRIC_MATERIALS } from "../data/costData";
import { ArrowRight, RotateCcw } from "lucide-react";

function SectionLabel({ children }) {
  return <p className="text-xs uppercase tracking-widest text-ink-400 mb-3 font-medium">{children}</p>;
}

export default function DesignPage() {
  const navigate = useNavigate();
  const {
    garmentType, setGarmentType,
    garmentColor, setGarmentColor,
    hasLogo, setHasLogo,
    logoPosition, setLogoPosition,
    fabricType, setFabricType,
    fabricMaterial, setFabricMaterial,
  } = useApp();

  const handleReset = () => {
    setGarmentType("crewneck_tee");
    setGarmentColor("#FFFFFF");
    setHasLogo(false);
    setFabricType("single_jersey");
    setFabricMaterial("cotton");
  };

  return (
    <div className="min-h-screen bg-cream pt-14">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-end justify-between mb-8 animate-fade-up opacity-0-init">
          <div>
            <p className="text-ink-400 text-xs uppercase tracking-widest mb-1">Step 01</p>
            <h1 className="font-display text-4xl font-semibold text-ink-900">Design Garment</h1>
          </div>
          <button onClick={handleReset} className="flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-700 transition-colors">
            <RotateCcw size={13} /> Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Controls */}
          <div className="lg:col-span-2 space-y-6 animate-fade-up opacity-0-init" style={{ animationDelay: "100ms" }}>

            {/* Garment Type */}
            <div className="bg-white rounded-xl border border-ink-100 p-5">
              <SectionLabel>Garment Type</SectionLabel>
              <div className="grid grid-cols-3 gap-3">
                {GARMENT_TYPES.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGarmentType(g.id)}
                    className={`py-3 px-3 rounded-lg text-sm font-medium border transition-all ${
                      garmentType === g.id
                        ? "border-ink-900 bg-ink-900 text-cream"
                        : "border-ink-100 text-ink-600 hover:border-ink-300"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div className="bg-white rounded-xl border border-ink-100 p-5">
              <SectionLabel>Garment Color</SectionLabel>
              <div className="flex flex-wrap gap-3">
                {GARMENT_COLORS.map((c) => (
                  <button
                    key={c.id}
                    title={c.label}
                    onClick={() => setGarmentColor(c.hex)}
                    className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${
                      garmentColor === c.hex ? "border-clay-500 scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: c.hex, boxShadow: c.hex === "#FFFFFF" ? "inset 0 0 0 1px #e5e3dc" : "none" }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-xs text-ink-400">Selected:</span>
                <div className="w-4 h-4 rounded-full border border-ink-200" style={{ backgroundColor: garmentColor }} />
                <code className="text-xs text-ink-500 font-mono">{garmentColor}</code>
                <input
                  type="color"
                  value={garmentColor}
                  onChange={(e) => setGarmentColor(e.target.value)}
                  className="ml-auto w-8 h-7 rounded cursor-pointer border border-ink-200"
                />
              </div>
            </div>

            {/* Fabric */}
            <div className="bg-white rounded-xl border border-ink-100 p-5">
              <SectionLabel>Fabric Construction</SectionLabel>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {FABRIC_TYPES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFabricType(f.id)}
                    className={`py-2 px-3 rounded-lg text-sm border transition-all ${
                      fabricType === f.id
                        ? "border-sage-600 bg-sage-50 text-sage-700"
                        : "border-ink-100 text-ink-500 hover:border-ink-300"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <SectionLabel>Fabric Material</SectionLabel>
              <div className="space-y-2">
                {FABRIC_MATERIALS.map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      fabricMaterial === m.id
                        ? "border-ink-900 bg-ink-50"
                        : "border-ink-100 hover:border-ink-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${fabricMaterial === m.id ? "border-ink-900 bg-ink-900" : "border-ink-300"}`} />
                      <span className="text-sm font-medium text-ink-700">{m.label}</span>
                    </div>
                    <span className="font-mono text-sm text-ink-500">Rs. {m.pricePerKg.toLocaleString()}/kg</span>
                    <input
                      type="radio"
                      name="fabric"
                      value={m.id}
                      checked={fabricMaterial === m.id}
                      onChange={() => setFabricMaterial(m.id)}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Logo */}
            <div className="bg-white rounded-xl border border-ink-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <SectionLabel>Logo / Embroidery</SectionLabel>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setHasLogo(!hasLogo)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${hasLogo ? "bg-clay-500" : "bg-ink-200"}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${hasLogo ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-sm text-ink-600">{hasLogo ? "On" : "Off"}</span>
                </label>
              </div>
              {hasLogo && (
                <div className="grid grid-cols-3 gap-2 animate-fade-in opacity-0-init">
                  {["chest", "back", "sleeve"].map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setLogoPosition(pos)}
                      className={`py-2 text-sm rounded-lg border capitalize transition-all ${
                        logoPosition === pos
                          ? "border-clay-500 bg-clay-50 text-clay-700"
                          : "border-ink-100 text-ink-500 hover:border-ink-300"
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Preview + Cost */}
          <div className="space-y-5 animate-fade-up opacity-0-init" style={{ animationDelay: "200ms" }}>
            {/* Garment Preview */}
            <div className="bg-white rounded-xl border border-ink-100 p-6 flex flex-col items-center">
              <p className="text-xs uppercase tracking-widest text-ink-400 mb-4 self-start">Live Preview</p>
              <div
                className="rounded-xl p-6 w-full flex items-center justify-center transition-all duration-300"
                style={{ background: `linear-gradient(135deg, ${garmentColor}18, ${garmentColor}35)` }}
              >
                <GarmentPreview
                  color={garmentColor}
                  type={garmentType}
                  hasLogo={hasLogo}
                  logoPosition={logoPosition}
                  size={200}
                />
              </div>
              <div className="mt-4 w-full text-center">
                <p className="text-xs text-ink-400">
                  {GARMENT_TYPES.find((g) => g.id === garmentType)?.label} ·{" "}
                  {FABRIC_TYPES.find((f) => f.id === fabricType)?.label} ·{" "}
                  {FABRIC_MATERIALS.find((m) => m.id === fabricMaterial)?.label}
                </p>
              </div>
            </div>

            {/* Live Cost */}
            <CostSummaryCard compact />

            {/* CTA */}
            <button
              onClick={() => navigate("/costing")}
              className="w-full flex items-center justify-center gap-2 bg-clay-500 text-white py-3 rounded-xl font-medium hover:bg-clay-600 transition-colors"
            >
              Continue to Costing <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
