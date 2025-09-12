const { getUserById } = require("../services/userService");
const { getAllWeights } = require("../services/weightsService");
const { getTodayMacros } = require("../services/macrosService");
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
    const todayMacrosList = await getTodayMacros(userId);
    const totalTodayMacros = todayMacrosList.reduce(
      (acc, macro) => {
        acc.protein += macro.protein || 0;
        acc.carbs += macro.carbs || 0;
        acc.fats += macro.fats || 0;
        return acc;
      },
      { protein: 0, carbs: 0, fats: 0 }
    );

    // Fetch latest hydration entry
    const todayHydration = await getTodayHydrations(userId);

    res.json({
      user,
      latestWeight,
      latestMacros: totalTodayMacros,
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
