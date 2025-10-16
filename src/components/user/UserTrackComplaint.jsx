import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import UserNavbar from "./UserNavbar";
import io from "socket.io-client";
const API_URL = import.meta.env.VITE_API_URL;
// Status steps
const statusSteps = ["Pending", "Ongoing", "Action Taken Soon", "Completed"];

// Initialize socket
const socket = io(`${API_URL}`, { withCredentials: true });

const UserTrackComplaint = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper to get status step classes
  const getStepClass = (step, currentStatus) => {
    const stepIndex = statusSteps.indexOf(step);
    const currentIndex = statusSteps.indexOf(currentStatus);

    if (currentStatus === "Completed") return "bg-green-500 text-white";
    if (stepIndex < currentIndex) return "bg-green-500 text-white";
    if (stepIndex === currentIndex) return "bg-yellow-400 text-white";
    return "bg-gray-300 text-gray-700";
  };

  useEffect(() => {
    if (!user || !user._id) return;

    // Register user for real-time updates
    socket.emit("registerUser", user._id);

    // Fetch complaints
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
            `${API_URL}/api/complaints/user/${user._id}`,
            { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch complaints");
        const data = await res.json();
        setComplaints(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Could not load complaints. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();

    // Listen for real-time updates
    socket.on("complaintStatusUpdated", (updatedComplaint) => {
      setComplaints((prev) =>
          prev.map((c) => (c._id === updatedComplaint._id ? updatedComplaint : c))
      );
    });

    return () => socket.off("complaintStatusUpdated");
  }, [user]);

  if (!user || !user._id) {
    return (
        <div>
          <UserNavbar />
          <p className="p-4 text-center text-red-600">
            Please log in to view complaints.
          </p>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-100">
        <UserNavbar />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Track Your Complaints</h1>

          {loading ? (
              <p>Loading complaints...</p>
          ) : error ? (
              <p className="text-red-600">{error}</p>
          ) : complaints.length === 0 ? (
              <p>No complaints filed yet.</p>
          ) : (
              <div className="space-y-8">
                {complaints.map((c) => {
                  const isCompleted = c.status === "Completed";
                  return (
                      <div
                          key={c._id}
                          className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
                      >
                        <h2 className="text-xl font-semibold mb-2">
                          {c.category} - {c.subcategory}
                        </h2>
                        <p className="mb-4">{c.description}</p>

                        {c.fileUrl && (
                            <p className="mb-4">
                              <a
                                  href={`${API_URL}/${c.fileUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline"
                              >
                                View Uploaded File
                              </a>
                            </p>
                        )}

                        {/* Status Tracker */}
                        <div className="flex items-center justify-between mt-6 relative">
                          {statusSteps.map((step, i) => {
                            const stepClass = getStepClass(step, c.status);
                            return (
                                <div
                                    key={i}
                                    className="flex-1 flex flex-col items-center relative"
                                >
                                  <div
                                      className={`w-6 h-6 rounded-full ${stepClass} z-10`}
                                  />
                                  <span className="text-xs mt-2 text-center">{step}</span>

                                  {i < statusSteps.length  && (
                                      <div
                                          className={`absolute top-3 left-1/2 w-full h-1 -translate-x-1/2 z-0 ${
                                              isCompleted || statusSteps.indexOf(c.status) > i
                                                  ? "bg-green-500"
                                                  : "bg-gray-300"
                                          }`}
                                      />
                                  )}
                                </div>
                            );
                          })}
                        </div>

                        {/* Completed Message */}
                        {isCompleted && (
                            <p className="mt-4 text-green-700 font-semibold">
                              ✅ Your problem is rectified. An email has been sent to you.
                            </p>
                        )}
                      </div>
                  );
                })}
              </div>
          )}
        </main>
      </div>
  );
};

export default UserTrackComplaint;
