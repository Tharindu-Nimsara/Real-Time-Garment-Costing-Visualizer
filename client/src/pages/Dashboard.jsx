import { Link, useNavigate } from "react-router-dom";
import { Plus, Trash2, ArrowRight, TrendingUp, Package, Users, DollarSign } from "lucide-react";
import { useApp } from "../context/AppContext";
import GarmentPreview from "../components/GarmentPreview";

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-xl border border-ink-100 p-5 flex items-start gap-4 animate-fade-up opacity-0-init">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-ink-400 text-xs uppercase tracking-widest mb-0.5">{label}</p>
        <p className="font-display text-xl font-semibold text-ink-900">{value}</p>
        {sub && <p className="text-ink-400 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { designs, loadDesign, deleteDesign } = useApp();
  const navigate = useNavigate();

  const totalOrders = designs.reduce((s, d) => s + d.quantity, 0);
  const totalValue = designs.reduce((s, d) => s + d.cost.totalForQuantity, 0);
  const buyers = [...new Set(designs.map((d) => d.buyerName).filter(Boolean))];

  const handleLoad = (design) => {
    loadDesign(design);
    navigate("/design");
  };

  return (
    <div className="min-h-screen bg-cream pt-14">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-end justify-between mb-8 animate-fade-up opacity-0-init">
          <div>
            <p className="text-ink-400 text-sm uppercase tracking-widest mb-1">Garment Costing System</p>
            <h1 className="font-display text-4xl font-semibold text-ink-900 leading-tight">Dashboard</h1>
          </div>
          <Link
            to="/design"
            className="flex items-center gap-2 bg-ink-900 text-cream px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-ink-700 transition-colors"
          >
            <Plus size={15} />
            New Design
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
          style={{ animationDelay: "100ms" }}>
          <StatCard icon={Package} label="Designs" value={designs.length} color="bg-clay-50 text-clay-500" />
          <StatCard icon={TrendingUp} label="Total Orders" value={totalOrders.toLocaleString()} sub="units" color="bg-sage-50 text-sage-500" />
          <StatCard icon={DollarSign} label="Total Value" value={`Rs. ${(totalValue / 1000).toFixed(0)}K`} color="bg-ink-50 text-ink-500" />
          <StatCard icon={Users} label="Buyers" value={buyers.length} sub={buyers.slice(0, 2).join(", ")} color="bg-clay-50 text-clay-400" />
        </div>

        {/* Workflow Guide */}
        <div className="bg-ink-900 rounded-xl p-6 mb-10 animate-fade-up opacity-0-init" style={{ animationDelay: "200ms" }}>
          <p className="text-ink-400 text-xs uppercase tracking-widest mb-4">How it works</p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {[
              { step: "01", title: "Design Garment", desc: "Choose type, fabric, color & logo", to: "/design" },
              { step: "02", title: "Set Costs", desc: "Fabric, stitching, accessories", to: "/costing" },
              { step: "03", title: "Generate Sheet", desc: "Export buyer-ready cost sheet", to: "/result" },
            ].map(({ step, title, desc, to }, i) => (
              <div key={step} className="flex items-center gap-4 flex-1">
                <Link to={to} className="group flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 bg-clay-500 rounded-lg flex items-center justify-center font-mono text-xs text-white shrink-0">
                    {step}
                  </div>
                  <div>
                    <p className="text-cream text-sm font-medium">{title}</p>
                    <p className="text-ink-400 text-xs">{desc}</p>
                  </div>
                </Link>
                {i < 2 && <ArrowRight size={16} className="text-ink-600 hidden sm:block shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* Designs Grid */}
        <div>
          <h2 className="font-display text-xl font-semibold text-ink-800 mb-5">Saved Designs</h2>

          {designs.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-ink-200 p-16 text-center">
              <p className="text-ink-400 text-sm">No designs yet.</p>
              <Link to="/design" className="text-clay-500 text-sm underline mt-1 inline-block">Create your first →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {designs.map((design, i) => (
                <div
                  key={design.id}
                  className="bg-white rounded-xl border border-ink-100 overflow-hidden hover:shadow-md transition-shadow animate-fade-up opacity-0-init group"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Preview area */}
                  <div
                    className="h-44 flex items-center justify-center relative"
                    style={{ background: `linear-gradient(135deg, ${design.garmentColor}22, ${design.garmentColor}44)` }}
                  >
                    <GarmentPreview
                      color={design.garmentColor}
                      type={design.garmentType}
                      size={130}
                    />
                    <button
                      onClick={() => deleteDesign(design.id)}
                      className="absolute top-3 right-3 w-7 h-7 bg-white rounded-lg border border-ink-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-200"
                    >
                      <Trash2 size={12} className="text-red-400" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-medium text-ink-900 text-sm leading-tight">{design.name}</h3>
                      <span className="text-xs text-ink-400 font-mono">{design.createdAt}</span>
                    </div>
                    {design.buyerName && (
                      <p className="text-xs text-ink-400 mb-3">{design.buyerName} · {design.quantity.toLocaleString()} pcs</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono text-xs text-ink-400">Unit</p>
                        <p className="font-mono text-sm font-semibold text-ink-900">Rs. {design.cost.totalPerUnit.toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => handleLoad(design)}
                        className="flex items-center gap-1.5 text-xs text-clay-600 hover:text-clay-700 font-medium transition-colors"
                      >
                        Open <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
