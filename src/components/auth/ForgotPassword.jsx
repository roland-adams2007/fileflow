 import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "../../context/Alerts/UseAlert";
import { Mail, ArrowLeft, Send, Loader2, Upload, CheckCircle } from "lucide-react";
import axiosinstance from "../../api/axiosinstance";

const ForgotPassword = () => {
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ email: e.target.value });
  };

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      showAlert("Please enter your email address", "error");
      return;
    }

    if (!isValidEmail(formData.email)) {
      showAlert("Please enter a valid email address", "error");
      return;
    }

    setIsLoading(true);

    axiosinstance
      .post("/users/forgot-password", {
        email: formData.email,
      })
      .then((response) => {
        const res = response.data;
        if (res.status !== 200) {
          showAlert(res.message || "Failed to send reset email", "error");
          return;
        }
        setEmailSent(true);
        showAlert("Password reset link sent to your email", "success");
      })
      .catch((error) => {
        showAlert(
          error.response?.data?.message || "Failed to send reset email",
          "error"
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

      {/* Forgot Password Container */}
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

          {/* Forgot Password Card */}
          <div className="bg-[#1e293b] border border-[#475569] rounded-2xl p-10 w-full max-w-md shadow-2xl">
            {!emailSent ? (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
                  <p className="text-gray-400">
                    No worries, we'll send you reset instructions
                  </p>
                </div>

                {/* Forgot Password Form */}
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
                      Enter the email associated with your account
                    </p>
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
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Send Reset Link</span>
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
                <h2 className="text-2xl font-bold mb-3">Check Your Email</h2>
                <p className="text-gray-400 mb-6">
                  We've sent password reset instructions to
                  <span className="block text-blue-400 font-medium mt-1">
                    {formData.email}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <button
                  onClick={() => setEmailSent(false)}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Try another email
                </button>
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
          .forgot-password-card {
            width: 95% !important;
            padding: 2rem !important;
          }
        }

        @media (max-width: 480px) {
          .forgot-password-card {
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;