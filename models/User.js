const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date },
    sex: { type: String, enum: ["M", "F", "O"] },
    height: { type: Number }, // in cm
    initialWeight: { type: Number }, // in kg
    targetWeight: { type: Number }, // in kg
    workoutsPerWeek: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
