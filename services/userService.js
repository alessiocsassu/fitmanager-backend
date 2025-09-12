const User = require('../models/User');

const getUserById = async (id) => {
  return await User.findById(id).select('-password');
}

const getUserByUsername = async (username) => {
  return await User.findOne({ username }).select('-password');
}

const updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');
}

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
}

module.exports = {
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
};