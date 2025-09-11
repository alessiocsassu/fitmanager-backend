const { getUserById } = require("../services/userService");
const { getAllWeights } = require("../services/weightsService");
const { getAllMacros } = require("../services/macrosService");
const { getTodayHydrations } = require("../services/hydrationsService");

const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;

    // Fetch user profile
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch latest weight entry
    const weights = await getAllWeights(userId);
    const latestWeight = weights.length > 0 ? weights[0] : null;

    // Fetch latest macro entry
    const macros = await getAllMacros(userId);
    const latestMacros = macros.length > 0 ? macros[0] : null;

    // Fetch latest hydration entry
    const todayHydration = await getTodayHydrations(userId);

    res.json({
      user,
      latestWeight,
      latestMacros,
      todayHydrationTotal: todayHydration.reduce((sum, h) => sum + h.amount, 0),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    next(error);
  }
};

module.exports = {
  getDashboardData,
};
