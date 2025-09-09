const mongoose = require("mongoose");

const hydrationsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true }, // in ml
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hydrations", hydrationsSchema);