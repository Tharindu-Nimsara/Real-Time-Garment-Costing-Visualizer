import { Schema, model } from "mongoose";

const quoteSchema = new Schema(
  {
    quoteId: { type: String, required: true, unique: true },

    // This creates the relationship to the User collection
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },

    productType: { type: String, required: true },
    tshirtColor: { type: String, default: "" },
    quantity: { type: Number, required: true },

    sizes: [
      {
        size: { type: String, required: true },
        qty: { type: Number, required: true },
      },
    ],

    fabricDetails: {
      fabricName: { type: String, required: true },
      shirtsPerKg: { type: Number, required: true },
    },

    branding: {
      hasLogo: { type: Boolean, default: false },
      logoUrl: { type: String },
      placement: {
        type: String,
        enum: ["left_chest", "right_chest", "none"],
        default: "none",
      },
      dimensions: {
        width: Number,
        height: Number,
      },
    },

    additionalCost: { type: Number, default: 0 },

    costSnapshot: {
      unitFabricCost: Number,
      unitStitchingCost: Number,
      unitTrimsCost: Number,
      unitBrandingCost: Number,
      unitPackagingAndTransport: Number,
      unitAdditionalCost: Number,
      unitWastageCost: Number,
      unitMargin: Number,
      finalUnitPrice: Number,
      totalOrderPrice: Number,
    },
  },
  { timestamps: true },
);

export default model("Quote", quoteSchema);
