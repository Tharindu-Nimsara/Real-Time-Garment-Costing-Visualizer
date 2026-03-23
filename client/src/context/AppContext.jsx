import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import {
  calculateCost,
  ACCESSORIES,
  PACKAGING,
  DEFAULT_MARGIN,
  DEFAULT_SHIRTS_PER_KG,
} from "../data/costData";
import {
  quotesAPI,
  GARMENT_TYPE_MAP,
  LOGO_PLACEMENT_MAP,
} from "../services/api";
import { useAuth } from "./AuthContext";

const AppContext = createContext(null);

const DEFAULT_SIZES = [
  { size: "S", qty: 0 },
  { size: "M", qty: 0 },
  { size: "L", qty: 0 },
  { size: "XL", qty: 0 },
];

export function AppProvider({ children }) {
  const { isLoggedIn } = useAuth();

  // Design state
  const [garmentType, setGarmentType] = useState("crewneck_tee");
  const [garmentColor, setGarmentColor] = useState("#FFFFFF");
  const [hasLogo, setHasLogo] = useState(false);
  const [logoPosition, setLogoPosition] = useState("chest");
  const [logoFile, setLogoFile] = useState(null); // File object from input
  const [logoUrl, setLogoUrl] = useState(""); // Cloudinary URL after upload
  const [logoUploadLoading, setLogoUploadLoading] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState("");

  // Costing state
  const [fabricType, setFabricType] = useState("single_jersey");
  const [fabricMaterial, setFabricMaterial] = useState("cotton");
  const [shirtsPerKg, setShirtsPerKg] = useState(DEFAULT_SHIRTS_PER_KG);
  const [stitchingId, setStitchingId] = useState("crewneck_short");
  const [selectedAccessories, setSelectedAccessories] = useState(
    ACCESSORIES.filter((a) => a.included).map((a) => a.id),
  );
  const [selectedPackaging, setSelectedPackaging] = useState(
    PACKAGING.filter((p) => p.included).map((p) => p.id),
  );
  const [margin, setMargin] = useState(DEFAULT_MARGIN);
  const [sizes, setSizes] = useState(DEFAULT_SIZES);
  const [additionalCost, setAdditionalCost] = useState(0);

  const sizesTotal = sizes.reduce((s, r) => s + (parseInt(r.qty) || 0), 0);
  const quantity = sizesTotal;

  // API state
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [lastQuoteResult, setLastQuoteResult] = useState(null);

  // Saved designs (populated from API responses)
  const [designs, setDesigns] = useState([]);

  const PRODUCT_TYPE_TO_GARMENT = {
    crewneckShortSleeves: "crewneck_tee",
    crewneckLongSleeves: "crewneck_long",
    poloCollar: "polo",
  };

  const FABRIC_NAME_TO_MATERIAL = {
    Cotton: "cotton",
    "Poly Cotton": "poly_cotton",
    Polyester: "polyester",
  };

  const COLOR_NAME_TO_HEX = {
    white: "#FFFFFF",
    cream: "#FFF8E7",
    black: "#1A1A1A",
    navy: "#1B3A6B",
    royal_blue: "#2563EB",
    "royal blue": "#2563EB",
    sky_blue: "#7DD3FC",
    "sky blue": "#7DD3FC",
    sage: "#84A98C",
    olive: "#6B7C3A",
    burgundy: "#7C2D12",
    red: "#DC2626",
    mustard: "#D97706",
    charcoal: "#374151",
  };

  const resolveQuoteColor = useCallback((quote) => {
    const rawColor =
      quote?.tshirtColor ||
      quote?.tShirtColor ||
      quote?.garmentColor ||
      quote?.color ||
      "";

    if (typeof rawColor !== "string" || !rawColor.trim()) {
      return "#FFFFFF";
    }

    const normalized = rawColor.trim();
    if (normalized.startsWith("#")) {
      return normalized;
    }

    return COLOR_NAME_TO_HEX[normalized.toLowerCase()] || "#FFFFFF";
  }, []);

  const mapQuoteToDesign = useCallback(
    (quote) => {
      const garmentId =
        PRODUCT_TYPE_TO_GARMENT[quote.productType] || "crewneck_tee";
      const materialId =
        FABRIC_NAME_TO_MATERIAL[quote.fabricDetails?.fabricName] || "cotton";

      return {
        id: quote._id,
        name: `${garmentId} – Quote`,
        garmentType: garmentId,
        garmentColor: resolveQuoteColor(quote),
        fabricMaterial: materialId,
        stitchingId:
          garmentId === "crewneck_long"
            ? "crewneck_long"
            : garmentId === "polo"
              ? "polo_collar"
              : "crewneck_short",
        quantity: quote.quantity || 0,
        createdAt: quote.createdAt
          ? new Date(quote.createdAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        cost: {
          totalPerUnit: quote.costSnapshot?.finalUnitPrice || 0,
          totalForQuantity: quote.costSnapshot?.totalOrderPrice || 0,
        },
        costSnapshot: quote.costSnapshot,
      };
    },
    [resolveQuoteColor],
  );

  useEffect(() => {
    if (!isLoggedIn) {
      setDesigns([]);
      return;
    }

    const loadMyQuotes = async () => {
      try {
        const { data } = await quotesAPI.getMyQuotes();
        setDesigns((data || []).map(mapQuoteToDesign));
      } catch {
        setDesigns([]);
      }
    };

    loadMyQuotes();
  }, [isLoggedIn, mapQuoteToDesign]);

  // Local cost calculation (instant UI feedback)
  const currentCost = calculateCost({
    fabricMaterial,
    shirtsPerKg,
    stitchingId,
    selectedAccessories,
    selectedPackaging,
    margin,
    quantity,
    additionalCost,
  });

  const displayedCost = useMemo(() => {
    const snapshot = lastQuoteResult?.costSnapshot;
    if (!snapshot) return currentCost;

    const unitFabricCost = snapshot.unitFabricCost || 0;
    const unitStitchingCost = snapshot.unitStitchingCost || 0;
    const unitTrimsCost = snapshot.unitTrimsCost || 0;
    const unitBrandingCost = snapshot.unitBrandingCost || 0;
    const unitPackagingAndTransport = snapshot.unitPackagingAndTransport || 0;
    const unitAdditionalCost = snapshot.unitAdditionalCost || 0;
    const unitWastageCost = snapshot.unitWastageCost || 0;
    const unitMargin = snapshot.unitMargin || 0;
    const finalUnitPrice = snapshot.finalUnitPrice || 0;

    const subtotal =
      unitFabricCost +
      unitStitchingCost +
      unitTrimsCost +
      unitBrandingCost +
      unitPackagingAndTransport +
      unitAdditionalCost +
      unitWastageCost;

    return {
      ...currentCost,
      breakdown: {
        fabric: unitFabricCost,
        stitching: unitStitchingCost,
        accessories: unitTrimsCost + unitBrandingCost,
        packaging: unitPackagingAndTransport,
        additional: unitAdditionalCost,
        margin: unitMargin,
      },
      subtotal,
      marginAmount: unitMargin,
      totalPerUnit: finalUnitPrice,
      totalForQuantity: snapshot.totalOrderPrice || finalUnitPrice * quantity,
    };
  }, [currentCost, lastQuoteResult, quantity]);

  // Validation: at least one size qty must be entered
  const sizesValid = quantity > 0;

  // ── Logo Upload ────────────────────────────────────────
  const uploadLogo = useCallback(async (file) => {
    if (!file) return;
    setLogoUploadLoading(true);
    setLogoUploadError("");
    try {
      const { data } = await quotesAPI.uploadLogo(file);
      setLogoUrl(data.logoUrl);
      setLogoFile(file);
      return data.logoUrl;
    } catch (err) {
      const msg = err.response?.data?.message || "Logo upload failed.";
      setLogoUploadError(msg);
      return null;
    } finally {
      setLogoUploadLoading(false);
    }
  }, []);

  // ── Submit Quote to API ────────────────────────────────
  const submitQuote = useCallback(async () => {
    setQuoteLoading(true);
    setQuoteError("");
    try {
      const payload = {
        productType: GARMENT_TYPE_MAP[garmentType] || "crewneckShortSleeves",
        tshirtColor: garmentColor,
        fabricName:
          fabricMaterial === "cotton"
            ? "Cotton"
            : fabricMaterial === "poly_cotton"
              ? "Poly Cotton"
              : "Polyester",
        quantity,
        shirtsPerKg,
        branding: {
          hasLogo,
          logoUrl: hasLogo && logoUrl ? logoUrl : "",
          placement: hasLogo
            ? LOGO_PLACEMENT_MAP[logoPosition] || "left_chest"
            : "none",
          dimensions: { width: 2, height: 2 },
        },
        additionalCost: additionalCost || 0,
        sizes: sizes.map((s) => ({ size: s.size, qty: parseInt(s.qty) || 0 })),
      };

      const { data } = await quotesAPI.calculate(payload);
      setLastQuoteResult(data);

      // Save to local designs list using API response
      const newDesign = {
        id: data._id || Date.now(),
        name: `${garmentType} – Quote`,
        garmentType,
        garmentColor,
        fabricMaterial,
        stitchingId,
        quantity,
        createdAt: new Date().toISOString().split("T")[0],
        cost: {
          totalPerUnit:
            data.costSnapshot?.finalUnitPrice || currentCost.totalPerUnit,
          totalForQuantity:
            (data.costSnapshot?.finalUnitPrice || currentCost.totalPerUnit) *
            quantity,
        },
        costSnapshot: data.costSnapshot,
      };
      setDesigns((prev) => [newDesign, ...prev]);
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to calculate quote.";
      setQuoteError(msg);
      return { success: false, message: msg };
    } finally {
      setQuoteLoading(false);
    }
  }, [
    garmentType,
    fabricMaterial,
    quantity,
    shirtsPerKg,
    hasLogo,
    logoUrl,
    logoPosition,
    additionalCost,
    sizes,
    garmentColor,
    stitchingId,
    currentCost,
  ]);

  // ── Size helpers ───────────────────────────────────────
  const updateSizeQty = useCallback((sizeLabel, value) => {
    setSizes((prev) =>
      prev.map((s) =>
        s.size === sizeLabel ? { ...s, qty: parseInt(value) || 0 } : s,
      ),
    );
  }, []);

  // ── Accessories / Packaging toggles ───────────────────
  const toggleAccessory = useCallback((id) => {
    setSelectedAccessories((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  }, []);

  const togglePackaging = useCallback((id) => {
    setSelectedPackaging((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }, []);

  // ── Local save (fallback if API not needed) ────────────
  const saveDesign = useCallback(
    (name) => {
      const newDesign = {
        id: Date.now(),
        name,
        garmentType,
        garmentColor,
        fabricMaterial,
        stitchingId,
        quantity,
        createdAt: new Date().toISOString().split("T")[0],
        cost: { ...currentCost },
      };
      setDesigns((prev) => [newDesign, ...prev]);
      return newDesign;
    },
    [
      garmentType,
      garmentColor,
      fabricMaterial,
      stitchingId,
      quantity,
      currentCost,
    ],
  );

  const loadDesign = useCallback((design) => {
    setGarmentType(design.garmentType);
    setGarmentColor(design.garmentColor);
    setFabricMaterial(design.fabricMaterial);
    setStitchingId(design.stitchingId);
  }, []);

  const deleteDesign = useCallback((id) => {
    setDesigns((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        // Design
        garmentType,
        setGarmentType,
        garmentColor,
        setGarmentColor,
        hasLogo,
        setHasLogo,
        logoPosition,
        setLogoPosition,
        logoFile,
        logoUrl,
        logoUploadLoading,
        logoUploadError,
        uploadLogo,
        // Costing
        fabricType,
        setFabricType,
        fabricMaterial,
        setFabricMaterial,
        shirtsPerKg,
        setShirtsPerKg,
        stitchingId,
        setStitchingId,
        selectedAccessories,
        toggleAccessory,
        selectedPackaging,
        togglePackaging,
        margin,
        setMargin,
        quantity,
        sizes,
        updateSizeQty,
        sizesTotal,
        sizesValid,
        additionalCost,
        setAdditionalCost,
        // Computed
        currentCost,
        displayedCost,
        // API
        submitQuote,
        quoteLoading,
        quoteError,
        lastQuoteResult,
        // Designs
        designs,
        saveDesign,
        loadDesign,
        deleteDesign,
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
