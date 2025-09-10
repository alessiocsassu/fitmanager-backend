const Macros = require('../models/Macros');

const saveMacro = async (userId, date, carbs, protein, fats) => {
  const newEntry = new Macros({ user: userId, date, carbs, protein, fats });
  await newEntry.save();
  return newEntry;
};

const getAllMacros = async (userId) => {
  return await Macros.find({ user: userId }).sort({ date: -1 });
};

const getMacroById = async (id) => {
  return await Macros.findById(id);
};

const updateMacro = async (id, date, carbs, protein, fats) => {
  return await Macros.findByIdAndUpdate(
    id,
    { date, carbs, protein, fats },
    { new: true }
  );
};

const deleteMacro = async (id) => {
  return await Macros.findByIdAndDelete(id);
};

module.exports = {
  saveMacro,
  getAllMacros,
  getMacroById,
  updateMacro,
  deleteMacro,
};