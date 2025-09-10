const {
  getUserById,
  updateUser,
  deleteUser,
} = require('../services/userService');

const getUser = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    next(error);
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const {
      username,
      dateOfBirth,
      sex,
      height,
      initialWeight,
      targetWeight,
      activityLevel
    } = req.body;

    if (username) {
      const existing = await getUserById(username);
      if (existing && existing._id.toString() !== userId) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    const updatedData = {
      username,
      dateOfBirth,
      sex,
      height,
      initialWeight,
      targetWeight,
      activityLevel
    };

    const updatedUser = await updateUser(userId, updatedData);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    next(error);
  }
};

const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const deletedUser = await deleteUser(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    next(error);
  }
};

module.exports = {
  getUser,
  updateUserProfile,
  deleteUserAccount,
};