const {
  saveHydration,
  getAllHydrations,
  getHydrationById,
  getLastHydration,
  getTodayHydrations,
  getHydrationsByDate,
  updateHydration,
  deleteHydration,
} = require("../services/hydrationsService");

const addHydration = async (req, res, next) => {
  try {
    const { date, amount } = req.body;
    const userId = req.user.id || req.user._id;
    const newEntry = await saveHydration(userId, date, amount);
    res.status(201).json(newEntry);
  } catch (error) {
    next(error);
  }
};

const getHydrations = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const { last, date } = req.query;

    if (last === "true") {
      const entry = await getLastHydration(userId);
      return res.json(entry ? [entry] : []);
    }

    if (date === "today") {
      const entries = await getTodayHydrations(userId);
      return res.json(entries);
    }

    if (date) {
      const entries = await getHydrationsByDate(userId, date);
      return res.json(entries);
    }

    const entries = await getAllHydrations(userId);
    res.json(entries);
  } catch (error) {
    next(error);
  }
};

const getHydration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entry = await getHydrationById(id);
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json(entry);
  } catch (error) {
    next(error);
  }
};

const updateHydrationEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, amount } = req.body;
    const updatedEntry = await updateHydration(id, date, amount);
    if (!updatedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json(updatedEntry);
  } catch (error) {
    next(error);
  }
};

const deleteHydrationEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedEntry = await deleteHydration(id);
    if (!deletedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json({ message: "Entry deleted", entry: deletedEntry });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addHydration,
  getHydrations,
  getHydration,
  updateHydrationEntry,
  deleteHydrationEntry,
};
