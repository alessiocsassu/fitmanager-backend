const Hydrations = require("../models/Hydrations");

const saveHydration = async (userId, date, amount) => {
  const newEntry = new Hydrations({ user: userId, date, amount });
  await newEntry.save();
  return newEntry;
};

const getAllHydrations = async (userId) => {
  return await Hydrations.find({ user: userId }).sort({ date: -1 });
};

const getHydrationById = async (id) => {
  return await Hydrations.findById(id);
};

const updateHydration = async (id, date, amount) => {
  return await Hydrations.findByIdAndUpdate(
    id,
    { date, amount },
    { new: true }
  );
};

const deleteHydration = async (id) => {
  return await Hydrations.findByIdAndDelete(id);
};

module.exports = {
  saveHydration,
  getAllHydrations,
  getHydrationById,
  updateHydration,
  deleteHydration,
};
