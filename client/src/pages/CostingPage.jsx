import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import CostSummaryCard from "../components/CostSummaryCard";
import { STITCHING_OPTIONS, ACCESSORIES, PACKAGING } from "../data/costData";
import {
  ArrowRight,
  ArrowLeft,
  Save,
  Check,
  Upload,
  AlertCircle,
  Loader,
  ImagePlus,
  X,
} from "lucide-react";

function SectionLabel({ children }) {
  return (
    <p className="text-xs uppercase tracking-widest text-ink-400 mb-3 font-medium">
      {children}
    </p>
  );
}

function CheckRow({ label, price, checked, onChange, accent = false }) {
  return (
    <label
      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${checked ? (accent ? "border-clay-300 bg-clay-50" : "border-sage-300 bg-sage-50") : "border-ink-100 hover:border-ink-200"}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${checked ? (accent ? "border-clay-500 bg-clay-500" : "border-sage-500 bg-sage-500") : "border-ink-300"}`}
        >
          {checked && <Check size={10} className="text-white" />}
        </div>
        <span className="text-sm text-ink-700">{label}</span>
      </div>
      <span className="font-mono text-xs text-ink-500">Rs. {price}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
    </label>
  );
}

export default function CostingPage() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [designName, setDesignName] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const logoInputRef = useRef(null);

  const {
    stitchingId,
    setStitchingId,
    shirtsPerKg,
    setShirtsPerKg,
    selectedAccessories,
    toggleAccessory,
    selectedPackaging,
    togglePackaging,
    quantity,
    sizes,
    updateSizeQty,
    sizesTotal,
    sizesValid,
    displayedCost,
    saveDesign,
    hasLogo,
    setHasLogo,
    logoPosition,
    setLogoPosition,
    logoUrl,
    logoUploadLoading,
    logoUploadError,
    uploadLogo,
    submitQuote,
    quoteLoading,
    quoteError,
  } = useApp();

  const handleLogoFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Logo file must be under 5MB.");
      return;
    }
    await uploadLogo(file);
  };

  const handleSave = () => {
    if (!designName.trim()) return;
    saveDesign(designName);
    setSaved(true);
    setShowSaveModal(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleGenerateResult = async () => {
    if (!sizesValid) return;
    const result = await submitQuote();
    if (result.success) navigate("/result");
  };

  return (
    <div className="min-h-screen bg-cream pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 animate-fade-up opacity-0-init">
          <div>
            <p className="text-ink-400 text-xs uppercase tracking-widest mb-1">
              Step 02
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink-900">
              Costing
            </h1>
          </div>
          <button
            onClick={() => navigate("/design")}
            className="flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-700 transition-colors"
          >
            <ArrowLeft size={13} /> Back to Design
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <div
              className="bg-white rounded-xl border border-ink-100 p-5 animate-fade-up opacity-0-init"
              style={{ animationDelay: "80ms" }}
            >
              <SectionLabel>Order Information</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-ink-400 mb-1.5 block">
                    Shirts per KG <span className="text-ink-300">(yield)</span>
                  </label>
                  <input
                    type="number"
                    value={shirtsPerKg}
                    min="1"
                    step="0.5"
                    onChange={(e) =>
                      setShirtsPerKg(
                        Math.max(1, parseFloat(e.target.value) || 1),
                      )
                    }
                    className="w-full px-3 py-2 text-sm border border-ink-200 rounded-lg focus:outline-none focus:border-ink-500 bg-white text-ink-800"
                  />
                  <p className="text-xs text-ink-300 mt-1">
                    Default: 4 shirts/kg
                  </p>
                </div>
              </div>
            </div>

            {/* Size Distribution — required by API */}
            <div
              className="bg-white rounded-xl border border-ink-100 p-5 animate-fade-up opacity-0-init"
              style={{ animationDelay: "120ms" }}
            >
              <div className="flex items-center justify-between mb-3">
                <SectionLabel>Size Distribution</SectionLabel>
                <div
                  className={`flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg ${sizesValid ? "bg-sage-50 text-sage-600" : "bg-clay-50 text-clay-600"}`}
                >
                  {sizesTotal} / {quantity} pcs
                  <Check size={11} />
                </div>
              </div>
              <p className="text-xs text-ink-400 mb-4">
                Total quantity is auto-calculated by adding all size quantities.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {sizes.map(({ size, qty }) => (
                  <div key={size}>
                    <label className="text-xs text-ink-400 mb-1.5 block text-center">
                      {size}
                    </label>
                    <input
                      type="number"
                      value={qty}
                      min="0"
                      onChange={(e) => updateSizeQty(size, e.target.value)}
                      className={`w-full px-3 py-2.5 text-sm text-center border rounded-lg focus:outline-none transition-all bg-white text-ink-800 ${!sizesValid && qty > 0 ? "border-clay-300 focus:border-clay-400" : "border-ink-200 focus:border-ink-500"}`}
                    />
                  </div>
                ))}
              </div>
              {!sizesValid && sizesTotal > 0 && (
                <p className="text-xs text-clay-500 mt-2 flex items-center gap-1">
                  <AlertCircle size={11} />
                  Enter at least 1 piece across sizes to continue.
                </p>
              )}
            </div>

            {/* Stitching */}
            <div
              className="bg-white rounded-xl border border-ink-100 p-5 animate-fade-up opacity-0-init"
              style={{ animationDelay: "160ms" }}
            >
              <SectionLabel>Stitching Type</SectionLabel>
              <div className="space-y-2">
                {STITCHING_OPTIONS.map((s) => (
                  <label
                    key={s.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${stitchingId === s.id ? "border-ink-900 bg-ink-50" : "border-ink-100 hover:border-ink-300"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${stitchingId === s.id ? "border-ink-900 bg-ink-900" : "border-ink-300"}`}
                      />
                      <span className="text-sm font-medium text-ink-700">
                        {s.label}
                      </span>
                    </div>
                    <span className="font-mono text-sm text-ink-600">
                      Rs. {s.price}
                    </span>
                    <input
                      type="radio"
                      name="stitching"
                      value={s.id}
                      checked={stitchingId === s.id}
                      onChange={() => setStitchingId(s.id)}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Logo Upload — calls /api/quotes/upload-logo */}
            <div
              className="bg-white rounded-xl border border-ink-100 p-5 animate-fade-up opacity-0-init"
              style={{ animationDelay: "200ms" }}
            >
              <div className="flex items-center justify-between mb-4">
                <SectionLabel>Branding / Logo</SectionLabel>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setHasLogo(!hasLogo)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${hasLogo ? "bg-clay-500" : "bg-ink-200"}`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${hasLogo ? "translate-x-5" : "translate-x-0.5"}`}
                    />
                  </div>
                  <span className="text-sm text-ink-600">
                    {hasLogo ? "On" : "Off"}
                  </span>
                </label>
              </div>

              {hasLogo && (
                <div className="space-y-4 animate-fade-in opacity-0-init">
                  {/* Placement */}
                  <div>
                    <label className="text-xs text-ink-400 mb-2 block">
                      Placement
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: "chest", label: "Left Chest", api: "left_chest" },
                        {
                          id: "back",
                          label: "Right Chest",
                          api: "right_chest",
                        },
                        { id: "sleeve", label: "Sleeve", api: "left_chest" },
                      ].map((pos) => (
                        <button
                          key={pos.id}
                          onClick={() => setLogoPosition(pos.id)}
                          className={`py-2 text-sm rounded-lg border transition-all ${logoPosition === pos.id ? "border-clay-500 bg-clay-50 text-clay-700" : "border-ink-100 text-ink-500 hover:border-ink-300"}`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="text-xs text-ink-400 mb-2 block">
                      Upload Logo{" "}
                      <span className="text-ink-300">
                        (JPG, PNG, WEBP — max 5MB)
                      </span>
                    </label>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleLogoFileChange}
                      className="sr-only"
                    />

                    {!logoUrl ? (
                      <button
                        onClick={() => logoInputRef.current?.click()}
                        disabled={logoUploadLoading}
                        className="w-full border-2 border-dashed border-ink-200 rounded-xl py-6 flex flex-col items-center gap-2 hover:border-ink-400 transition-colors disabled:opacity-50"
                      >
                        {logoUploadLoading ? (
                          <Loader
                            size={20}
                            className="text-ink-400 animate-spin"
                          />
                        ) : (
                          <ImagePlus size={20} className="text-ink-400" />
                        )}
                        <span className="text-sm text-ink-400">
                          {logoUploadLoading
                            ? "Uploading..."
                            : "Click to upload logo"}
                        </span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-sage-50 border border-sage-200 rounded-xl">
                        <Check size={14} className="text-sage-600 shrink-0" />
                        <div className="w-10 h-10 rounded-lg border border-sage-200 bg-white flex items-center justify-center overflow-hidden shrink-0">
                          <img
                            src={logoUrl}
                            alt="Uploaded logo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-sm text-sage-700 flex-1 truncate">
                          Logo uploaded successfully
                        </p>
                        <button
                          onClick={() => {
                            logoInputRef.current.value = "";
                          }}
                          className="text-ink-400 hover:text-ink-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}

                    {logoUploadError && (
                      <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                        <AlertCircle size={11} /> {logoUploadError}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Accessories */}
            <div
              className="bg-white rounded-xl border border-ink-100 p-5 animate-fade-up opacity-0-init"
              style={{ animationDelay: "240ms" }}
            >
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
            <div
              className="bg-white rounded-xl border border-ink-100 p-5 animate-fade-up opacity-0-init"
              style={{ animationDelay: "300ms" }}
            >
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
          </div>

          {/* Right: Cost Panel */}
          <div
            className="space-y-5 animate-fade-up opacity-0-init"
            style={{ animationDelay: "100ms" }}
          >
            <CostSummaryCard />

            {/* Sizes validation warning */}
            {!sizesValid && (
              <div className="flex items-center gap-2 p-3 bg-clay-50 border border-clay-200 rounded-xl">
                <AlertCircle size={14} className="text-clay-500 shrink-0" />
                <p className="text-xs text-clay-600">
                  Enter size quantities before submitting.
                </p>
              </div>
            )}

            {/* API Error */}
            {quoteError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle size={14} className="text-red-500 shrink-0" />
                <p className="text-xs text-red-600">{quoteError}</p>
              </div>
            )}

            {/* Save locally */}
            <button
              onClick={() => setShowSaveModal(true)}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium border transition-all ${saved ? "bg-sage-50 border-sage-300 text-sage-700" : "border-ink-200 text-ink-700 hover:border-ink-400"}`}
            >
              {saved ? (
                <>
                  <Check size={15} /> Saved!
                </>
              ) : (
                <>
                  <Save size={15} /> Save Locally
                </>
              )}
            </button>

            {/* Generate Result — calls API */}
            <button
              onClick={handleGenerateResult}
              disabled={quoteLoading || !sizesValid || (hasLogo && !logoUrl)}
              className="w-full flex items-center justify-center gap-2 bg-clay-500 text-white py-3 rounded-xl font-medium hover:bg-clay-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {quoteLoading ? (
                <>
                  <Loader size={15} className="animate-spin" /> Calculating...
                </>
              ) : (
                <>
                  Generate Result <ArrowRight size={15} />
                </>
              )}
            </button>

            {hasLogo && !logoUrl && (
              <p className="text-xs text-center text-clay-500 flex items-center justify-center gap-1">
                <Upload size={11} /> Upload logo to continue
              </p>
            )}

            {/* Quick summary */}
            <div className="bg-ink-50 rounded-xl p-4 space-y-2">
              <p className="text-xs uppercase tracking-widest text-ink-400 mb-3">
                Quick Summary
              </p>
              {[
                {
                  label: "Fabric",
                  value: `Rs. ${displayedCost.breakdown.fabric.toLocaleString()}`,
                },
                {
                  label: "Stitching",
                  value: `Rs. ${displayedCost.breakdown.stitching.toLocaleString()}`,
                },
                {
                  label: "Accessories",
                  value: `Rs. ${displayedCost.breakdown.accessories.toLocaleString()}`,
                },
                {
                  label: "Packaging",
                  value: `Rs. ${displayedCost.breakdown.packaging.toLocaleString()}`,
                },
                {
                  label: "Wastage + Margin",
                  value: `Rs. ${(displayedCost.totalPerUnit - displayedCost.subtotal).toLocaleString()}`,
                },
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
            <h3 className="font-display text-lg font-semibold text-ink-900 mb-4">
              Save Design
            </h3>
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
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 py-2.5 text-sm border border-ink-200 rounded-lg text-ink-600 hover:bg-ink-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!designName.trim()}
                className="flex-1 py-2.5 text-sm bg-ink-900 text-cream rounded-lg font-medium hover:bg-ink-700 transition-colors disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
