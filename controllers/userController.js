const {
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
} = require('../services/userService');

const getUser = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Server error' });
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const {
      username,
      dateOfBirth,
      sex,
      height,
      initialWeight,
      targetWeight,
      workoutsPerWeek,
    } = req.body;

    if (username) {
      const existing = await getUserByUsername(username);
      if (existing && existing._id.toString() !== userId) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    const updatedData = {};
    if (username !== undefined) updatedData.username = username;
    if (dateOfBirth !== undefined && dateOfBirth !== "") updatedData.dateOfBirth = dateOfBirth;
    if (sex !== undefined) updatedData.sex = sex;
    if (height !== undefined) updatedData.height = height;
    if (initialWeight !== undefined) updatedData.initialWeight = initialWeight;
    if (targetWeight !== undefined) updatedData.targetWeight = targetWeight;
    if (workoutsPerWeek !== undefined) updatedData.workoutsPerWeek = workoutsPerWeek;

    const updatedUser = await updateUser(userId, updatedData);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
    next(error);
  }
};

const deleteUserAccount = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const deletedUser = await deleteUser(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: 'Server error' });
    next(error);
  }
};

module.exports = {
  getUser,
  updateUserProfile,
  deleteUserAccount,
};