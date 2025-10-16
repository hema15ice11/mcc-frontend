import { CheckCircle, Clock, FileText, Users, AlertTriangle, TrendingUp, MapPin, Download, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminNavbar from './AdminNavbar';

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pending: 0,
    resolved: 0,
    totalUsers: 0,
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [error, setError] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin-login', { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setError('');

        // Complaints data
        const complaintsRes = await fetch(`${API_URL}/api/complaints/all`, {
          credentials: 'include',
        });
        if (!complaintsRes.ok) throw new Error('Failed to fetch complaints');
        const complaintsData = await complaintsRes.json();

        // Users count
        const usersRes = await fetch(`${API_URL}/api/auth/users/count`, {
          credentials: 'include',
        });
        if (!usersRes.ok) throw new Error('Failed to fetch users count');
        const usersData = await usersRes.json();

        // Process data
        const totalComplaints = complaintsData.length;
        const pending = complaintsData.filter(c => c.status === 'Pending').length;
        const resolved = complaintsData.filter(c => c.status === 'Completed').length;
        const totalUsers = usersData.count || 0;

        // Get recent complaints
        const recent = complaintsData
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        // Calculate category stats
        const categories = {};
        complaintsData.forEach(complaint => {
          categories[complaint.category] = (categories[complaint.category] || 0) + 1;
        });

        const categoryData = Object.entries(categories).map(([name, count]) => ({
          name,
          count,
          percentage: ((count / totalComplaints) * 100).toFixed(1)
        })).sort((a, b) => b.count - a.count).slice(0, 5);

        setStats({
          totalComplaints,
          pending,
          resolved,
          totalUsers,
        });
        setRecentComplaints(recent);
        setCategoryStats(categoryData);

      } catch (err) {
        console.error(err);
        setError(err.message || 'Error fetching dashboard data');
      }
    };

    if (!loading && user && isAdmin) {
      fetchDashboardData();
    }
  }, [user, isAdmin, loading]);

  const handleExportData = async () => {
    try {
      // Fetch all complaints for export
      const complaintsRes = await fetch(`${API_URL}/api/complaints/all`, {
        credentials: 'include',
      });

      if (!complaintsRes.ok) throw new Error('Failed to fetch data for export');
      const complaintsData = await complaintsRes.json();

      // Create CSV content
      const headers = ['ID', 'Title', 'Category', 'Status', 'Priority', 'Created Date', 'User Email'];
      const csvContent = [
        headers.join(','),
        ...complaintsData.map(complaint => [
          complaint._id || complaint.id,
          `"${complaint.title.replace(/"/g, '""')}"`,
          complaint.category,
          complaint.status,
          complaint.priority || 'Medium',
          new Date(complaint.createdAt).toLocaleDateString(),
          complaint.userEmail || 'N/A'
        ].join(','))
      ].join('\n');

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `complaints-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message
      alert('Complaints data exported successfully!');

    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export data. Please try again.');
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  if (!user || !isAdmin) return null;

  const statItems = [
    {
      icon: FileText,
      label: 'Total Complaints',
      value: stats.totalComplaints,
      color: 'bg-blue-500',
      description: 'All registered complaints'
    },
    {
      icon: Clock,
      label: 'Pending',
      value: stats.pending,
      color: 'bg-yellow-500',
      description: 'Awaiting action'
    },
    {
      icon: CheckCircle,
      label: 'Resolved',
      value: stats.resolved,
      color: 'bg-green-500',
      description: 'Successfully closed'
    },
    {
      icon: Users,
      label: 'Total Users',
      value: stats.totalUsers,
      color: 'bg-purple-500',
      description: 'Registered citizens'
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <AdminNavbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.firstName}!</h2>
                <p className="text-gray-600">Municipal complaint management dashboard</p>
              </div>
              {/*<div className="flex items-center space-x-4 mt-4 lg:mt-0">*/}
              {/*  <button*/}
              {/*      onClick={handleExportData}*/}
              {/*      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"*/}
              {/*  >*/}
              {/*    <Download className="h-4 w-4" />*/}
              {/*    <span>Export Data</span>*/}
              {/*  </button>*/}
              {/*</div>*/}
            </div>
            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  {error}
                </div>
            )}
          </div>

          {/* Stats Grid */}
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
            {/* Left Column - Recent Complaints */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Complaints</h3>
                  <button
                      onClick={() => navigate('/admin-complaints')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View All Complaints</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {recentComplaints.length > 0 ? recentComplaints.map((complaint, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{complaint.title}</p>
                            <p className="text-xs text-gray-500">{complaint.category}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(complaint.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority}
                      </span>
                        </div>
                      </div>
                  )) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No complaints found</p>
                      </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Top Categories */}
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Top Categories</h3>
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {categoryStats.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{category.name}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${category.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">{category.count}</span>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
};

export default AdminDashboard;