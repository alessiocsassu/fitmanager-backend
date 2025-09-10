const { 
  saveMacro,
  getAllMacros,
  getMacroById,
  updateMacro,
  deleteMacro,
} = require('../services/macrosService');

const createMacro = async (req, res) => {
  try {
    const { date, carbs, protein, fats } = req.body;
    const userId = req.user.id || req.user._id;
    const newMacro = await saveMacro(userId, date, carbs, protein, fats);
    res.status(201).json(newMacro);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create macro entry' });
  }
};

const getMacros = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const macros = await getAllMacros(userId);
    res.status(200).json(macros);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve macro entries' });
  }
};

const getMacro = async (req, res) => {
  try {
    const { id } = req.params;
    const macro = await getMacroById(id);
    if (!macro) {
      return res.status(404).json({ error: 'Macro entry not found' });
    }
    res.status(200).json(macro);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve macro entry' });
  }
};

const updateMacroEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, carbs, protein, fats } = req.body;
    const updatedMacro = await updateMacro(id, date, carbs, protein, fats);
    if (!updatedMacro) {
      return res.status(404).json({ error: 'Macro entry not found' });
    }
    res.status(200).json(updatedMacro);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update macro entry' });
  }
};

const deleteMacroEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMacro = await deleteMacro(id);
    if (!deletedMacro) {
      return res.status(404).json({ error: 'Macro entry not found' });
    }
    res.status(200).json({ message: 'Macro entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete macro entry' });
  }
};

module.exports = {
  createMacro,
  getMacros,
  getMacro,
  updateMacroEntry,
  deleteMacroEntry,
};