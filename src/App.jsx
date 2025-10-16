import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Protected routes
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

// User pages
import Home from './components/user/Home';
import Login from './components/user/Login';
import Register from './components/user/Register';
import UserDashboard from './components/user/UserDashboard';
import UserFileComplaint from './components/user/UserFileComplaint';
import UserTrackComplaint from './components/user/UserTrackComplaint';

// Admin pages
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsers from './components/admin/AdminUsers';
import AdminComplaints from './components/admin/AdminComplaints';
import AdminDailyActivity from './components/admin/AdminDailyActivity';
import AdminResolved from './components/admin/AdminResolved';

function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Admin Login */}
                <Route path="/admin-login" element={<AdminLogin />} />

                {/* User Routes */}
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/file-complaint" element={<UserFileComplaint />} />
                <Route path="/track-complaint" element={<UserTrackComplaint />} />

                {/* Admin Protected Routes */}
                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedAdminRoute>
                            <AdminDashboard />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin-users"
                    element={
                        <ProtectedAdminRoute>
                            <AdminUsers />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin-complaints"
                    element={
                        <ProtectedAdminRoute>
                            <AdminComplaints />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin-daily-activity"
                    element={
                        <ProtectedAdminRoute>
                            <AdminDailyActivity />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin-resolved"
                    element={
                        <ProtectedAdminRoute>
                            <AdminResolved />
                        </ProtectedAdminRoute>
                    }
                />

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
