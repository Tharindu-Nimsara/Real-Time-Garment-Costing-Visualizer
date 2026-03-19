import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import CostSummaryCard from "../components/CostSummaryCard";
import {
  STITCHING_OPTIONS,
  ACCESSORIES,
  PACKAGING,
} from "../data/costData";
import { ArrowRight, ArrowLeft, Save, Check } from "lucide-react";

function SectionLabel({ children }) {
  return <p className="text-xs uppercase tracking-widest text-ink-400 mb-3 font-medium">{children}</p>;
}

function CheckRow({ label, price, checked, onChange, accent = false }) {
  return (
    <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${checked ? (accent ? "border-clay-300 bg-clay-50" : "border-sage-300 bg-sage-50") : "border-ink-100 hover:border-ink-200"}`}>
      <div className="flex items-center gap-3">
        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${checked ? (accent ? "border-clay-500 bg-clay-500" : "border-sage-500 bg-sage-500") : "border-ink-300"}`}>
          {checked && <Check size={10} className="text-white" />}
        </div>
        <span className="text-sm text-ink-700">{label}</span>
      </div>
      <span className="font-mono text-xs text-ink-500">Rs. {price}</span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    </label>
  );
}

export default function CostingPage() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [designName, setDesignName] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);

  const {
    stitchingId, setStitchingId,
    shirtsPerKg, setShirtsPerKg,
    selectedAccessories, toggleAccessory,
    selectedPackaging, togglePackaging,
    margin, setMargin,
    quantity, setQuantity,
    buyerName, setBuyerName,
    orderRef, setOrderRef,
    currentCost,
    saveDesign,
  } = useApp();

  const handleSave = () => {
    if (!designName.trim()) return;
    saveDesign(designName);
    setSaved(true);
    setShowSaveModal(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-cream pt-14">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-end justify-between mb-8 animate-fade-up opacity-0-init">
          <div>
            <p className="text-ink-400 text-xs uppercase tracking-widest mb-1">Step 02</p>
            <h1 className="font-display text-4xl font-semibold text-ink-900">Costing</h1>
          </div>
          <button
            onClick={() => navigate("/design")}
            className="flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-700 transition-colors"
          >
            <ArrowLeft size={13} /> Back to Design
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Forms */}
          <div className="lg:col-span-2 space-y-6">

            {/* Order Info */}
            <div className="bg-white rounded-xl border border-ink-100 p-5 animate-fade-up opacity-0-init" style={{ animationDelay: "80ms" }}>
              <SectionLabel>Order Information</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-ink-400 mb-1.5 block">Buyer Name</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Marks & Spencer"
                    className="w-full px-3 py-2 text-sm border border-ink-200 rounded-lg focus:outline-none focus:border-ink-500 bg-white text-ink-800 placeholder:text-ink-300"
                  />
                </div>
                <div>
                  <label className="text-xs text-ink-400 mb-1.5 block">Order Reference</label>
                  <input
                    type="text"
                    value={orderRef}
                    onChange={(e) => setOrderRef(e.target.value)}
                    placeholder="e.g. PO-2026-001"
                    className="w-full px-3 py-2 text-sm border border-ink-200 rounded-lg focus:outline-none focus:border-ink-500 bg-white text-ink-800 placeholder:text-ink-300"
                  />
                </div>
                <div>
                  <label className="text-xs text-ink-400 mb-1.5 block">Order Quantity (pcs)</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    className="w-full px-3 py-2 text-sm border border-ink-200 rounded-lg focus:outline-none focus:border-ink-500 bg-white text-ink-800"
                  />
                </div>
                <div>
                  <label className="text-xs text-ink-400 mb-1.5 block">Shirts per KG <span className="text-ink-300">(yield)</span></label>
                  <input
                    type="number"
                    value={shirtsPerKg}
                    onChange={(e) => setShirtsPerKg(Math.max(1, parseFloat(e.target.value) || 1))}
                    min="1"
                    step="0.5"
                    className="w-full px-3 py-2 text-sm border border-ink-200 rounded-lg focus:outline-none focus:border-ink-500 bg-white text-ink-800"
                  />
                  <p className="text-xs text-ink-300 mt-1">Default: 4 shirts/kg</p>
                </div>
              </div>
            </div>

            {/* Stitching */}
            <div className="bg-white rounded-xl border border-ink-100 p-5 animate-fade-up opacity-0-init" style={{ animationDelay: "160ms" }}>
              <SectionLabel>Stitching Type</SectionLabel>
              <div className="space-y-2">
                {STITCHING_OPTIONS.map((s) => (
                  <label
                    key={s.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      stitchingId === s.id ? "border-ink-900 bg-ink-50" : "border-ink-100 hover:border-ink-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${stitchingId === s.id ? "border-ink-900 bg-ink-900" : "border-ink-300"}`} />
                      <span className="text-sm font-medium text-ink-700">{s.label}</span>
                    </div>
                    <span className="font-mono text-sm text-ink-600">Rs. {s.price}</span>
                    <input type="radio" name="stitching" value={s.id} checked={stitchingId === s.id} onChange={() => setStitchingId(s.id)} className="sr-only" />
                  </label>
                ))}
              </div>
            </div>

            {/* Accessories */}
            <div className="bg-white rounded-xl border border-ink-100 p-5 animate-fade-up opacity-0-init" style={{ animationDelay: "240ms" }}>
              <SectionLabel>Embroidery & Trims</SectionLabel>
              <div className="space-y-2">
                {ACCESSORIES.map((a) => (
                  <CheckRow
                    key={a.id}
                    label={a.label}
                    price={a.price}
                    checked={selectedAccessories.includes(a.id)}
                    onChange={() => toggleAccessory(a.id)}
                  />
                ))}
              </div>
            </div>

            {/* Packaging */}
            <div className="bg-white rounded-xl border border-ink-100 p-5 animate-fade-up opacity-0-init" style={{ animationDelay: "320ms" }}>
              <SectionLabel>Packaging & Transport</SectionLabel>
              <div className="space-y-2">
                {PACKAGING.map((p) => (
                  <CheckRow
                    key={p.id}
                    label={p.label}
                    price={p.price}
                    checked={selectedPackaging.includes(p.id)}
                    onChange={() => togglePackaging(p.id)}
                    accent
                  />
                ))}
              </div>
            </div>

            {/* Margin */}
            <div className="bg-white rounded-xl border border-ink-100 p-5 animate-fade-up opacity-0-init" style={{ animationDelay: "400ms" }}>
              <div className="flex items-center justify-between mb-3">
                <SectionLabel>Profit Margin</SectionLabel>
                <span className="font-mono text-sm font-semibold text-clay-600">{margin}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="1"
                value={margin}
                onChange={(e) => setMargin(parseInt(e.target.value))}
                className="w-full accent-clay-500"
              />
              <div className="flex justify-between text-xs text-ink-300 mt-1">
                <span>0%</span>
                <span>30%</span>
                <span>60%</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-ink-400">Margin amount:</span>
                <span className="font-mono text-xs font-semibold text-clay-600">
                  Rs. {currentCost.marginAmount.toLocaleString()} per unit
                </span>
              </div>
            </div>
          </div>

          {/* Right: Cost Panel */}
          <div className="space-y-5 animate-fade-up opacity-0-init" style={{ animationDelay: "100ms" }}>
            <CostSummaryCard />

            {/* Save Button */}
            <button
              onClick={() => setShowSaveModal(true)}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium border transition-all ${
                saved
                  ? "bg-sage-50 border-sage-300 text-sage-700"
                  : "border-ink-200 text-ink-700 hover:border-ink-400"
              }`}
            >
              {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Design</>}
            </button>

            {/* Next */}
            <button
              onClick={() => navigate("/result")}
              className="w-full flex items-center justify-center gap-2 bg-clay-500 text-white py-3 rounded-xl font-medium hover:bg-clay-600 transition-colors"
            >
              Generate Result <ArrowRight size={15} />
            </button>

            {/* Summary chips */}
            <div className="bg-ink-50 rounded-xl p-4 space-y-2">
              <p className="text-xs uppercase tracking-widest text-ink-400 mb-3">Quick Summary</p>
              {[
                { label: "Fabric", value: `Rs. ${currentCost.breakdown.fabric}` },
                { label: "Stitching", value: `Rs. ${currentCost.breakdown.stitching}` },
                { label: "Accessories", value: `Rs. ${currentCost.breakdown.accessories}` },
                { label: "Packaging", value: `Rs. ${currentCost.breakdown.packaging}` },
                { label: "Margin", value: `${margin}%` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-ink-500">{label}</span>
                  <span className="font-mono text-ink-700">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-ink-900/50 flex items-center justify-center z-50 p-4 animate-fade-in opacity-0-init">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl animate-fade-up opacity-0-init">
            <h3 className="font-display text-lg font-semibold text-ink-900 mb-4">Save Design</h3>
            <input
              type="text"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              placeholder="e.g. Summer Polo – Navy"
              autoFocus
              className="w-full px-3 py-2.5 text-sm border border-ink-200 rounded-lg focus:outline-none focus:border-ink-500 mb-4"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
            <div className="flex gap-3">
              <button onClick={() => setShowSaveModal(false)} className="flex-1 py-2.5 text-sm border border-ink-200 rounded-lg text-ink-600 hover:bg-ink-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={!designName.trim()} className="flex-1 py-2.5 text-sm bg-ink-900 text-cream rounded-lg font-medium hover:bg-ink-700 transition-colors disabled:opacity-40">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
