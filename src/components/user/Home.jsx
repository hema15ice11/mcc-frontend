import { Building2, Clock, Droplet, FileCheck, FileText, Heart, Home as HomeIcon, Trash2, Users, Wrench, ArrowRight, Star, Shield, CheckCircle, MapPin, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
const API_URL = import.meta.env.VITE_API_URL;
const Home = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: FileCheck,
      title: 'Easy Complaint Filing',
      description: 'Submit your complaints online with just a few clicks. No need to visit offices.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Clock,
      title: 'Track Progress',
      description: 'Monitor the status of your complaints in real-time and get updates.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Citizen-Centric',
      description: 'Designed with citizens in mind for a seamless and transparent experience.',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security measures.',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const categories = [
    {
      icon: Wrench,
      name: 'Civic Infrastructure',
      description: 'Report potholes, broken footpaths, streetlight or park maintenance issues.',
      color: 'text-blue-600'
    },
    {
      icon: Droplet,
      name: 'Water Supply & Drainage',
      description: 'Issues like pipe leakage, blocked drains, sewage overflow, or low water supply.',
      color: 'text-cyan-600'
    },
    {
      icon: Trash2,
      name: 'Waste Management & Sanitation',
      description: 'Uncollected garbage, overflowing bins, and sanitation or mosquito-related issues.',
      color: 'text-emerald-600'
    },
    {
      icon: Heart,
      name: 'Public Health & Safety',
      description: 'Stray animal menace, disease prevention, and public health hazards.',
      color: 'text-rose-600'
    },
    {
      icon: FileText,
      name: 'Licensing & Regulations',
      description: 'Unauthorized construction, trade license, or illegal banners/shops complaints.',
      color: 'text-violet-600'
    },
    {
      icon: Building2,
      name: 'Environment & Beautification',
      description: 'Tree cutting, lake pollution, plantation requests, or noise/air pollution issues.',
      color: 'text-lime-600'
    },
    {
      icon: Clock,
      name: 'Emergency & Disaster Response',
      description: 'Flood, storm, fallen trees or electric poles during disasters.',
      color: 'text-amber-600'
    },
    {
      icon: MapPin,
      name: 'Public Transport & Roads',
      description: 'Traffic signal issues, road signage, public transport facilities.',
      color: 'text-indigo-600'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Complaints Resolved' },
    { number: '24/7', label: 'Support Available' },
    { number: '98%', label: 'Satisfaction Rate' },
    { number: '2H', label: 'Average Response Time' }
  ];

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        {/* Enhanced Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <Building2 className="h-10 w-10 text-white relative z-10" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Municipal Portal
                </h1>
                <p className="text-xs text-gray-500 font-medium">Smart Complaint Management System</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/*<button*/}
              {/*    onClick={() => navigate('/login', { state: { role: 'admin' } })}*/}
              {/*    className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors hidden md:block"*/}
              {/*>*/}
              {/*  Admin Portal*/}
              {/*</button>*/}
              <button
                  onClick={() => navigate('/login', { state: { role: 'user' } })}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                Login
              </button>
            </div>
          </div>
        </header>

        {/* Super Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10"></div>
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className={`max-w-4xl transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 border border-blue-200 mb-6">
                <Star className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-sm font-medium text-blue-700">Trusted by 50,000+ Citizens</span>
              </div>

              <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Municipal
              </span>
                <br />
                <span className="text-gray-900">Complaint Management</span>
              </h1>

              <p className="text-2xl mb-8 text-gray-600 leading-relaxed font-light">
                Transform your community with our smart, efficient, and transparent complaint resolution system.
                Your voice matters, and we're here to listen.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                    onClick={() => navigate('/login', { state: { role: 'user' } })}
                    className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transform flex items-center justify-center"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                    onClick={() => navigate('/login', { state: { role: 'user' } })}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300 font-semibold text-lg bg-white/80 backdrop-blur-sm hover:shadow-xl"
                >
                  Citizen Login
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Features */}
        <section className="py-20 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">Why Choose Our Portal?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Experience the future of civic engagement with our cutting-edge features designed for modern citizens
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                  <div
                      key={index}
                      className={`group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100 ${
                          isVisible ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-r ${feature.gradient} text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Categories */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">Complaint Categories</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive coverage for all municipal issues affecting your daily life
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                  <div
                      key={index}
                      className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 hover:border-blue-300 transition-all duration-300 hover:shadow-2xl hover:scale-105 transform cursor-pointer"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-white to-slate-50 border border-slate-200 group-hover:scale-110 transition-transform duration-300 ${category.color}`}>
                        <category.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text">
                          {category.name}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{category.description}</p>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of citizens who are actively shaping their communities through our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                  onClick={() => navigate('/login', { state: { role: 'user' } })}
                  className="px-8 py-4 bg-white text-blue-600 rounded-2xl hover:bg-gray-100 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transform"
              >
                Start Filing Complaints
              </button>
              <button
                  onClick={() => navigate('/admin-login', { state: { role: 'admin' } })}
                  className="px-8 py-4 border-2 border-white text-white rounded-2xl hover:bg-white/10 transition-all duration-300 font-bold text-lg backdrop-blur-sm"
              >
                Municipal Staff Login
              </button>
            </div>
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <Building2 className="h-8 w-8 text-blue-400" />
                  <div>
                    <p className="font-bold text-lg">Municipal Corporation</p>
                    <p className="text-sm text-gray-400">Next-Gen Complaint Management</p>
                  </div>
                </div>
                <p className="text-gray-400 max-w-md leading-relaxed">
                  Empowering citizens and transforming communities through transparent, efficient, and responsive civic services.
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-4 text-white">Quick Links</h4>
                <div className="space-y-2">
                  <button className="block text-gray-400 hover:text-white transition-colors">About Us</button>
                  <button className="block text-gray-400 hover:text-white transition-colors">Contact</button>
                  <button className="block text-gray-400 hover:text-white transition-colors">FAQ</button>
                  <button className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</button>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-4 text-white">Contact Info</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-400">
                    <Phone className="h-4 w-4" />
                    <span>1800-123-4567</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span>support@municipal.gov</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>City Center, Municipal Office</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 Municipal Corporation. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <button className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms of Service
                </button>
                <button className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </button>
                <button
                    onClick={() => navigate('/admin-login', { state: { role: 'admin' } })}
                    className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                >
                  Admin Portal
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
};

export default Home;
