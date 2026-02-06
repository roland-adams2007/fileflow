import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAlert } from "../../context/Alerts/UseAlert";
import {
  Mail,
  Eye,
  EyeOff,
  UserPlus,
  Upload,
  Loader2,
  User,
} from "lucide-react";
import axiosinstance from "../../api/axiosinstance";
import { useSaveAuthCookies } from "../../utils/storecookies";

const Register = () => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const saveAuthCookies = useSaveAuthCookies();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
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

  const isValidPassword = (password) => {
    // At least 8 characters, one uppercase, one lowercase, one number
    return password.length >= 8;
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.fname ||
      !formData.lname ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      showAlert("Please fill in all fields", "error");
      return;
    }

    if (!isValidEmail(formData.email)) {
      showAlert("Please enter a valid email address", "error");
      return;
    }

    if (!isValidPassword(formData.password)) {
      showAlert("Password must be at least 8 characters long", "error");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showAlert("Passwords do not match", "error");
      return;
    }

    if (!formData.agreeTerms) {
      showAlert(
        "Please agree to the Terms of Service and Privacy Policy",
        "error",
      );
      return;
    }

    setIsLoading(true);

    axiosinstance
      .post("/users/register", {
        fname: formData.fname,
        lname: formData.lname,
        email: formData.email,
        password: formData.password,
      })
      .then((response) => {
        const res = response.data;
        if (res.status != 200) {
          showAlert(res.message || "Registration failed", "error");
          return;
        }
        showAlert(
          res.message || "Check yout inbox to verify your email.",
          "success",
        );
        navigate("/login", { replace: true });
      })
      .catch((error) => {
        showAlert(
          error.response?.data?.message || "Registration failed",
          "error",
        );
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

      {/* Register Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[90vh] py-8">
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

          {/* Register Card */}
          <div className="bg-[#1e293b] border border-[#475569] rounded-2xl p-10 w-full max-w-md shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Create Account</h1>
              <p className="text-gray-400">
                Sign up to start managing your files
              </p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* First Name Field */}
              <div>
                <label
                  htmlFor="fname"
                  className="block text-sm font-medium mb-2 text-gray-300"
                >
                  First Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="fname"
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    required
                    placeholder="John"
                    className="w-full rounded-xl px-4 py-3.5 bg-[#0f172a] border border-[#475569] text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                  />
                  <User
                    className="absolute right-3 top-3.5 text-gray-500"
                    size={20}
                  />
                </div>
              </div>

              {/* Last Name Field */}
              <div>
                <label
                  htmlFor="lname"
                  className="block text-sm font-medium mb-2 text-gray-300"
                >
                  Last Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="lname"
                    name="lname"
                    value={formData.lname}
                    onChange={handleChange}
                    required
                    placeholder="Doe"
                    className="w-full rounded-xl px-4 py-3.5 bg-[#0f172a] border border-[#475569] text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                  />
                  <User
                    className="absolute right-3 top-3.5 text-gray-500"
                    size={20}
                  />
                </div>
              </div>

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
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2 text-gray-300"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Minimum 8 characters"
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

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-2 text-gray-300"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Re-enter your password"
                    className="w-full rounded-xl px-4 py-3.5 bg-[#0f172a] border border-[#475569] text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 pr-12 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-4 h-4 mt-1 rounded border-gray-600 bg-[#0f172a] text-blue-500 focus:ring-blue-500 focus:ring-offset-[#0f172a] focus:ring-2"
                />
                <label
                  htmlFor="agreeTerms"
                  className="ml-2 text-sm text-gray-300"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl py-3.5 text-white font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-gray-400">
                Already have an account?
                <Link
                  to="/login"
                  className="text-blue-400 hover:text-blue-300 font-medium ml-1 transition-colors"
                >
                  Sign in
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
          .register-card {
            width: 95% !important;
            padding: 2rem !important;
          }
        }

        @media (max-width: 480px) {
          .register-card {
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

export default Register;
