import { CheckCircle, Clock, FileText, Users, AlertTriangle, TrendingUp, MapPin, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminNavbar from './AdminNavbar';

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ totalComplaints: 0, pending: 0, resolved: 0, totalUsers: 0 });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate('/admin-login', { replace: true });
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setError('');

        const complaintsRes = await fetch(`${API_URL}/api/complaints/all`, { credentials: 'include' });
        if (!complaintsRes.ok) throw new Error('Failed to fetch complaints');
        const complaintsData = await complaintsRes.json();

        const usersRes = await fetch(`${API_URL}/api/auth/users/count`, { credentials: 'include' });
        if (!usersRes.ok) throw new Error('Failed to fetch users count');
        const usersData = await usersRes.json();

        const totalComplaints = complaintsData.length;
        const pending = complaintsData.filter(c => c.status === 'Pending').length;
        const resolved = complaintsData.filter(c => c.status === 'Completed').length;
        const totalUsers = usersData.count || 0;

        const recent = complaintsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

        const categories = {};
        complaintsData.forEach(c => categories[c.category] = (categories[c.category] || 0) + 1);
        const categoryData = Object.entries(categories)
          .map(([name, count]) => ({ name, count, percentage: ((count / totalComplaints) * 100).toFixed(1) }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setStats({ totalComplaints, pending, resolved, totalUsers });
        setRecentComplaints(recent);
        setCategoryStats(categoryData);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error fetching dashboard data');
      }
    };

    if (!loading && user && isAdmin) fetchDashboardData();
  }, [user, isAdmin, loading]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!user || !isAdmin) return null;

  const getStatusColor = (status) => ({
    'Completed': 'bg-green-100 text-green-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
  }[status] || 'bg-gray-100 text-gray-800');

  const getPriorityColor = (priority) => ({
    'High': 'bg-red-100 text-red-800',
    'Medium': 'bg-orange-100 text-orange-800',
    'Low': 'bg-green-100 text-green-800',
  }[priority] || 'bg-gray-100 text-gray-800');

  const statItems = [
    { icon: FileText, label: 'Total Complaints', value: stats.totalComplaints, color: 'bg-blue-500', description: 'All registered complaints' },
    { icon: Clock, label: 'Pending', value: stats.pending, color: 'bg-yellow-500', description: 'Awaiting action' },
    { icon: CheckCircle, label: 'Resolved', value: stats.resolved, color: 'bg-green-500', description: 'Successfully closed' },
    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'bg-purple-500', description: 'Registered citizens' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.firstName}!</h2>
              <p className="text-gray-600">Municipal complaint management dashboard</p>
            </div>
          </div>
          {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />{error}
          </div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statItems.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-gray-900 mb-1">{stat.label}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Complaints</h3>
              <button onClick={() => navigate('/admin-complaints')} className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                <Eye className="h-4 w-4" /><span>View All Complaints</span>
              </button>
            </div>
            <div className="space-y-4">
              {recentComplaints.length ? recentComplaints.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{c.title}</p>
                      <p className="text-xs text-gray-500">{c.category}</p>
                      <p className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>{c.status}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(c.priority)}`}>{c.priority}</span>
                  </div>
                </div>
              )) : <div className="text-center py-8 text-gray-500"><FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" /><p>No complaints found</p></div>}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Categories</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {categoryStats.map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{cat.name}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${cat.percentage}%` }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{cat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
