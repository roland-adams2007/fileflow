import { useAuth } from "../context/Auth/UseAuth";
import { useNavigate } from "react-router-dom";
import { Upload, Folder, Lock, Zap, Users, ArrowRight, Sparkles, Shield, Globe, Cloud, Code, BarChart, Download, Search, Bell, Settings, Heart, Star, CheckCircle, Clock, Smartphone, Database, Infinity as Infinite } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const { user, loadingUser } = useAuth();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [fileUploads, setFileUploads] = useState(0);
  const [storageUsed, setStorageUsed] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Animated counters
    const uploadInterval = setInterval(() => {
      setFileUploads(prev => (prev >= 10475000 ? 10475000 : prev + 25000));
    }, 100);
    
    const storageInterval = setInterval(() => {
      setStorageUsed(prev => (prev >= 2.7 ? 2.7 : prev + 0.1));
    }, 300);

    // Testimonial rotation
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % 3);
    }, 5000);

    return () => {
      clearInterval(uploadInterval);
      clearInterval(storageInterval);
      clearInterval(testimonialInterval);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        />
      </div>
    );
  }

  const features = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Lightning Fast Uploads",
      description: "Drag, drop, done. Upload files at blazing speeds with real-time progress tracking.",
      gradient: "from-blue-500 to-cyan-500",
      stats: "10x faster"
    },
    {
      icon: <Folder className="w-6 h-6" />,
      title: "Smart AI Organization",
      description: "AI-powered tagging and automatic categorization for effortless file management.",
      gradient: "from-purple-500 to-pink-500",
      stats: "Auto-tagging"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Bank-Level Security",
      description: "End-to-end encryption with zero-knowledge architecture and 2FA protection.",
      gradient: "from-green-500 to-emerald-500",
      stats: "256-bit AES"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Global Access",
      description: "Access files from any device with real-time sync across all platforms.",
      gradient: "from-orange-500 to-red-500",
      stats: "99.9% uptime"
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Unlimited Cloud Storage",
      description: "Scalable storage plans with automatic backup and version history.",
      gradient: "from-indigo-500 to-blue-500",
      stats: "∞ storage"
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Track usage patterns, access logs, and storage insights with detailed reports.",
      gradient: "from-cyan-500 to-teal-500",
      stats: "Real-time stats"
    },
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "CTO at TechCorp",
      content: "FileFlow revolutionized our workflow. The AI organization alone saved us 20 hours per week.",
      avatar: "AC",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      role: "Creative Director",
      content: "As a designer, I handle thousands of assets. FileFlow makes finding what I need instantaneous.",
      avatar: "SJ",
      rating: 5
    },
    {
      name: "Marcus Rivera",
      role: "Data Scientist",
      content: "The security features give us peace of mind while collaborating on sensitive projects.",
      avatar: "MR",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      features: ["10GB Storage", "Basic Analytics", "Standard Support", "1 User"],
      popular: false,
      gradient: "from-gray-600 to-gray-700"
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      features: ["100GB Storage", "Advanced Analytics", "Priority Support", "5 Users", "AI Organization"],
      popular: true,
      gradient: "from-blue-600 to-purple-600"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: ["Unlimited Storage", "Full Analytics Suite", "24/7 Support", "Unlimited Users", "Custom AI", "On-premise"],
      popular: false,
      gradient: "from-purple-600 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white overflow-hidden relative">
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute w-[800px] h-[800px] rounded-full bg-blue-600/20 blur-[120px] -top-[400px] -left-[400px]"
      />
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px] top-[20%] -right-[300px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute w-[500px] h-[500px] rounded-full bg-cyan-600/15 blur-[100px] bottom-[10%] left-[20%]"
      />

      {/* Cursor follower gradient */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="fixed w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-[80px] pointer-events-none"
        style={{
          left: `${mousePosition.x - 200}px`,
          top: `${mousePosition.y - 200}px`,
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-50 flex items-center justify-between px-8 py-6"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30"
          >
            <Upload className="w-5 h-5" />
          </motion.div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            FileFlow
          </span>
        </div>
        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>Live Demo</span>
          </motion.button>
          {user ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/u/file-manager")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30 flex items-center gap-2"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30"
              >
                Get Started Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-xl border border-white/20 hover:bg-white/5 transition-colors"
              >
                Sign In
              </motion.button>
            </div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-12 pb-32">
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-full text-sm font-medium text-blue-400 mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>Trusted by 50K+ teams worldwide</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl md:text-8xl font-black leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              Where Files Meet
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Intelligence
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            AI-powered file management that anticipates your needs. Store smarter, 
            organize effortlessly, and collaborate seamlessly.
          </motion.p>

          {/* Live Stats Counter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-8 pt-8"
          >
            <div className="flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-sm rounded-2xl">
              <Database className="w-5 h-5 text-blue-400" />
              <div className="text-left">
                <div className="text-2xl font-bold">{fileUploads.toLocaleString()}+</div>
                <div className="text-sm text-gray-500">Files Uploaded</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-sm rounded-2xl">
              <Cloud className="w-5 h-5 text-purple-400" />
              <div className="text-left">
                <div className="text-2xl font-bold">{storageUsed.toFixed(1)}PB</div>
                <div className="text-sm text-gray-500">Storage Managed</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-sm rounded-2xl">
              <Users className="w-5 h-5 text-green-400" />
              <div className="text-left">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm text-gray-500">Active Users</div>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => user ? navigate("/u/file-manager") : null}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-lg transition-all hover:shadow-2xl hover:shadow-blue-500/40 flex items-center gap-3"
            >
              {user ? "Open File Manager" : "Start Free Trial"}
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl font-bold text-lg transition-all hover:bg-white/10 flex items-center gap-3"
            >
              <span>Watch Demo</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">New</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Animated Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-transparent to-transparent z-10 pointer-events-none" />
          <div className="relative bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10 rounded-3xl p-2 shadow-2xl shadow-blue-500/20">
            <div className="bg-[#1a2332] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center text-sm text-gray-500 font-medium">
                  FileFlow AI Dashboard
                </div>
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-gray-500" />
                  <Search className="w-4 h-4 text-gray-500" />
                  <Settings className="w-4 h-4 text-gray-500" />
                </div>
              </div>
              <div className="aspect-video bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center p-8">
                <div className="grid grid-cols-3 gap-4 w-full max-w-6xl">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30 flex items-center justify-center"
                    >
                      <div className="text-center">
                        <div className="text-sm text-gray-400">File Type</div>
                        <div className="text-lg font-bold">{['PDF', 'IMG', 'VID', 'DOC', 'ZIP', 'AI'][i]}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to transform how you manage files
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl hover:border-blue-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium">
                    {feature.stats}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  {feature.description}
                </p>
                <motion.button
                  whileHover={{ x: 5 }}
                  className="text-sm text-blue-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Learn more <ArrowRight className="w-3 h-3" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Loved by Teams
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              See what our users are saying about their experience
            </p>
          </motion.div>

          <div className="relative h-64">
            <AnimatePresence mode="wait">
              {testimonials.map((testimonial, index) => (
                activeTestimonial === index && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl p-8"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center text-xl font-bold">
                        {testimonial.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="text-lg font-bold">{testimonial.name}</h4>
                            <p className="text-gray-400 text-sm">{testimonial.role}</p>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-300 text-lg italic">"{testimonial.content}"</p>
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${activeTestimonial === index ? 'bg-blue-500 w-6' : 'bg-white/30'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Simple, Transparent Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose the perfect plan for your needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`relative p-8 bg-gradient-to-b ${plan.gradient}/10 backdrop-blur-sm border ${plan.popular ? 'border-blue-500/50' : 'border-white/10'} rounded-3xl ${plan.popular ? 'shadow-2xl shadow-blue-500/20' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-black">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 rounded-xl font-bold ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-white/10 hover:bg-white/20'} transition-all`}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-3xl opacity-30 animate-pulse" />
            <div className="relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-3xl p-12 max-w-3xl">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Ready to Transform Your Workflow?
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Join 50,000+ teams who trust FileFlow with their files. Start your free 14-day trial today.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => user ? navigate("/u/file-manager") : null}
                className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-lg transition-all hover:shadow-2xl hover:shadow-blue-500/40 inline-flex items-center gap-3"
              >
                {user ? "Go to Dashboard" : "Start Free Trial"}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <p className="text-gray-500 text-sm mt-4">No credit card required • Cancel anytime</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative z-10 border-t border-white/10 mt-32"
      >
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
                >
                  <Upload className="w-5 h-5" />
                </motion.div>
                <span className="text-xl font-bold">FileFlow</span>
              </div>
              <p className="text-gray-400 max-w-sm mb-4">
                AI-powered file management for modern teams. Store smarter, collaborate better.
              </p>
              <div className="flex items-center gap-4">
                <motion.a whileHover={{ scale: 1.1 }} href="#" className="text-gray-400 hover:text-white">
                  <Globe className="w-5 h-5" />
                </motion.a>
                <motion.a whileHover={{ scale: 1.1 }} href="#" className="text-gray-400 hover:text-white">
                  <Code className="w-5 h-5" />
                </motion.a>
                <motion.a whileHover={{ scale: 1.1 }} href="#" className="text-gray-400 hover:text-white">
                  <Heart className="w-5 h-5" />
                </motion.a>
              </div>
            </div>
            {['Product', 'Company', 'Resources', 'Legal'].map((category) => (
              <div key={category}>
                <h4 className="font-bold mb-4">{category}</h4>
                <ul className="space-y-2 text-gray-400">
                  {['Features', 'Pricing', 'Security', 'Enterprise'].map((item) => (
                    <motion.li
                      key={item}
                      whileHover={{ x: 5 }}
                      className="hover:text-white cursor-pointer transition-colors"
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; 2024 FileFlow. All rights reserved. Built with ❤️ for the cloud.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;