import { FileText, Eye, Search, Filter, Download } from "lucide-react";
import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";

const API_URL = import.meta.env.VITE_API_URL;



const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const complaintsPerPage = 10;

  // Fetch complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/complaints/all`, {
          credentials: "include",
        });
        const data = await res.json();
        const complaintsData = Array.isArray(data) ? data : [];
        setComplaints(complaintsData);
        setFilteredComplaints(complaintsData);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = complaints;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(complaint =>
          complaint.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.subcategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.userId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.userId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(complaint => complaint.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(complaint => complaint.category === categoryFilter);
    }

    setFilteredComplaints(filtered);
    setCurrentPage(1);
  }, [complaints, searchTerm, statusFilter, categoryFilter]);

  // Get unique categories for filter
  const categories = [...new Set(complaints.map(c => c.category).filter(Boolean))];
  const statuses = ["Pending", "Ongoing", "Completed", "Action Taken Soon"];

  // Pagination
  const indexOfLast = currentPage * complaintsPerPage;
  const indexOfFirst = indexOfLast - complaintsPerPage;
  const currentComplaints = filteredComplaints.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);

  // Status color helper
  const statusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Ongoing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Action Taken Soon":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // File URL helper
  const getFileUrl = (c) => {
    const filePath = c.fileUrl || c.file;
    if (!filePath) return null;
    return `${API_URL}/${filePath.replace(/\\/g, "/")}`;
  };

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    if (!id) {
      console.error("No valid complaint ID found for update");
      return;
    }

    try {
      // Optimistic UI update
      setComplaints((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
      if (modalContent && modalContent.id === id) {
        setModalContent((prev) => ({ ...prev, status: newStatus }));
      }

      const res = await fetch(`${API_URL}/api/complaints/status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.msg || "Server error while updating status");
      }

      const data = await res.json();
      setComplaints((prev) =>
          prev.map((c) => (c.id === id ? data : c))
      );

      if (modalContent && modalContent.id === id) {
        setModalContent(data);
      }

      console.log("Status updated successfully ✅");
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err.message || "Failed to update status. Please try again.");
    }
  };

  // Export to CSV
  const handleExport = () => {
    const headers = ['ID', 'User Name', 'Phone', 'Category', 'Subcategory', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filteredComplaints.map(complaint => {
        const user = complaint.userId || {};
        const userName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Unknown';
        return [
          complaint.id || complaint._id,
          `"${userName.replace(/"/g, '""')}"`,
          user.phone || 'N/A',
          complaint.category,
          complaint.subcategory,
          complaint.status,
          new Date(complaint.createdAt).toLocaleDateString()
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `complaints-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <AdminNavbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div className="flex items-center space-x-3 mb-4 lg:mb-0">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Complaints Management</h2>
                  <p className="text-gray-600 text-sm">
                    {filteredComplaints.length} complaint(s) found
                  </p>
                </div>
              </div>

              <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                    type="text"
                    placeholder="Search complaints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setCategoryFilter("all");
                  }}
                  className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Clear Filters</span>
              </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : filteredComplaints.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No complaints found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
            ) : (
                <>
                  {/* Complaints Table */}
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Details</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategory</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Update Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                      {currentComplaints.map((c, i) => {
                        const user = c.userId || {};
                        const fileUrl = getFileUrl(c);
                        const userName = user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Unknown";

                        return (
                            <tr key={c.id || i} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                {indexOfFirst + i + 1}
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-sm font-medium text-gray-900">{userName}</div>
                                {user.phone && (
                                    <div className="text-xs text-gray-600 mt-1">
                                      {user.phone}
                                    </div>
                                )}
                                {user.address && (
                                    <div className="text-xs text-gray-500 truncate max-w-xs mt-1" title={user.address}>
                                      {user.address}
                                    </div>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">{c.category}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{c.subcategory}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 max-w-xs">
                                <div className="truncate" title={c.description}>
                                  {c.description}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {fileUrl ? (
                                    <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline text-xs"
                                    >
                                      View File
                                    </a>
                                ) : (
                                    <span className="text-gray-400 text-xs">No File</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">
                                {new Date(c.createdAt).toLocaleDateString("en-IN")}
                              </td>
                              <td className="px-4 py-3">
                                <select
                                    value={c.status || ""}
                                    onChange={(e) => handleStatusUpdate(c.id, e.target.value)}
                                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Ongoing">Ongoing</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Action Taken Soon">Action Taken Soon</option>
                                </select>
                              </td>
                              <td className="px-4 py-3">
                                <button
                                    onClick={() => setModalContent(c)}
                                    className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                                    title="View Details"
                                >
                                  <Eye size={16} />
                                </button>
                              </td>
                            </tr>
                        );
                      })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-6">
                        <p className="text-sm text-gray-700">
                          Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredComplaints.length)} of{" "}
                          {filteredComplaints.length} results
                        </p>
                        <div className="flex space-x-2">
                          <button
                              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                          >
                            Previous
                          </button>
                          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-3 py-1 border text-sm rounded ${
                                        currentPage === pageNum
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                  {pageNum}
                                </button>
                            );
                          })}
                          <button
                              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                  )}
                </>
            )}

            {/* Modal */}
            {modalContent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Complaint Details</h3>
                        <button
                            onClick={() => setModalContent(null)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="font-medium text-gray-700">User Name</label>
                          <p className="text-gray-900">{modalContent.userId ? `${modalContent.userId.firstName} ${modalContent.userId.lastName || ""}` : "-"}</p>
                        </div>
                        <div>
                          <label className="font-medium text-gray-700">Phone</label>
                          <p className="text-gray-900">{modalContent.userId?.phone || "-"}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="font-medium text-gray-700">Address</label>
                          <p className="text-gray-900">{modalContent.userId?.address || "-"}</p>
                        </div>
                        <div>
                          <label className="font-medium text-gray-700">Category</label>
                          <p className="text-gray-900">{modalContent.category}</p>
                        </div>
                        <div>
                          <label className="font-medium text-gray-700">Subcategory</label>
                          <p className="text-gray-900">{modalContent.subcategory}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="font-medium text-gray-700">Description</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{modalContent.description}</p>
                        </div>
                        {modalContent.fileUrl && (
                            <div className="md:col-span-2">
                              <label className="font-medium text-gray-700">Attached File</label>
                              <a
                                  href={`${API_URL}/${modalContent.fileUrl.replace(/\\/g, "/")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline block mt-1"
                              >
                                View Uploaded File
                              </a>
                            </div>
                        )}
                        <div>
                          <label className="font-medium text-gray-700">Status</label>
                          <p className="text-gray-900">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor(modalContent.status)}`}>
                          {modalContent.status}
                        </span>
                          </p>
                        </div>
                        <div>
                          <label className="font-medium text-gray-700">Date Submitted</label>
                          <p className="text-gray-900">{new Date(modalContent.createdAt).toLocaleString("en-IN")}</p>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => setModalContent(null)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
            )}
          </div>
        </main>
      </div>
  );
};

export default AdminComplaints;