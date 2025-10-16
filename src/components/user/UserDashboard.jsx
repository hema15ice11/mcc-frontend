import { AlertCircle, CheckCircle, Clock, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserNavbar from './UserNavbar';
const API_URL = import.meta.env.VITE_API_URL;
const UserDashboard = () => {
  const { user, loading } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    notifications: 0,
  });
  const [dailyActivities, setDailyActivities] = useState([]);

  // 🔒 Redirect if user not logged in
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/user-login';
    }
  }, [user, loading]);

  // 📦 Fetch user complaints
  useEffect(() => {
    if (!user || !user._id) return;

    const fetchComplaints = async () => {
      try {
        const res = await fetch(
            `${API_URL}/api/complaints/user/${user._id}`,
            { credentials: 'include' }
        );

        if (!res.ok) throw new Error('Failed to fetch complaints');
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Invalid complaints response:", data);
          setComplaints([]);
          return;
        }

        setComplaints(data);

        const total = data.length;
        const pending = data.filter(c => c.status === 'Pending').length;
        const resolved = data.filter(c => c.status === 'Completed').length;
        const notifications = pending;

        setStats({ total, pending, resolved, notifications });

        const activities = [...data]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(c => ({
              id: c._id,
              text: `Complaint ${c.category} - ${c.subcategory || ''} is ${c.status}`,
              date: new Date(c.createdAt).toLocaleDateString(),
            }));

        setDailyActivities(activities);
      } catch (err) {
        console.error("Error fetching complaints:", err);
        setComplaints([]);
      }
    };

    fetchComplaints();
  }, [user]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!user) return null;

  const statCards = [
    { icon: FileText, label: 'Total Complaints', value: stats.total, color: 'bg-[linear-gradient(135deg,#24E0C0,#3BA6FF,#8A3FFC)]' },
    { icon: Clock, label: 'Pending', value: stats.pending, color: 'bg-yellow-500' },
    { icon: CheckCircle, label: 'Resolved', value: stats.resolved, color: 'bg-green-500' },
    { icon: AlertCircle, label: 'Notifications', value: stats.notifications, color: 'bg-purple-500' },
  ];

  return (
      <div className="min-h-screen bg-gray-50">
        <UserNavbar />

        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          {/* HEADER */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome, <span className="text-transparent bg-clip-text bg-[linear-gradient(135deg,#24E0C0,#3BA6FF,#8A3FFC)]">
              {user.firstName || 'User'}
            </span>!
            </h1>
            <p className="text-gray-600 text-lg">
              Manage and monitor your complaints easily from one place.
            </p>
          </div>

          {/* STATS SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statCards.map((stat, idx) => (
                <div
                    key={idx}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                    <p className="text-4xl font-extrabold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                    <stat.icon className="h-7 w-7" />
                  </div>
                </div>
            ))}
          </div>

          {/* RECENT COMPLAINTS */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-5">Recent Complaints</h2>
            {complaints.length === 0 ? (
                <p className="text-gray-600">No complaints found.</p>
            ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      {/*<th className="px-4 py-3 text-gray-700 font-semibold text-sm">ID</th>*/}
                      <th className="px-4 py-3 text-gray-700 font-semibold text-sm">Category</th>
                      <th className="px-4 py-3 text-gray-700 font-semibold text-sm">Date</th>
                      <th className="px-4 py-3 text-gray-700 font-semibold text-sm">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {complaints.slice(0, 5).map(comp => (
                        <tr key={comp._id} className="border-b border-gray-100 hover:bg-gray-50">
                          {/*<td className="px-4 py-3 text-gray-800">{comp._id ? comp._id.slice(-6) : 'N/A'}</td>*/}
                          <td className="px-4 py-3 text-gray-800">{comp.category || 'N/A'}</td>
                          <td className="px-4 py-3 text-gray-800">
                            {comp.createdAt ? new Date(comp.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td
                              className={`px-4 py-3 font-semibold ${
                                  comp.status === 'Pending' ? 'text-yellow-600' : 'text-green-600'
                              }`}
                          >
                            {comp.status || 'Unknown'}
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            )}
          </div>

          {/* DAILY ACTIVITIES */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-5">Municipal Daily Activities</h2>
            {dailyActivities.length === 0 ? (
                <p className="text-gray-600">No recent activities.</p>
            ) : (
                <ul className="space-y-3">
                  {dailyActivities.map(act => (
                      <li
                          key={act.id}
                          className="p-4 bg-gray-50 border-l-4 border-[linear-gradient(135deg,#24E0C0,#3BA6FF,#8A3FFC)] rounded-md"
                      >
                        <p className="text-gray-800 font-medium">{act.text}</p>
                        <p className="text-sm text-gray-500 mt-1">{act.date}</p>
                      </li>
                  ))}
                </ul>
            )}
          </div>

          {/*/!* QUICK LINKS *!/*/}
          {/*<div className="grid sm:grid-cols-2 gap-4">*/}
          {/*  <a*/}
          {/*      href="/file-complaint"*/}
          {/*      className="p-4 text-center font-semibold text-white rounded-lg bg-[linear-gradient(135deg,#24E0C0,#3BA6FF,#8A3FFC)] hover:opacity-90"*/}
          {/*  >*/}
          {/*    File New Complaint*/}
          {/*  </a>*/}
          {/*  <a*/}
          {/*      href="/track-complaint"*/}
          {/*      className="p-4 text-center font-semibold text-white rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90"*/}
          {/*  >*/}
          {/*    Track Complaint*/}
          {/*  </a>*/}
          {/*</div>*/}
        </main>
      </div>
  );
};

export default UserDashboard;
