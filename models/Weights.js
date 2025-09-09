const mongoose = require("mongoose");

const weightsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    weight: { type: Number, required: true }, // in kg
}, { timestamps: true });

module.exports = mongoose.model("Weights", weightsSchema);