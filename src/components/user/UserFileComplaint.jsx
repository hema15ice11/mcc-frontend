import { useEffect, useState } from "react";
import UserNavbar from "./UserNavbar";
import { Upload, AlertCircle, CheckCircle2, MapPin, Camera, FileText, ChevronDown } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const categories = {
  "Civic Infrastructure": [
    "Potholes",
    "Broken footpaths",
    "Damaged speed breakers",
    "Non-functional streetlights",
    "Flickering/dim lights",
    "Broken benches/equipment",
    "Poor park maintenance",
    "Broken/damaged manhole covers",
    "Open/uncovered manholes",
  ],
  "Water Supply & Drainage": [
    "Pipe leakage",
    "Low water pressure/no supply",
    "Blocked drains",
    "Waterlogging during rains",
    "Sewage overflow",
    "Blocked sewer lines",
  ],
  "Waste Management & Sanitation": [
    "Uncollected garbage",
    "Overflowing bins",
    "Garbage dumping in open areas",
    "Construction waste",
    "Unclean public toilets",
    "Damaged toilet facilities",
    "Mosquito breeding",
    "Fogging/spraying request",
  ],
  "Public Health & Safety": [
    "Stray dog/cattle menace",
    "Dead animal removal",
    "Dengue/malaria prevention",
    "Epidemic awareness request",
  ],
  "Licensing & Regulations": [
    "Illegal shops/stalls on footpaths",
    "Unauthorized construction",
    "Illegal hoardings/banners",
    "Pending building permit issues",
    "Trade license complaints",
  ],
  "Environment & Beautification": [
    "Tree cutting without permission",
    "Request for plantation",
    "Polluted lakes/ponds",
    "Garbage in riversides",
    "Noise pollution complaints",
    "Air/water pollution issues",
  ],
  "Emergency & Disaster Response": [
    "Flood-related complaints",
    "Storm damage",
    "Fallen trees",
    "Fallen electric poles",
  ],
};

const statusGradients = {
  success: {
    background: "bg-gradient-to-r from-green-500 to-emerald-600",
    light: "bg-gradient-to-r from-green-50 to-emerald-50",
    border: "border-green-200",
    text: "text-green-800",
  },
  error: {
    background: "bg-gradient-to-r from-red-500 to-rose-600",
    light: "bg-gradient-to-r from-red-50 to-rose-50",
    border: "border-red-200",
    text: "text-red-800",
  },
  pending: {
    background: "bg-gradient-to-r from-orange-500 to-amber-600",
    light: "bg-gradient-to-r from-orange-50 to-amber-50",
    border: "border-orange-200",
    text: "text-orange-800",
  },
};

const UserFileComplaint = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    description: "",
    file: null,
  });
  const [subcategories, setSubcategories] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, { credentials: "include" });
        const data = await res.json();
        if (res.ok && data.user) setUser(data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "category") {
      setFormData({ ...formData, category: value, subcategory: "" });
      setSubcategories(categories[value] || []);
    } else if (name === "file") {
      const file = files[0];
      setFormData({ ...formData, file });
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
      } else setImagePreview(null);
    } else if (name === "description") {
      if (value.length <= 500) setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setMessage({ type: "", text: "" });
  };

  const removeImage = () => {
    setFormData({ ...formData, file: null });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { category, subcategory, description, file } = formData;

    if (!category || !subcategory || !description) {
      setMessage({ type: "error", text: "Please fill all required fields." });
      return;
    }

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append("category", category);
      data.append("subcategory", subcategory);
      data.append("description", description);
      if (file) data.append("file", file);

      const res = await fetch(`${API_URL}/api/complaints`, {
        method: "POST",
        body: data,
        credentials: "include",
      });

      const result = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Complaint submitted successfully! We'll review it shortly." });
        setFormData({ category: "", subcategory: "", description: "", file: null });
        setSubcategories([]);
        setImagePreview(null);
      } else {
        setMessage({ type: "error", text: result.msg || "Failed to submit complaint." });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Server error, try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <UserNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            File a Complaint
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Help us improve your community by reporting issues. Your complaints help us serve you better.
          </p>
        </div>

        {/* Complaint Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category */}
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-bold text-gray-800">
                  Category *
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full pl-4 pr-10 py-4 bg-slate-50/70 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none font-medium"
                  >
                    <option value="">Select a category</option>
                    {Object.keys(categories).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Subcategory */}
              <div className="space-y-2">
                <label htmlFor="subcategory" className="block text-sm font-bold text-gray-800">
                  Specific Issue *
                </label>
                <div className="relative">
                  <select
                    id="subcategory"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    className="w-full pl-4 pr-10 py-4 bg-slate-50/70 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    disabled={!subcategories.length}
                  >
                    <option value="">Select specific issue</option>
                    {subcategories.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-bold text-gray-800">
                  Detailed Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-4 bg-slate-50/70 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none font-medium placeholder-gray-400"
                  placeholder="Please provide detailed information about the issue..."
                />
                <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 characters</p>
              </div>

              {/* File Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-800">Upload Evidence (Optional)</label>
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors duration-300 bg-slate-50/50">
                    <input type="file" id="file" name="file" onChange={handleChange} accept="image/*" className="hidden" />
                    <label htmlFor="file" className="cursor-pointer">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium mb-1">Click to upload image</p>
                      <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-2xl shadow-lg" />
                    <button type="button" onClick={removeImage} className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg">
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex flex-col items-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105 transform"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting Complaint...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      <span>Submit Complaint</span>
                    </>
                  )}
                </button>

                {/* Status Message BELOW submit */}
                {message.text && (
                  <div className={`mt-4 w-full p-4 rounded-2xl border ${
                    statusGradients[message.type]?.border || "border-gray-200"
                  } ${statusGradients[message.type]?.light || "bg-gray-50"} shadow-lg transition-all duration-300`}>
                    <div className="flex items-center space-x-3">
                      {message.type === "success" ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-red-500" />
                      )}
                      <p className={`font-medium ${statusGradients[message.type]?.text || "text-gray-800"}`}>
                        {message.text}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Form Footer */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-4 border-t border-blue-100">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>Your complaint helps us serve the community better</span>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact support at{" "}
            <a href="mailto:support@municipal.gov" className="text-blue-600 hover:underline">
              support@municipal.gov
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default UserFileComplaint;
