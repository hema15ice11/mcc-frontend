import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, LayoutDashboard, Users, FileText, Activity, CheckCircle, LogOut } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, loading, logoutUser } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/admin-login', { replace: true });
  };

  const navItems = [
    { path: '/admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin-users', label: 'Users', icon: Users },
    { path: '/admin-complaints', label: 'Complaints', icon: FileText },
    { path: '/admin-daily-activity', label: 'Daily Activity', icon: Activity },
    { path: '/admin-resolved', label: 'Resolved', icon: CheckCircle }
  ];

  // Show nothing while auth is loading
  if (loading) return null;

  // Hide navbar if not admin
  if (!user || !isAdmin) return null;

  return (
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">

            {/* Left side - Logo & Title */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
                <p className="text-sm text-gray-500">Municipal Complaint Management</p>
              </div>
            </div>

            {/* Right side - Navbar + Logout */}
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                      <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                              isActive
                                  ? 'bg-orange-500 text-white shadow-md'
                                  : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                  );
                })}
              </nav>

              <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
  );
};

export default AdminNavbar;
