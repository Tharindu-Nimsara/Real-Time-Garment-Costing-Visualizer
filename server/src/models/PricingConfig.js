import { Schema, model } from "mongoose";

const pricingConfigSchema = new Schema(
  {
    fabrics: [
      {
        name: { type: String, required: true },
        pricePerKg: { type: Number, required: true },
        defaultYieldPerKg: { type: Number, required: true },
      },
    ],
    stitching: {
      crewneckLongSleeves: { type: Number, required: true },
      crewneckShortSleeves: { type: Number, required: true },
      poloCollar: { type: Number, required: true },
    },
    trims: {
      generalTrims: Number,
      buttons: Number,
      fusing: Number,
      label: Number,
      tags: Number,
      tagCode: Number,
    },
    packagingAndTransport: {
      polybag: Number,
      transport: Number,
    },
    embroideryPricing: [
      {
        width: Number,
        height: Number,
        cost: Number,
      },
    ],
    wastagePercentage: { type: Number, default: 0.05 },
    defaultMarginPercentage: { type: Number, default: 0.25 },
  },
  { timestamps: true },
);

export default model("PricingConfig", pricingConfigSchema);
