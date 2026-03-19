import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./src/config/db.js";
import PricingConfig from "./src/models/PricingConfig.js";

dotenv.config();

/**
 * Default data values mapped from the Garment Cost Sheet [cite: 17]
 */
const defaultPricing = {
  fabrics: [
    { name: "Cotton", pricePerKg: 2100, defaultYieldPerKg: 4 },
    { name: "Poly Cotton", pricePerKg: 1650, defaultYieldPerKg: 4 },
    { name: "Polyester", pricePerKg: 1550, defaultYieldPerKg: 4 },
  ],
  stitching: {
    crewneckLongSleeves: 180,
    crewneckShortSleeves: 150,
    poloCollar: 250,
  },
  trims: {
    generalTrims: 15,
    buttons: 5,
    fusing: 8.5,
    label: 2.5,
    tags: 6.5,
    tagCode: 1,
  },
  packagingAndTransport: {
    polybag: 5,
    transport: 8,
  },
  embroideryPricing: [
    { width: 2, height: 2, cost: 45 },
    { width: 4, height: 4, cost: 90 },
  ],
  wastagePercentage: 0.05,
  defaultMarginPercentage: 0.25,
};

/**
 * Connects to MongoDB, clears existing pricing, and injects defaults.
 */
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing configurations to prevent duplicates
    await PricingConfig.deleteMany();
    console.log("🗑️  Existing pricing data cleared.");

    // Insert the finalized cost sheet data
    await PricingConfig.create(defaultPricing);
    console.log("✅ Default PricingConfig successfully injected!");

    // Close connection after successful seeding
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
