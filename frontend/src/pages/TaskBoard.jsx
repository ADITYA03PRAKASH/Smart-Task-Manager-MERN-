import { useEffect, useState } from 'react';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import LoadingSpinner from '../components/LoadingSpinner';

const COLUMNS = [
  { key: 'todo',        label: 'To Do',       dot: 'bg-gray-400',  header: 'bg-gray-100'  },
  { key: 'in-progress', label: 'In Progress',  dot: 'bg-blue-500',  header: 'bg-blue-50'   },
  { key: 'done',        label: 'Done',         dot: 'bg-green-500', header: 'bg-green-50'  },
];

const TaskBoard = () => {
  const { tasks, loading, error, fetchTasks, removeTask } = useTask();
  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterPriority, setFilterPriority] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const openCreate = () => { setEditingTask(null); setShowModal(true); };
  const openEdit   = (task) => { setEditingTask(task); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditingTask(null); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await removeTask(id);
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const displayed = filterPriority
    ? tasks.filter((t) => t.priority === filterPriority)
    : tasks;

  const colTasks = (key) => displayed.filter((t) => t.status === key);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Task Board" />

        <main className="flex-1 p-6 overflow-auto">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Task Board</h2>
              <p className="text-gray-500 text-sm mt-0.5">{tasks.length} task{tasks.length !== 1 ? 's' : ''} total</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button onClick={openCreate} className="btn-primary flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Task
              </button>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          {/* Kanban columns */}
          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
              {COLUMNS.map((col) => {
                const items = colTasks(col.key);
                return (
                  <div key={col.key}>
                    {/* Column header */}
                    <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-3 ${col.header}`}>
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${col.dot}`} />
                      <span className="text-sm font-semibold text-gray-700">{col.label}</span>
                      <span className="ml-auto text-xs font-medium text-gray-500 bg-white/80 px-2 py-0.5 rounded-full">
                        {items.length}
                      </span>
                    </div>

                    {/* Cards */}
                    <div className="space-y-3">
                      {items.length === 0 ? (
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                          <p className="text-xs text-gray-400">No tasks here</p>
                        </div>
                      ) : (
                        items.map((task) => (
                          <TaskCard
                            key={task._id}
                            task={task}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                            currentUser={user}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <TaskModal task={editingTask} onClose={closeModal} onSuccess={fetchTasks} />
      )}
    </div>
  );
};

export default TaskBoard;
