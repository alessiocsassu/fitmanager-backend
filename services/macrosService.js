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

const getLastMacro = async (userId) => {
  return await Macros.findOne({ user: userId }).sort({ date: -1 });
}

const getTodayMacros = async (userId) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return await Macros.find({
    user: userId,
    date: { $gte: start, $lte: end },
  }).sort({ date: -1 });
}

const getMacrosByDate = async (userId, date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return await Macros.find({
    user: userId,
    date: { $gte: start, $lte: end },
  }).sort({ date: -1 });
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
  getLastMacro,
  getTodayMacros,
  getMacrosByDate,
  updateMacro,
  deleteMacro,
};