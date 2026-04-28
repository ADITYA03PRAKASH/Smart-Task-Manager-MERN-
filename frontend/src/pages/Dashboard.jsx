import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_BADGE = {
  todo:        'bg-gray-100 text-gray-600',
  'in-progress': 'bg-blue-100 text-blue-700',
  done:        'bg-green-100 text-green-700',
};
const PRIORITY_BADGE = {
  low:    'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  high:   'bg-red-100 text-red-700',
};

const greet = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const Dashboard = () => {
  const { stats, tasks, loading, fetchStats, fetchTasks } = useTask();
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
    fetchTasks();
  }, [fetchStats, fetchTasks]);

  const recentTasks = tasks.slice(0, 6);
  const completionPct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const STATS = [
    { label: 'Total Tasks',  value: stats.total,      icon: '📋', ringColor: 'bg-blue-50'  },
    { label: 'To Do',        value: stats.todo,        icon: '⏳', ringColor: 'bg-amber-50' },
    { label: 'In Progress',  value: stats.inProgress,  icon: '🔄', ringColor: 'bg-indigo-50'},
    { label: 'Completed',    value: stats.done,        icon: '✅', ringColor: 'bg-green-50' },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Dashboard" />

        <main className="flex-1 p-6 overflow-auto">
          {/* Greeting */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {greet()}, {user?.name?.split(' ')[0]} 👋
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Here's a snapshot of your tasks today.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {STATS.map((s) => (
              <StatsCard key={s.label} {...s} />
            ))}
          </div>

          {/* Progress bar */}
          {stats.total > 0 && (
            <div className="card p-5 mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-700">Overall Completion</p>
                <span className="text-sm font-bold text-blue-600">{completionPct}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-xs text-gray-400">
                <span>{stats.done} completed</span>
                <span>{stats.total - stats.done} remaining</span>
              </div>
            </div>
          )}

          {/* Recent tasks table */}
          <div className="card">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-700">Recent Tasks</h3>
              <Link
                to="/tasks"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : recentTasks.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-2">📝</p>
                <p className="text-sm">No tasks yet.</p>
                <Link
                  to="/tasks"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1 inline-block"
                >
                  Create your first task →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {task.assignedTo
                          ? `Assigned to ${task.assignedTo.name}`
                          : 'Unassigned'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`badge ${PRIORITY_BADGE[task.priority]}`}>
                        {task.priority}
                      </span>
                      <span className={`badge ${STATUS_BADGE[task.status]}`}>
                        {task.status === 'in-progress'
                          ? 'In Progress'
                          : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
