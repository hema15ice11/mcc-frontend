import { useEffect, useState } from 'react';
import AdminNavbar from './AdminNavbar';
import { Users } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(`${API_URL}/api/auth/users`, {
          credentials: 'include', // session cookie
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch users: ${res.status}`);
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError('Could not load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <AdminNavbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Users Management</h2>
            </div>

            {loading ? (
                <p className="text-gray-600">Loading users...</p>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : users.length === 0 ? (
                <p className="text-gray-600">No users found.</p>
            ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left border border-gray-200 rounded-lg">
                    <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 border-b">#</th>
                      <th className="px-4 py-2 border-b">Name</th>
                      <th className="px-4 py-2 border-b">Email</th>
                      <th className="px-4 py-2 border-b">Phone</th>
                      <th className="px-4 py-2 border-b">Address</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, idx) => (
                        <tr
                            key={user._id}
                            className="hover:bg-gray-50 border-b border-gray-100"
                        >
                          <td className="px-4 py-2">{idx + 1}</td>
                          <td className="px-4 py-2">{`${user.firstName} ${user.lastName || ''}`}</td>
                          <td className="px-4 py-2">{user.email}</td>
                          <td className="px-4 py-2">{user.phone || '-'}</td>
                          <td className="px-4 py-2">{user.address || '-'}</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            )}
          </div>
        </main>
      </div>
  );
};

export default AdminUsers;
