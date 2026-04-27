import { createContext, useContext, useState, useCallback } from 'react';
import {
  getTasksApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
  getTaskStatsApi,
  getUsersApi,
} from '../api/taskApi';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getTasksApi(params);
      setTasks(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await getTaskStatsApi();
      setStats(data.data);
    } catch (err) {
      console.error('Stats error:', err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await getUsersApi();
      setUsers(data.data);
    } catch (err) {
      console.error('Users error:', err);
    }
  }, []);

  const addTask = async (taskData) => {
    const { data } = await createTaskApi(taskData);
    setTasks((prev) => [data.data, ...prev]);
    fetchStats();
    return data.data;
  };

  const editTask = async (id, taskData) => {
    const { data } = await updateTaskApi(id, taskData);
    setTasks((prev) => prev.map((t) => (t._id === id ? data.data : t)));
    fetchStats();
    return data.data;
  };

  const removeTask = async (id) => {
    await deleteTaskApi(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
    fetchStats();
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        users,
        loading,
        error,
        fetchTasks,
        fetchStats,
        fetchUsers,
        addTask,
        editTask,
        removeTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTask must be used within TaskProvider');
  return ctx;
};
