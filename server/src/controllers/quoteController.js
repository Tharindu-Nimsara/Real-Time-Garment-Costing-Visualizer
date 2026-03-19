import PricingConfig from '../models/PricingConfig.js';
import Quote from '../models/Quote.js';

export const calculateAndSaveQuote = async (req, res) => {
  try {
    const { userId, productType, fabricName, quantity, shirtsPerKg, branding, additionalCost, sizes } = req.body;

    // 1. Fetch current pricing rules from DB
    const config = await PricingConfig.findOne();
    const fabric = config.fabrics.find((f) => f.name === fabricName);

    // 2. Unit Cost Calculations
    const unitFabricCost = fabric.pricePerKg / (shirtsPerKg || fabric.defaultYieldPerKg);
    const unitStitchingCost = config.stitching[productType] || 0;
    
    // Sum all individual trims
    const unitTrimsCost = Object.values(config.trims).reduce((a, b) => a + b, 0);
    
    // Find embroidery cost based on dimensions
    let unitBrandingCost = 0;
    if (branding.hasLogo) {
      const tier = config.embroideryPricing.find(
        (p) => p.width === branding.dimensions.width && p.height === branding.dimensions.height
      );
      unitBrandingCost = tier ? tier.cost : config.embroideryPricing[0].cost;
    }

    const unitPackagingAndTransport = config.packagingAndTransport.polybag + config.packagingAndTransport.transport;
    const unitAdditionalCost = (additionalCost || 0) / quantity;

    // 3. Subtotal, Wastage, and Margin
    const subtotal = unitFabricCost + unitStitchingCost + unitTrimsCost + unitBrandingCost + unitPackagingAndTransport + unitAdditionalCost;
    const unitWastageCost = subtotal * config.wastagePercentage;
    const unitMargin = (subtotal + unitWastageCost) * config.defaultMarginPercentage;
    const finalUnitPrice = subtotal + unitWastageCost + unitMargin;

    // 4. Save to Database
    const newQuote = await Quote.create({
      quoteId: `MSR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      userId,
      productType,
      quantity,
      sizes,
      fabricDetails: { fabricName, shirtsPerKg },
      branding,
      additionalCost,
      costSnapshot: {
        unitFabricCost, unitStitchingCost, unitTrimsCost, unitBrandingCost,
        unitPackagingAndTransport, unitAdditionalCost, unitWastageCost, unitMargin,
        finalUnitPrice, totalOrderPrice: finalUnitPrice * quantity
      }
    });

    res.status(201).json(newQuote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};