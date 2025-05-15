import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Layout/DeliverySidebar";
import axios from "axios";
import { User } from "lucide-react";
import { jwtDecode } from "jwt-decode";

function Profile() {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    email: "",
    phone: "",
    location: {
      city: "",
      location: ""
    }
  });

  interface DecodedToken {
    id?: string;
    _id?: string;
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("Token not found");
          return;
        }

        const decoded = jwtDecode<DecodedToken>(token);
        const userId = decoded?.id || decoded?._id;
        if (!userId) {
          console.warn("User ID not found in token");
          return;
        }
        console.log("User ID:", userId);
        const res = await axios.get(`http://localhost:5600/api/auth/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        setUpdatedUser({
          ...updatedUser,
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          location: res.data.location
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUserDetails();
  }, []);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file && user) {
      // This only previews the image. You would need to handle uploading to server separately.
      setUser({ ...user, profilePicture: URL.createObjectURL(file) });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location")) {
      setUpdatedUser({
        ...updatedUser,
        location: {
          ...updatedUser.location,
          [name.split(".")[1]]: value
        }
      });
    } else {
      setUpdatedUser({
        ...updatedUser,
        [name]: value
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Token not found");
        return;
      }

      const userId = jwtDecode<DecodedToken>(token)?.id;
      if (!userId) {
        console.warn("User ID not found in token");
        return;
      }

      await axios.put(`http://localhost:5600/api/auth/updateProfile/${userId}`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Close the modal and update the user details
      setShowModal(false);
      setUser({
        ...user,
        ...updatedUser
      });
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[85vh] bg-[#FAFAFA] dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-8 border border-[#E0E0E0] dark:border-gray-700">
          {/* Profile Picture */}
          <div className="flex flex-col items-center text-center">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                onError={() => setUser({ ...user, profilePicture: "" })}
                className="w-40 h-40 rounded-full border-4 border-[#FF6B00] object-cover"
              />
            ) : (
              <div className="w-40 h-40 flex items-center justify-center rounded-full border-4 border-[#FF6B00] bg-gray-200 dark:bg-gray-700">
                <User className="w-16 h-16 text-gray-500 dark:text-gray-300" />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="mt-4 p-2 text-sm text-[#FF6B00] bg-transparent border-2 border-[#FF6B00] rounded-md cursor-pointer dark:text-orange-400 dark:border-orange-400"
            />

            <h2 className="text-xl font-semibold text-[#2D2D2D] dark:text-white mt-4">
              {user.name}
            </h2>
            <p className="text-sm text-[#888] dark:text-gray-400 capitalize">
              {user.role} Partner
            </p>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <h3 className="text-2xl font-bold text-[#2D2D2D] dark:text-white mb-2">
              Profile Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#2D2D2D] dark:text-gray-200">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>City:</strong> {user.location?.city}</p>
              <p><strong>Address:</strong> {user.location?.location}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={user.status === "active" ? "text-green-600" : "text-red-600"}>
                  {user.status}
                </span>
              </p>
              <p><strong>Joined:</strong> {user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : "N/A"}</p>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="ml-20 mt-10 block bg-[#FF6B00] text-white px-6 py-2 rounded-lg hover:bg-[#e65a00] transition dark:bg-orange-500 dark:hover:bg-orange-600"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg">
      <h2 className="text-2xl font-semibold text-[#2D2D2D] dark:text-white mb-4">
        Update Profile
      </h2>
      <div className="space-y-4">
        <input
          type="text"
          name="name"
          value={updatedUser.name}
          onChange={handleChange}
          className="w-full p-2 border border-[#E0E0E0] rounded-md text-[#2D2D2D] dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          placeholder="Full Name"
        />
        <input
          type="email"
          name="email"
          value={updatedUser.email}
          onChange={handleChange}
          className="w-full p-2 border border-[#E0E0E0] rounded-md text-[#2D2D2D] dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          placeholder="Email"
        />
        <input
          type="text"
          name="phone"
          value={updatedUser.phone}
          onChange={handleChange}
          className="w-full p-2 border border-[#E0E0E0] rounded-md text-[#2D2D2D] dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          placeholder="Phone"
        />
        <input
          type="text"
          name="location.city"
          value={updatedUser.location.city}
          onChange={handleChange}
          className="w-full p-2 border border-[#E0E0E0] rounded-md text-[#2D2D2D] dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          placeholder="City"
        />
        <input
          type="text"
          name="location.location"
          value={updatedUser.location.location}
          onChange={handleChange}
          className="w-full p-2 border border-[#E0E0E0] rounded-md text-[#2D2D2D] dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          placeholder="Address"
        />
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={() => setShowModal(false)}
            className="bg-gray-300 dark:bg-gray-600 dark:text-white text-[#2D2D2D] px-6 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#FF6B00] text-white px-6 py-2 rounded-md hover:bg-[#e65a00] dark:hover:bg-orange-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Profile;
