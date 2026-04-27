const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require('../services/taskService');

const getTasks = async (req, res) => {
  const tasks = await getAllTasks(req.user, req.query);
  res.json({ success: true, count: tasks.length, data: tasks });
};

const createTaskHandler = async (req, res) => {
  const task = await createTask(req.body, req.user._id);
  res.status(201).json({ success: true, message: 'Task created.', data: task });
};

const updateTaskHandler = async (req, res) => {
  const task = await updateTask(req.params.id, req.body, req.user);
  res.json({ success: true, message: 'Task updated.', data: task });
};

const deleteTaskHandler = async (req, res) => {
  const result = await deleteTask(req.params.id, req.user);
  res.json({ success: true, ...result });
};

const getStats = async (req, res) => {
  const stats = await getTaskStats(req.user);
  res.json({ success: true, data: stats });
};

module.exports = {
  getTasks,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
  getStats,
};
