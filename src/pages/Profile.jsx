import { useState, useEffect } from "react";
import { useAuth } from "../context/Auth/UseAuth";
import { useAlert } from "../context/Alerts/UseAlert";
import axiosInstance from "../api/axiosinstance";
import { User, Lock, Save, Loader } from "lucide-react";

const Profile = () => {
  const { showAlert } = useAlert();
  const { user, loadingUser } = useAuth();
  const [profileData, setProfileData] = useState({
    fname: user?.fname || "",
    lname: user?.lname || "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        fname: user.fname || "",
        lname: user.lname || "",
      });
    }
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);

    try {
      const response = await axiosInstance.post("/users/update-profile", {
        fname: profileData.fname,
        lname: profileData.lname,
      });

      showAlert("Profile updated successfully", "success");
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Failed to update profile",
        "error",
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.confirm_password) {
      showAlert("New passwords do not match", "error");
      return;
    }

    if (passwordData.new_password.length < 6) {
      showAlert("Password must be at least 6 characters", "error");
      return;
    }

    setLoadingPassword(true);

    try {
      const response = await axiosInstance.post("/users/update-password", {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });

      showAlert("Password updated successfully", "success");
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Failed to update password",
        "error",
      );
    } finally {
      setLoadingPassword(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0f172a]">
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0f172a] p-4 lg:p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Profile Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1e293b] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="text-blue-500" size={24} />
              <h2 className="text-xl font-semibold text-white">
                Personal Information
              </h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full bg-[#0f172a] border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="fname"
                  value={profileData.fname}
                  onChange={handleProfileChange}
                  required
                  className="w-full bg-[#0f172a] border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lname"
                  value={profileData.lname}
                  onChange={handleProfileChange}
                  required
                  className="w-full bg-[#0f172a] border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loadingProfile}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed px-4 py-2.5 rounded-lg text-white font-medium flex items-center gap-2 justify-center"
              >
                {loadingProfile ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-[#1e293b] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="text-blue-500" size={24} />
              <h2 className="text-xl font-semibold text-white">
                Change Password
              </h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full bg-[#0f172a] border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full bg-[#0f172a] border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full bg-[#0f172a] border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loadingPassword}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed px-4 py-2.5 rounded-lg text-white font-medium flex items-center gap-2 justify-center"
              >
                {loadingPassword ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
