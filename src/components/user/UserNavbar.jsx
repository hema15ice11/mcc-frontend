import { Activity, CheckCircle, FileText, LayoutDashboard, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const API_URL = import.meta.env.VITE_API_URL;
const UserNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logoutUser } = useAuth();

    const handleLogout = async () => {
        await logoutUser('user'); // call the logout function from context
        navigate('/'); // redirect to home page
    };


    const navItems = [
        { path: '/user-dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/file-complaint', label: 'File Complaint', icon: FileText },
        { path: '/track-complaint', label: 'Track Complaint', icon: Activity },
        { path: '/status', label: 'Status', icon: CheckCircle },
    ];

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Left side - Logo & Title */}
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                            <LayoutDashboard className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">User Portal</h1>
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
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${isActive
                                            ? 'bg-blue-500 text-white shadow-md'
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

export default UserNavbar;
