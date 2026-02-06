import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAlert } from "../../context/Alerts/UseAlert";
import {
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  MailCheck,
} from "lucide-react";
import axiosinstance from "../../api/axiosinstance";

const Verification = () => {
  const [verificationStatus, setVerificationStatus] = useState("verifying"); // 'verifying', 'success', 'error', 'invalid'
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const token = new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setVerificationStatus("invalid");
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (verificationStatus === "success" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (verificationStatus === "success" && countdown === 0) {
      navigate("/login", { replace: true });
    }
  }, [verificationStatus, countdown, navigate]);

  const verifyToken = async () => {
    try {
      setIsLoading(true);
      const response = await axiosinstance.post("/users/verify-email", {
        token: token,
      });

      const res = response.data;

      if (res.status === 200) {
        setVerificationStatus("success");
        showAlert(res.message || "Email verified successfully!", "success");
      } else {
        setVerificationStatus("error");
        showAlert(res.message || "Verification failed", "error");
      }
    } catch (error) {
      setVerificationStatus("error");
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Verification failed. The link may have expired or is invalid.";
      showAlert(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case "verifying":
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center">
              <Loader2 className="text-blue-500 animate-spin" size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Verifying Your Email</h2>
              <p className="text-gray-400">
                Please wait while we verify your email address...
              </p>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-500" size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
              <p className="text-gray-400 mb-2">
                Your email has been successfully verified.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to login in {countdown} seconds...
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/login", { replace: true })}
                className="w-full rounded-xl py-3.5 text-white font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <ArrowRight size={20} />
                <span>Go to Login Now</span>
              </button>
              <Link
                to="/"
                className="inline-block text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
              <XCircle className="text-red-500" size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
              <p className="text-gray-400">
                We couldn't verify your email address. The link may have expired
                or is invalid.
              </p>
            </div>
            <div className="space-y-2">
              <Link
                to="/login"
                className="block text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Go to Login
              </Link>
              <Link
                to="/reg"
                className="block text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Create New Account
              </Link>
            </div>
          </div>
        );

      case "invalid":
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-yellow-500/10 rounded-full flex items-center justify-center">
              <XCircle className="text-yellow-500" size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Invalid Verification Link
              </h2>
              <p className="text-gray-400">
                The verification link is invalid or missing. Please check your
                email for the correct link.
              </p>
            </div>
            <div className="space-y-3">
              <Link
                to="/login"
                className="block w-full rounded-xl py-3.5 text-white font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <ArrowRight size={20} />
                <span>Go to Login</span>
              </Link>
              <Link
                to="/reg"
                className="block text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Create New Account
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="text-gray-100 min-h-screen flex items-center justify-center p-4">
      {/* Animated Background - Same as Register component */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] opacity-100"></div>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Verification Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[90vh] py-8">
          {/* Logo/Brand - Same as Register */}
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg
                  className="text-white"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <span className="text-3xl font-bold text-white">FileFlow</span>
            </div>
            <p className="text-gray-400 text-lg">
              Secure File Management Platform
            </p>
          </div>

          {/* Verification Card */}
          <div className="bg-[#1e293b] border border-[#475569] rounded-2xl p-10 w-full max-w-md shadow-2xl">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Styles - Similar to Register component */}
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
          .verification-card {
            width: 95% !important;
            padding: 2rem !important;
          }
        }

        @media (max-width: 480px) {
          .verification-card {
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

export default Verification;
