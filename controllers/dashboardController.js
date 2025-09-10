const { getUserById } = require("../services/userService");
const { getAllWeights } = require("../services/weightsService");
const { getAllMacros } = require("../services/macrosService");
const { getAllHydrations } = require("../services/hydrationsService");

const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;

    // Fetch user profile
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch latest weight entry
    const weights = await getAllWeights(userId);
    const latestWeight = weights.length > 0 ? weights[0] : null;

    // Fetch latest macro entry
    const macros = await getAllMacros(userId);
    const latestMacros = macros.length > 0 ? macros[0] : null;

    // Fetch latest hydration entry
    const hydrations = await getAllHydrations(userId);
    const latestHydration = hydrations.length > 0 ? hydrations[0] : null;

    res.json({
      user,
      latestWeight,
      latestMacros,
      latestHydration,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    next(error);
  }
}

module.exports = {
  getDashboardData,
};