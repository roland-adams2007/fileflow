import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAlert } from "../../context/Alerts/UseAlert";
import { Lock, Eye, EyeOff, CheckCircle, Loader2, ArrowLeft, Key, AlertCircle } from "lucide-react";
import axiosinstance from "../../api/axiosinstance";

const ResetPassword = () => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [passwordReset, setPasswordReset] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [token, setToken] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Extract and validate token from URL
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      showAlert("Invalid or missing reset token", "error");
      setValidatingToken(false);
      setIsTokenValid(false);
      return;
    }

    setToken(tokenFromUrl);
    validateResetToken(tokenFromUrl);
  }, [searchParams]);

  const validateResetToken = async (token) => {
    try {
      const response = await axiosinstance.post("/users/validate-reset-token", {
        token,
      });

      if (response.data.status === 200) {
        setIsTokenValid(true);
        setUserEmail(response.data.data.email);
      } else {
        setIsTokenValid(false);
        showAlert(response.data.message || "Invalid or expired reset token", "error");
      }
    } catch (error) {
      setIsTokenValid(false);
      showAlert(
        error.response?.data?.message || "Invalid or expired reset token",
        "error"
      );
    } finally {
      setValidatingToken(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (!formData.password || !formData.confirmPassword) {
      showAlert("Please fill in all fields", "error");
      return;
    }

    if (!validatePassword(formData.password)) {
      showAlert(
        "Password must be at least 8 characters with uppercase, lowercase, and number",
        "error"
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showAlert("Passwords do not match", "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosinstance.post("/users/reset-password", {
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      const res = response.data;
      
      if (res.status !== 200) {
        showAlert(res.message || "Failed to reset password", "error");
        return;
      }

      setPasswordReset(true);
      showAlert("Password reset successful! You can now login with your new password", "success");
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Failed to reset password",
        "error"
      );
      
      // If token is invalid, revalidate
      if (error.response?.status === 400) {
        validateResetToken(token);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while validating token
  if (validatingToken) {
    return (
      <div className="text-gray-100 min-h-screen flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] opacity-100"></div>
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-gray-300">Validating reset link...</p>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (!isTokenValid) {
    return (
      <div className="text-gray-100 min-h-screen flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] opacity-100"></div>
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[90vh]">
            <div className="bg-[#1e293b] border border-[#475569] rounded-2xl p-10 w-full max-w-md shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="text-red-500" size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-3">Invalid Reset Link</h2>
              <p className="text-gray-400 mb-6">
                This password reset link is invalid or has expired.
                Please request a new reset link.
              </p>
              <div className="space-y-4">
                <Link
                  to="/forgot-password"
                  className="block w-full rounded-xl py-3.5 text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transition-all duration-300"
                >
                  Request New Reset Link
                </Link>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-blue-400 font-medium inline-flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>Back to login</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-gray-100 min-h-screen flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] opacity-100"></div>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Reset Password Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[90vh]">
          {/* Logo/Brand */}
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Key className="text-white" size={28} />
              </div>
              <span className="text-3xl font-bold text-white">FileFlow</span>
            </div>
            <p className="text-gray-400 text-lg">
              Secure File Management Platform
            </p>
          </div>

          {/* Reset Password Card */}
          <div className="bg-[#1e293b] border border-[#475569] rounded-2xl p-10 w-full max-w-md shadow-2xl">
            {!passwordReset ? (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
                  <p className="text-gray-400">
                    Enter your new password for
                    <span className="block text-blue-400 font-medium mt-1">
                      {userEmail}
                    </span>
                  </p>
                </div>

                {/* Reset Password Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* New Password Field */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium mb-2 text-gray-300"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.password ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter new password"
                        className="w-full rounded-xl px-4 py-3.5 bg-[#0f172a] border border-[#475569] text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors pr-12"
                        autoComplete="new-password"
                      />
                      <Lock className="absolute left-3 top-3.5 text-gray-500" size={20} />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("password")}
                        className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300"
                      >
                        {showPassword.password ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Minimum 8 characters with uppercase, lowercase, and number
                    </p>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium mb-2 text-gray-300"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Confirm new password"
                        className="w-full rounded-xl px-4 py-3.5 bg-[#0f172a] border border-[#475569] text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors pr-12"
                        autoComplete="new-password"
                      />
                      <Lock className="absolute left-3 top-3.5 text-gray-500" size={20} />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirmPassword")}
                        className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300"
                      >
                        {showPassword.confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-[#0f172a] border border-[#475569] rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">
                      Password Requirements:
                    </h4>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li className={`flex items-center gap-2 ${formData.password.length >= 8 ? "text-green-500" : ""}`}>
                        <span>•</span>
                        <span>At least 8 characters long</span>
                      </li>
                      <li className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? "text-green-500" : ""}`}>
                        <span>•</span>
                        <span>One uppercase letter</span>
                      </li>
                      <li className={`flex items-center gap-2 ${/[a-z]/.test(formData.password) ? "text-green-500" : ""}`}>
                        <span>•</span>
                        <span>One lowercase letter</span>
                      </li>
                      <li className={`flex items-center gap-2 ${/\d/.test(formData.password) ? "text-green-500" : ""}`}>
                        <span>•</span>
                        <span>One number</span>
                      </li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-xl py-3.5 text-white font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Resetting Password...</span>
                      </>
                    ) : (
                      <>
                        <Key size={20} />
                        <span>Reset Password</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-green-500" size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-3">Password Reset Successful!</h2>
                <p className="text-gray-400 mb-6">
                  Your password has been successfully updated.
                </p>
                <div className="bg-[#0f172a] border border-[#475569] rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-400">
                    You will be redirected to the login page shortly...
                  </p>
                </div>
                <Link
                  to="/login"
                  className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>Go to Login Now</span>
                </Link>
              </div>
            )}

            {/* Back to Login Link */}
            <div className="text-center mt-6">
              <Link
                to="/login"
                className="text-gray-400 hover:text-blue-400 font-medium inline-flex items-center gap-2 transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Back to login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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
          .reset-password-card {
            width: 95% !important;
            padding: 2rem !important;
          }
        }

        @media (max-width: 480px) {
          .reset-password-card {
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;