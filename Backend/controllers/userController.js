const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) res.json(user);
  else res.status(404).json({ message: "Utilisateur non trouvé" });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const { name, email, isAdmin } = req.body;
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    user.isAdmin = isAdmin ?? user.isAdmin;

    const updatedUser = await user.save();
    res.json({ message: "Utilisateur mis à jour", user: updatedUser });
  } else {
    res.status(404).json({ message: "Utilisateur non trouvé" });
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: "Utilisateur supprimé" });
  } else {
    res.status(404).json({ message: "Utilisateur non trouvé" });
  }
});

// @desc    Block or Unblock user
// @route   PUT /api/users/:id/block
// @access  Private/Admin
const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new Error("Utilisateur non trouvé");

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.json({
    message: user.isBlocked
      ? "Utilisateur bloqué avec succès"
      : "Utilisateur débloqué avec succès",
    isBlocked: user.isBlocked,
  });
});

// EXPORTS
module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleBlockUser,
};
