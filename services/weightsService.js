const Weights = require('../models/Weights');

const saveWeight = async (userId, date, weight) => {
  const newEntry = new Weights({ user: userId, date, weight });
  await newEntry.save();
  return newEntry;
}

const getAllWeights = async (userId) => {
  return await Weights.find({ user: userId }).sort({ date: -1 });
}

const getWeightById = async (id) => {
  return await Weights.findById(id);
}

const updateWeight = async (id, date, weight) => {
  return await Weights.findByIdAndUpdate(id, { date, weight }, { new: true });
}

const deleteWeight = async (id) => {
  return await Weights.findByIdAndDelete(id);
}

module.exports = {
  saveWeight,
  getAllWeights,
  getWeightById,
  updateWeight,
  deleteWeight,
};