const Task = require('../models/Task');

const buildUserFilter = (user) =>
  user.role === 'admin'
    ? {}
    : { $or: [{ assignedTo: user._id }, { createdBy: user._id }] };

const getAllTasks = async (user, query = {}) => {
  const filter = buildUserFilter(user);
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;

  return Task.find(filter)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
};

const createTask = async (taskData, createdBy) => {
  const task = await Task.create({ ...taskData, createdBy });
  return task.populate([
    { path: 'assignedTo', select: 'name email' },
    { path: 'createdBy', select: 'name email' },
  ]);
};

const updateTask = async (taskId, updateData, user) => {
  const task = await Task.findById(taskId);
  if (!task) {
    const err = new Error('Task not found.');
    err.statusCode = 404;
    throw err;
  }

  const isOwner = task.createdBy.toString() === user._id.toString();
  const isAssignee = task.assignedTo?.toString() === user._id.toString();

  if (user.role !== 'admin' && !isOwner) {
    if (!isAssignee) {
      const err = new Error('Not authorized to update this task.');
      err.statusCode = 403;
      throw err;
    }
    // Assignees can only change status
    Object.keys(updateData).forEach((k) => {
      if (k !== 'status') delete updateData[k];
    });
  }

  // Only admins can reassign tasks
  if (user.role !== 'admin') delete updateData.assignedTo;

  return Task.findByIdAndUpdate(taskId, updateData, {
    new: true,
    runValidators: true,
  })
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');
};

const deleteTask = async (taskId, user) => {
  const task = await Task.findById(taskId);
  if (!task) {
    const err = new Error('Task not found.');
    err.statusCode = 404;
    throw err;
  }

  if (user.role !== 'admin' && task.createdBy.toString() !== user._id.toString()) {
    const err = new Error('Not authorized to delete this task.');
    err.statusCode = 403;
    throw err;
  }

  await task.deleteOne();
  return { message: 'Task deleted successfully.' };
};

const getTaskStats = async (user) => {
  const filter = buildUserFilter(user);
  const [total, todo, inProgress, done] = await Promise.all([
    Task.countDocuments(filter),
    Task.countDocuments({ ...filter, status: 'todo' }),
    Task.countDocuments({ ...filter, status: 'in-progress' }),
    Task.countDocuments({ ...filter, status: 'done' }),
  ]);
  return { total, todo, inProgress, done };
};

module.exports = { getAllTasks, createTask, updateTask, deleteTask, getTaskStats };
