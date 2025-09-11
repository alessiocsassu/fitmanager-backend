const {
  saveMacro,
  getAllMacros,
  getMacroById,
  getLastMacro,
  getTodayMacros,
  getMacrosByDate,
  updateMacro,
  deleteMacro,
} = require("../services/macrosService");

const addMacro = async (req, res, next) => {
  try {
    const { date, carbs, protein, fats } = req.body;
    const userId = req.user.id || req.user._id;
    const newEntry = await saveMacro(userId, date, carbs, protein, fats);
    res.status(201).json(newEntry);
  } catch (error) {
    next(error);
  }
};

const getMacros = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const { last, date } = req.query;

    if (last === "true") {
      const entry = await getLastMacro(userId);
      return res.json(entry ? [entry] : []);
    }

    if (date === "today") {
      const entries = await getTodayMacros(userId);
      return res.json(entries);
    }

    if (date) {
      const entries = await getMacrosByDate(userId, date);
      return res.json(entries);
    }

    const entries = await getAllMacros(userId);
    res.json(entries);
  } catch (error) {
    next(error);
  }
};

const getMacro = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entry = await getMacroById(id);
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json(entry);
  } catch (error) {
    next(error);
  }
};

const updateMacroEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, amount } = req.body;
    const updatedEntry = await updateMacro(id, date, amount);
    if (!updatedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json(updatedEntry);
  } catch (error) {
    next(error);
  }
};

const deleteMacroEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedEntry = await deleteMacro(id);
    if (!deletedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json({ message: "Entry deleted", entry: deletedEntry });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addMacro,
  getMacros,
  getMacro,
  updateMacroEntry,
  deleteMacroEntry,
};