import React, { createContext, useContext, useState, useCallback } from "react";
import {
  calculateCost,
  ACCESSORIES,
  PACKAGING,
  DEFAULT_MARGIN,
  DEFAULT_SHIRTS_PER_KG,
} from "../data/costData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Design state
  const [garmentType, setGarmentType] = useState("crewneck_tee");
  const [garmentColor, setGarmentColor] = useState("#FFFFFF");
  const [hasLogo, setHasLogo] = useState(false);
  const [logoPosition, setLogoPosition] = useState("chest"); // chest | back | sleeve

  // Costing state
  const [fabricType, setFabricType] = useState("single_jersey");
  const [fabricMaterial, setFabricMaterial] = useState("cotton");
  const [shirtsPerKg, setShirtsPerKg] = useState(DEFAULT_SHIRTS_PER_KG);
  const [stitchingId, setStitchingId] = useState("crewneck_short");
  const [selectedAccessories, setSelectedAccessories] = useState(
    ACCESSORIES.filter((a) => a.included).map((a) => a.id)
  );
  const [selectedPackaging, setSelectedPackaging] = useState(
    PACKAGING.filter((p) => p.included).map((p) => p.id)
  );
  const [margin, setMargin] = useState(DEFAULT_MARGIN);
  const [quantity, setQuantity] = useState(100);
  const [buyerName, setBuyerName] = useState("");
  const [orderRef, setOrderRef] = useState("");

  // Saved designs list
  const [designs, setDesigns] = useState([
    {
      id: 1,
      name: "Summer Polo – Navy",
      garmentType: "polo",
      garmentColor: "#1B3A6B",
      fabricMaterial: "cotton",
      stitchingId: "polo_collar",
      quantity: 500,
      createdAt: "2026-03-10",
      buyerName: "Marks & Spencer",
      cost: { totalPerUnit: 412.5, totalForQuantity: 206250 },
    },
    {
      id: 2,
      name: "Basic Tee – White",
      garmentType: "crewneck_tee",
      garmentColor: "#FFFFFF",
      fabricMaterial: "poly_cotton",
      stitchingId: "crewneck_short",
      quantity: 1000,
      createdAt: "2026-03-12",
      buyerName: "Next PLC",
      cost: { totalPerUnit: 345.0, totalForQuantity: 345000 },
    },
    {
      id: 3,
      name: "Olive Long Sleeve",
      garmentType: "crewneck_long",
      garmentColor: "#6B7C3A",
      fabricMaterial: "cotton",
      stitchingId: "crewneck_long",
      quantity: 200,
      createdAt: "2026-03-15",
      buyerName: "H&M",
      cost: { totalPerUnit: 438.0, totalForQuantity: 87600 },
    },
  ]);

  const currentCost = calculateCost({
    fabricMaterial,
    shirtsPerKg,
    stitchingId,
    selectedAccessories,
    selectedPackaging,
    margin,
    quantity,
  });

  const toggleAccessory = useCallback((id) => {
    setSelectedAccessories((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }, []);

  const togglePackaging = useCallback((id) => {
    setSelectedPackaging((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }, []);

  const saveDesign = useCallback((name) => {
    const newDesign = {
      id: Date.now(),
      name,
      garmentType,
      garmentColor,
      fabricMaterial,
      stitchingId,
      quantity,
      createdAt: new Date().toISOString().split("T")[0],
      buyerName,
      cost: { ...currentCost },
    };
    setDesigns((prev) => [newDesign, ...prev]);
    return newDesign;
  }, [garmentType, garmentColor, fabricMaterial, stitchingId, quantity, buyerName, currentCost]);

  const loadDesign = useCallback((design) => {
    setGarmentType(design.garmentType);
    setGarmentColor(design.garmentColor);
    setFabricMaterial(design.fabricMaterial);
    setStitchingId(design.stitchingId);
    setQuantity(design.quantity);
    setBuyerName(design.buyerName || "");
  }, []);

  const deleteDesign = useCallback((id) => {
    setDesigns((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        // Design
        garmentType, setGarmentType,
        garmentColor, setGarmentColor,
        hasLogo, setHasLogo,
        logoPosition, setLogoPosition,
        // Costing
        fabricType, setFabricType,
        fabricMaterial, setFabricMaterial,
        shirtsPerKg, setShirtsPerKg,
        stitchingId, setStitchingId,
        selectedAccessories, toggleAccessory,
        selectedPackaging, togglePackaging,
        margin, setMargin,
        quantity, setQuantity,
        buyerName, setBuyerName,
        orderRef, setOrderRef,
        // Computed
        currentCost,
        // Designs
        designs, saveDesign, loadDesign, deleteDesign,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
