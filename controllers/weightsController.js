const {
  saveWeight,
  getAllWeights,
  getWeightById,
  getLastWeight,
  updateWeight,
  deleteWeight,
} = require('../services/weightsService');

const addWeight = async (req, res, next) => {
  try {
    const { date, weight } = req.body;
    const userId = req.user.id || req.user._id;
    const newEntry = await saveWeight(userId, date, weight);
    res.status(201).json(newEntry);
  } catch (error) {
    next(error);
  }
};

const getWeights = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const { last } = req.query;

    if (last === "true") {
      const entry = await getLastWeight(userId);
      return res.json(entry ? [entry] : []);
    }

    const entries = await getAllWeights(userId);
    res.json(entries);
  } catch (error) {
    next(error);
  }
};

const getWeight = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entry = await getWeightById(id);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json(entry);
  } catch (error) {
    next(error);
  }
};

const updateWeightEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, weight } = req.body;
    const updatedEntry = await updateWeight(id, date, weight);
    if (!updatedEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json(updatedEntry);
  } catch (error) {
    next(error);
  }
};

const deleteWeightEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedEntry = await deleteWeight(id);
    if (!deletedEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    next(error);
  }
};

const deleteLastWeightEntry = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const last = await getLastWeight(userId);
    if (!last) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    await deleteWeight(last._id);
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addWeight,
  getWeights,
  getWeight,
  updateWeightEntry,
  deleteWeightEntry,
  deleteLastWeightEntry,
};
