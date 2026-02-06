import React, { useState } from "react";
import { replace, useNavigate, Link } from "react-router-dom";
import { useAlert } from "../../context/Alerts/UseAlert";
import {
  Mail,
  Eye,
  EyeOff,
  LogIn,
  Upload,
  Loader2,
} from "lucide-react";
import axiosinstance from "../../api/axiosinstance";
import { useSaveAuthCookies } from "../../utils/storecookies";
const Login = () => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const saveAuthCookies = useSaveAuthCookies();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showMessage("Please fill in all fields", "error");
      return;
    }

    if (!isValidEmail(formData.email)) {
      showMessage("Please enter a valid email address", "error");
      return;
    }

    setIsLoading(true);

    axiosinstance
      .post("/users/login", {
        email: formData.email,
        password: formData.password,
      })
      .then((response) => {
        const res = response.data;
        if (res.status != 200) {
          showAlert(res.message || "Login failed", "error");
          return;
        }
        const { userData, tokenData } = res.data;
        saveAuthCookies(tokenData, userData);
        navigate("/u/file-manager", { replace: true });
      })
      .catch((error) => {
        showAlert(error.response?.data?.message || "Login failed", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="text-gray-100 min-h-screen flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] opacity-100"></div>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[90vh]">
          {/* Logo/Brand */}
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Upload className="text-white" size={28} />
              </div>
              <span className="text-3xl font-bold text-white">FileFlow</span>
            </div>
            <p className="text-gray-400 text-lg">
              Secure File Management Platform
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-[#1e293b] border border-[#475569] rounded-2xl p-10 w-full max-w-md shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
              <p className="text-gray-400">
                Sign in to access your file manager
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-gray-300"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl px-4 py-3.5 bg-[#0f172a] border border-[#475569] text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                  />
                  <Mail
                    className="absolute right-3 top-3.5 text-gray-500"
                    size={20}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Enter your registered email address
                </p>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="w-full rounded-xl px-4 py-3.5 bg-[#0f172a] border border-[#475569] text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 pr-12 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-600 bg-[#0f172a] text-blue-500 focus:ring-blue-500 focus:ring-offset-[#0f172a] focus:ring-2"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-300"
                >
                  Remember this device for 30 days
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl py-3.5 text-white font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-gray-400">
                Don't have an account?
                <Link
                  to="/reg"
                  className="text-blue-400 hover:text-blue-300 font-medium ml-1 transition-colors"
                 
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }

        .animate-slideOut {
          animation: slideOut 0.3s ease-in forwards;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #1e293b;
        }

        ::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }

        @media (max-width: 768px) {
          .login-card {
            width: 95% !important;
            padding: 2rem !important;
          }
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 1.5rem !important;
          }

          .logo-container {
            gap: 0.75rem !important;
          }

          .logo-icon {
            width: 2rem !important;
            height: 2rem !important;
          }

          .logo-text {
            font-size: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
