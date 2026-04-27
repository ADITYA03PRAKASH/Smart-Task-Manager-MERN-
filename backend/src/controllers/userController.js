const User = require('../models/User');

const getUsers = async (req, res) => {
  const users = await User.find({ isActive: true }).select('name email role createdAt');
  res.json({ success: true, count: users.length, data: users });
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('name email role createdAt');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }
  res.json({ success: true, data: user });
};

const updateUser = async (req, res) => {
  const { name } = req.body;

  if (req.params.id !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized.' });
  }

  const updated = await User.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true, runValidators: true }
  );

  res.json({ success: true, data: updated });
};

module.exports = { getUsers, getUserById, updateUser };
