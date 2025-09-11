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

const getLastHydration = async (userId) => {
  return await Hydrations.findOne({ user: userId }).sort({ date: -1 });
};

const getTodayHydrations = async (userId) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return await Hydrations.find({
    user: userId,
    date: { $gte: start, $lte: end },
  }).sort({ date: -1 });
};

const getHydrationsByDate = async (userId, date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return await Hydrations.find({
    user: userId,
    date: { $gte: start, $lte: end },
  }).sort({ date: -1 });
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
  getLastHydration,
  getTodayHydrations,
  getHydrationsByDate,
  updateHydration,
  deleteHydration,
};
