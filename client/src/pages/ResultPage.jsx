import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import GarmentPreview from "../components/GarmentPreview";
import {
  FABRIC_MATERIALS,
  FABRIC_TYPES,
  STITCHING_OPTIONS,
  ACCESSORIES,
  PACKAGING,
  GARMENT_TYPES,
} from "../data/costData";
import { Printer, ArrowLeft, Download, Scissors } from "lucide-react";

function Row({ label, value, sub }) {
  return (
    <tr className="border-b border-ink-100 last:border-0">
      <td className="py-2.5 text-sm text-ink-500 pr-8 w-1/2">{label}</td>
      <td className="py-2.5 text-sm font-mono text-ink-900 text-right">
        {value}
      </td>
      {sub && (
        <td className="py-2.5 text-xs text-ink-400 text-right pl-3">{sub}</td>
      )}
    </tr>
  );
}

export default function ResultPage() {
  const navigate = useNavigate();
  const printRef = useRef(null);

  const {
    garmentType,
    garmentColor,
    hasLogo,
    logoUrl,
    logoPosition,
    fabricType,
    fabricMaterial,
    stitchingId,
    selectedAccessories,
    selectedPackaging,
    shirtsPerKg,
    quantity,
    displayedCost,
  } = useApp();

  const material = FABRIC_MATERIALS.find((m) => m.id === fabricMaterial);
  const fabric = FABRIC_TYPES.find((f) => f.id === fabricType);
  const stitching = STITCHING_OPTIONS.find((s) => s.id === stitchingId);
  const garment = GARMENT_TYPES.find((g) => g.id === garmentType);
  const activeAccessories = ACCESSORIES.filter((a) =>
    selectedAccessories.includes(a.id),
  );
  const activePackaging = PACKAGING.filter((p) =>
    selectedPackaging.includes(p.id),
  );

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const ref = `SC-${Date.now().toString().slice(-6)}`;

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-cream pt-14">
      {/* Toolbar (no-print) */}
      <div className="no-print max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
        <button
          onClick={() => navigate("/costing")}
          className="flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-700 transition-colors"
        >
          <ArrowLeft size={13} /> Back to Costing
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-ink-200 rounded-lg text-ink-700 hover:bg-ink-50 transition-colors"
          >
            <Printer size={14} /> Print
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-ink-900 text-cream rounded-lg hover:bg-ink-700 transition-colors"
          >
            <Download size={14} /> Save PDF
          </button>
        </div>
      </div>

      {/* Cost Sheet */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div
          ref={printRef}
          className="print-page bg-white rounded-xl border border-ink-100 overflow-hidden animate-fade-up opacity-0-init"
        >
          {/* Header Bar */}
          <div className="bg-ink-900 px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-clay-500 rounded flex items-center justify-center">
                <Scissors size={14} className="text-white" />
              </div>
              <div>
                <p className="font-display text-cream font-semibold text-lg leading-tight">
                  M.S.R. Apparels
                </p>
                <p className="text-ink-400 text-xs">Garment Costing System</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-cream font-display text-xl font-semibold">
                COST SHEET
              </p>
              <p className="text-ink-400 text-xs font-mono">{ref}</p>
            </div>
          </div>

          {/* Order Info Row */}
          <div className="bg-ink-50 px-8 py-4 flex flex-wrap gap-6 border-b border-ink-100">
            <div>
              <p className="text-xs text-ink-400 uppercase tracking-widest">
                Date
              </p>
              <p className="text-sm text-ink-700 mt-0.5">{today}</p>
            </div>
            <div>
              <p className="text-xs text-ink-400 uppercase tracking-widest">
                Quantity
              </p>
              <p className="text-sm font-mono font-medium text-ink-800 mt-0.5">
                {quantity.toLocaleString()} pcs
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-400 uppercase tracking-widest">
                Reference
              </p>
              <p className="text-sm font-mono text-ink-700 mt-0.5">{ref}</p>
            </div>
          </div>

          {/* Body: Two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-ink-100">
            {/* Left: Garment Spec */}
            <div className="p-8">
              {/* Garment visual */}
              <div className="flex items-center gap-6 mb-8 pb-6 border-b border-ink-100">
                <div
                  className="w-28 h-28 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${garmentColor}22, ${garmentColor}44)`,
                  }}
                >
                  <GarmentPreview
                    color={garmentColor}
                    type={garmentType}
                    hasLogo={hasLogo}
                    logoPosition={logoPosition}
                    size={90}
                  />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-ink-900 leading-tight">
                    {garment?.label || garmentType}
                  </p>
                  <p className="text-xs text-ink-400 mt-1">
                    {material?.label} · {fabric?.label}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-ink-200 shrink-0"
                      style={{ backgroundColor: garmentColor }}
                    />
                    <code className="text-xs font-mono text-ink-500">
                      {garmentColor}
                    </code>
                  </div>
                  {hasLogo && (
                    <span className="inline-flex mt-2 px-2 py-0.5 bg-clay-50 border border-clay-200 text-clay-600 text-xs rounded-full capitalize">
                      Logo – {logoPosition}
                    </span>
                  )}
                  {hasLogo && logoUrl && (
                    <div className="mt-2 w-12 h-12 rounded-lg border border-ink-200 bg-white p-1 overflow-hidden">
                      <img
                        src={logoUrl}
                        alt="Uploaded logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Spec table */}
              <p className="text-xs uppercase tracking-widest text-ink-400 mb-3">
                Specifications
              </p>
              <table className="w-full">
                <tbody>
                  <Row label="Garment Type" value={garment?.label || "—"} />
                  <Row
                    label="Fabric Construction"
                    value={fabric?.label || "—"}
                  />
                  <Row label="Fabric Material" value={material?.label || "—"} />
                  <Row
                    label="Fabric Price"
                    value={`Rs. ${material?.pricePerKg.toLocaleString()}/kg`}
                  />
                  <Row label="Yield" value={`${shirtsPerKg} shirts/kg`} />
                  <Row label="Stitching" value={stitching?.label || "—"} />
                  {hasLogo && (
                    <Row label="Logo Position" value={logoPosition} />
                  )}
                </tbody>
              </table>

              {/* Accessories */}
              {activeAccessories.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-widest text-ink-400 mb-3">
                    Trims & Accessories
                  </p>
                  <table className="w-full">
                    <tbody>
                      {activeAccessories.map((a) => (
                        <Row
                          key={a.id}
                          label={a.label}
                          value={`Rs. ${a.price}`}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Packaging */}
              {activePackaging.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-widest text-ink-400 mb-3">
                    Packaging & Transport
                  </p>
                  <table className="w-full">
                    <tbody>
                      {activePackaging.map((p) => (
                        <Row
                          key={p.id}
                          label={p.label}
                          value={`Rs. ${p.price}`}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right: Cost Breakdown */}
            <div className="p-8 flex flex-col">
              <p className="text-xs uppercase tracking-widest text-ink-400 mb-4">
                Cost Breakdown
              </p>

              <table className="w-full mb-6">
                <tbody>
                  <Row
                    label="Fabric (per unit)"
                    value={`Rs. ${displayedCost.breakdown.fabric.toLocaleString()}`}
                  />
                  <Row
                    label="Stitching"
                    value={`Rs. ${displayedCost.breakdown.stitching.toLocaleString()}`}
                  />
                  <Row
                    label="Accessories"
                    value={`Rs. ${displayedCost.breakdown.accessories.toLocaleString()}`}
                  />
                  <Row
                    label="Packaging"
                    value={`Rs. ${displayedCost.breakdown.packaging.toLocaleString()}`}
                  />
                </tbody>
              </table>

              {/* Subtotal + Service Charges */}
              <div className="border-t border-ink-200 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-ink-500">Subtotal</span>
                  <span className="font-mono text-ink-800">
                    Rs. {displayedCost.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-clay-500">Service Charges</span>
                  <span className="font-mono text-clay-500">
                    + Rs. {displayedCost.marginAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Big total cards */}
              <div className="space-y-3 mt-auto">
                <div className="bg-ink-900 rounded-xl p-5">
                  <p className="text-ink-400 text-xs uppercase tracking-widest mb-1">
                    Unit Price
                  </p>
                  <p className="font-mono text-3xl font-bold text-cream">
                    Rs. {displayedCost.totalPerUnit.toLocaleString()}
                  </p>
                  <p className="text-ink-400 text-xs mt-1">per garment</p>
                </div>

                <div className="bg-sage-600 rounded-xl p-5">
                  <p className="text-sage-200 text-xs uppercase tracking-widest mb-1">
                    Total Order Value ({quantity.toLocaleString()} pcs)
                  </p>
                  <p className="font-mono text-3xl font-bold text-white">
                    Rs. {displayedCost.totalForQuantity.toLocaleString()}
                  </p>
                  <p className="text-sage-200 text-xs mt-1">
                    including configured service charges
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-ink-100 px-8 py-4 flex items-center justify-between bg-ink-50">
            <p className="text-xs text-ink-400">
              Generated by M.S.R. Apparels · {today}
            </p>
            <p className="text-xs text-ink-400 font-mono">Ref: {ref}</p>
          </div>
        </div>

        {/* Actions below sheet */}
        <div className="no-print flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => navigate("/design")}
            className="flex items-center gap-2 px-5 py-2.5 text-sm border border-ink-200 rounded-lg text-ink-700 hover:bg-white transition-colors"
          >
            <ArrowLeft size={13} /> Edit Design
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 text-sm bg-ink-900 text-cream rounded-lg hover:bg-ink-700 transition-colors"
          >
            <Printer size={13} /> Print / Save PDF
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-5 py-2.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
