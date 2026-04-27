const express = require('express');
const {
  getTasks,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
  getStats,
} = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/stats', getStats);
router.route('/').get(getTasks).post(createTaskHandler);
router.route('/:id').put(updateTaskHandler).delete(deleteTaskHandler);

module.exports = router;
