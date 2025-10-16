import AdminNavbar from './AdminNavbar';
import { CheckCircle, Construction } from 'lucide-react';

const AdminResolved = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Resolved Complaints</h2>
          </div>

          <div className="flex flex-col items-center justify-center py-16">
            <Construction className="h-24 w-24 text-gray-300 mb-6" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Coming Soon</h3>
            <p className="text-gray-600 text-center max-w-md">
              Resolved complaints archive is under development. You'll be able to view all successfully resolved complaints and their resolution history from this section.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminResolved;
