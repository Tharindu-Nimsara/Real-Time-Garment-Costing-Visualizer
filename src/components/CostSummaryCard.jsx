import { useApp } from "../context/AppContext";
import { TrendingUp } from "lucide-react";

function Row({ label, value, bold = false, accent = false }) {
  return (
    <div className={`flex justify-between items-center py-1.5 ${bold ? "border-t border-ink-200 mt-1 pt-3" : ""}`}>
      <span className={`text-sm ${bold ? "font-medium text-ink-800" : "text-ink-500"}`}>{label}</span>
      <span className={`font-mono text-sm ${bold ? "font-semibold text-ink-900 text-base" : accent ? "text-clay-600" : "text-ink-700"}`}>
        Rs. {value.toLocaleString()}
      </span>
    </div>
  );
}

export default function CostSummaryCard({ compact = false }) {
  const { currentCost, quantity } = useApp();
  const { breakdown, subtotal, marginAmount, totalPerUnit, totalForQuantity } = currentCost;

  if (compact) {
    return (
      <div className="bg-ink-900 rounded-xl p-4 text-cream">
        <p className="text-ink-400 text-xs uppercase tracking-widest mb-1">Unit Cost</p>
        <p className="font-mono text-2xl font-semibold">Rs. {totalPerUnit.toLocaleString()}</p>
        <p className="text-ink-400 text-xs mt-1">× {quantity.toLocaleString()} units = <span className="text-sage-300">Rs. {totalForQuantity.toLocaleString()}</span></p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-ink-100 overflow-hidden">
      {/* Header */}
      <div className="bg-ink-900 px-4 py-3 flex items-center justify-between">
        <span className="text-cream font-display text-sm font-semibold tracking-wide">Cost Breakdown</span>
        <TrendingUp size={14} className="text-clay-400" />
      </div>

      {/* Rows */}
      <div className="px-4 py-3 space-y-0.5">
        <Row label="Fabric (per unit)" value={breakdown.fabric} />
        <Row label="Stitching" value={breakdown.stitching} />
        <Row label="Accessories" value={breakdown.accessories} />
        <Row label="Packaging" value={breakdown.packaging} />
        <div className="flex justify-between items-center py-1.5 border-t border-ink-100 mt-1 pt-2">
          <span className="text-sm text-ink-500">Subtotal</span>
          <span className="font-mono text-sm text-ink-700">Rs. {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-sm text-clay-500">Margin</span>
          <span className="font-mono text-sm text-clay-500">+ Rs. {marginAmount.toLocaleString()}</span>
        </div>

        {/* Total per unit */}
        <div className="bg-ink-50 rounded-lg px-3 py-2.5 mt-2 flex justify-between items-center">
          <span className="text-sm font-medium text-ink-800">Per unit</span>
          <span className="font-mono font-bold text-ink-900 text-base">Rs. {totalPerUnit.toLocaleString()}</span>
        </div>

        {/* Total for order */}
        <div className="bg-sage-50 rounded-lg px-3 py-2.5 flex justify-between items-center">
          <span className="text-sm font-medium text-sage-700">× {quantity.toLocaleString()} units</span>
          <span className="font-mono font-bold text-sage-700 text-base">Rs. {totalForQuantity.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
