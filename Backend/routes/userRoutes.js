const express = require('express');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleBlockUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authmiddleware');

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router
  .route('/profile/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

router.route('/:id/block').put(protect, admin, toggleBlockUser);

module.exports = router;
