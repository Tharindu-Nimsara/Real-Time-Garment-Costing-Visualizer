import PricingConfig from "../models/PricingConfig.js";
import Quote from "../models/Quote.js";
import { getCloudinary } from "../utils/cloudinaryConfig.js";

export const getMyQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(quotes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const uploadLogo = async (req, res) => {
  try {
    const cloudinary = getCloudinary();
    const fileBuffer = req.file?.buffer || req.files?.logo?.data;

    if (!fileBuffer) {
      return res.status(400).json({ message: "No logo file uploaded" });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "garment-quotes/logos",
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        },
      );

      stream.end(fileBuffer);
    });

    return res.status(200).json({
      logoUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const calculateAndSaveQuote = async (req, res) => {
  try {
    const {
      productType,
      tshirtColor,
      fabricName,
      quantity,
      shirtsPerKg,
      branding,
      additionalCost,
      sizes,
    } = req.body;

    const totalSizeQty = (sizes || []).reduce(
      (sum, sizeItem) => sum + (Number(sizeItem?.qty) || 0),
      0,
    );

    if (totalSizeQty !== quantity) {
      return res.status(400).json({
        message:
          "Invalid size distribution: sum of sizes.qty must match quantity",
      });
    }

    // 1. Get the User ID when request is authenticated; keep quote public otherwise
    const userId = req.user?._id;

    // 2. Fetch Pricing Rules
    const config = await PricingConfig.findOne();
    const fabric = config.fabrics.find((f) => f.name === fabricName);

    // 3. Core Calculations
    const unitFabricCost =
      fabric.pricePerKg / (shirtsPerKg || fabric.defaultYieldPerKg);
    const unitStitchingCost = config.stitching[productType] || 0;
    const unitTrimsCost = Object.values(config.trims).reduce(
      (a, b) => a + b,
      0,
    );

    let unitBrandingCost = 0;
    if (branding?.hasLogo) {
      const tier = config.embroideryPricing.find(
        (p) =>
          p.width === branding.dimensions.width &&
          p.height === branding.dimensions.height,
      );
      unitBrandingCost = tier ? tier.cost : 45; // Default to 2x2 price if no match
    }

    const unitPkgTrans =
      config.packagingAndTransport.polybag +
      config.packagingAndTransport.transport;
    const unitAddCost = (additionalCost || 0) / quantity;

    // 4. Totals with Wastage and Margin
    const subtotal =
      unitFabricCost +
      unitStitchingCost +
      unitTrimsCost +
      unitBrandingCost +
      unitPkgTrans +
      unitAddCost;
    const unitWastage = subtotal * config.wastagePercentage;
    const unitMargin =
      (subtotal + unitWastage) * config.defaultMarginPercentage;
    const finalUnitPrice = subtotal + unitWastage + unitMargin;

    // 5. Save Quote
    const newQuote = await Quote.create({
      quoteId: `MSR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      userId, // Linked to the authenticated user
      productType,
      tshirtColor: tshirtColor || "",
      quantity,
      sizes,
      fabricDetails: { fabricName, shirtsPerKg },
      branding,
      additionalCost,
      costSnapshot: {
        unitFabricCost,
        unitStitchingCost,
        unitTrimsCost,
        unitBrandingCost,
        unitPackagingAndTransport: unitPkgTrans,
        unitAdditionalCost: unitAddCost,
        unitWastageCost: unitWastage,
        unitMargin,
        finalUnitPrice,
        totalOrderPrice: finalUnitPrice * quantity,
      },
    });

    res.status(201).json(newQuote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
