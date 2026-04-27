import api from './axios';

export const getTasksApi = (params) => api.get('/tasks', { params });
export const createTaskApi = (data) => api.post('/tasks', data);
export const updateTaskApi = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTaskApi = (id) => api.delete(`/tasks/${id}`);
export const getTaskStatsApi = () => api.get('/tasks/stats');
export const getUsersApi = () => api.get('/users');
