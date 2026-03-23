// All costing data sourced from Garment Cost Sheet PDF

export const FABRIC_TYPES = [
  { id: "single_jersey", label: "Single Jersey" },
  { id: "interlock", label: "Interlock" },
  { id: "pique", label: "Pique" },
  { id: "ribs", label: "Ribs" },
];

export const FABRIC_MATERIALS = [
  { id: "cotton", label: "Cotton", pricePerKg: 2100 },
  { id: "poly_cotton", label: "Poly Cotton", pricePerKg: 1650 },
  { id: "polyester", label: "Polyester", pricePerKg: 1550 },
];

// 1 kg = 4 shirts (variable — can be adjusted)
export const DEFAULT_SHIRTS_PER_KG = 4;

export const STITCHING_OPTIONS = [
  { id: "crewneck_long", label: "Crewneck (Long Sleeves)", price: 180 },
  { id: "crewneck_short", label: "Crewneck (Short Sleeves)", price: 150 },
  { id: "polo_collar", label: "Polo Collar", price: 250 },
];

export const ACCESSORIES = [
  { id: "trims", label: "Trims", price: 15, included: true },
  { id: "embroidery", label: "Embroidery (2×2)", price: 45, included: false },
  { id: "buttons", label: "Buttons", price: 5, included: false },
  { id: "fusing", label: "Fusing", price: 8.5, included: false },
  { id: "label", label: "Label", price: 2.5, included: true },
  { id: "tags", label: "Tags", price: 6.5, included: true },
  { id: "tag_code", label: "Tag Code", price: 1, included: true },
];

export const PACKAGING = [
  { id: "polybag", label: "Packaging (Polybag)", price: 5, included: true },
  { id: "transport", label: "Transport", price: 8, included: true },
];

export const GARMENT_COLORS = [
  { id: "white", label: "White", hex: "#FFFFFF" },
  { id: "cream", label: "Cream", hex: "#FFF8E7" },
  { id: "black", label: "Black", hex: "#1a1a1a" },
  { id: "navy", label: "Navy", hex: "#1B3A6B" },
  { id: "royal_blue", label: "Royal Blue", hex: "#2563EB" },
  { id: "sky_blue", label: "Sky Blue", hex: "#7DD3FC" },
  { id: "sage", label: "Sage Green", hex: "#84A98C" },
  { id: "olive", label: "Olive", hex: "#6B7C3A" },
  { id: "burgundy", label: "Burgundy", hex: "#7C2D12" },
  { id: "red", label: "Red", hex: "#DC2626" },
  { id: "mustard", label: "Mustard", hex: "#D97706" },
  { id: "charcoal", label: "Charcoal", hex: "#374151" },
];

export const GARMENT_TYPES = [
  { id: "crewneck_tee", label: "Crewneck T-Shirt", stitching: "crewneck_short" },
  { id: "crewneck_long", label: "Crewneck Long Sleeve", stitching: "crewneck_long" },
  { id: "polo", label: "Polo Shirt", stitching: "polo_collar" },
];

export const DEFAULT_MARGIN = 20; // percentage

export function calculateCost({
  fabricMaterial,
  shirtsPerKg = DEFAULT_SHIRTS_PER_KG,
  stitchingId,
  selectedAccessories = [],
  selectedPackaging = [],
  margin = DEFAULT_MARGIN,
  quantity = 1,
  additionalCost = 0,
}) {
  const material = FABRIC_MATERIALS.find((m) => m.id === fabricMaterial);
  const stitching = STITCHING_OPTIONS.find((s) => s.id === stitchingId);

  const fabricCostPerShirt = material ? material.pricePerKg / shirtsPerKg : 0;
  const stitchingCost = stitching ? stitching.price : 0;

  const accessoryCost = selectedAccessories.reduce((sum, id) => {
    const acc = ACCESSORIES.find((a) => a.id === id);
    return sum + (acc ? acc.price : 0);
  }, 0);

  const packagingCost = selectedPackaging.reduce((sum, id) => {
    const pkg = PACKAGING.find((p) => p.id === id);
    return sum + (pkg ? pkg.price : 0);
  }, 0);

  const extra = parseFloat(additionalCost) || 0;
  const subtotal = fabricCostPerShirt + stitchingCost + accessoryCost + packagingCost + extra;
  const marginAmount = (subtotal * margin) / 100;
  const totalPerUnit = subtotal + marginAmount;

  return {
    fabricCostPerShirt: +fabricCostPerShirt.toFixed(2),
    stitchingCost,
    accessoryCost,
    packagingCost,
    additionalCost: +extra.toFixed(2),
    subtotal: +subtotal.toFixed(2),
    marginAmount: +marginAmount.toFixed(2),
    totalPerUnit: +totalPerUnit.toFixed(2),
    totalForQuantity: +(totalPerUnit * quantity).toFixed(2),
    breakdown: {
      fabric: +fabricCostPerShirt.toFixed(2),
      stitching: stitchingCost,
      accessories: accessoryCost,
      packaging: packagingCost,
      additional: +extra.toFixed(2),
      margin: +marginAmount.toFixed(2),
    },
  };
}
