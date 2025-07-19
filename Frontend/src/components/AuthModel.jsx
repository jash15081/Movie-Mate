import { useState, useEffect } from "react";
import { X } from "lucide-react";
import axiosInstance from "../utils/axiosConfig";
import { useAuth } from "../utils/authContext";
import { useNavigate } from "react-router-dom";

export default function AuthModal({ isOpen, onClose, activeTab, onTabChange }) {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: ""
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/"); // Navigate when logged in changes to true
    }
  }, [isLoggedIn, navigate]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setMessage({ text: "", type: "" }); // Clear message on input change
    setErrors({ ...errors, [id]: "" }); // Clear validation errors on input change
  }

  function validateForm(isRegistering) {
    let newErrors = {};
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (isRegistering) {
      if (!formData.username || formData.username.length > 15 || !/^[a-zA-Z0-9]+$/.test(formData.username)) {
        newErrors.username = "Username must be up to 15 characters, letters and numbers only";
      }
      if (!formData.password || formData.password.length < 6 || !/\d/.test(formData.password) || !/[!@#$%^&*]/.test(formData.password)) {
        newErrors.password = "Password must be at least 6 characters, include a number and a special character";
      }
    }
    if (!isRegistering && !formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function register(e) {
    e.preventDefault();
    if (!validateForm(true)) return;
    try {
      const response = await axiosInstance.post("/user/register", {
        email: formData.email,
        username: formData.username,
        password: formData.password
      });
      setMessage({ text: response.data.message, type: "success" });
      onTabChange("signin");
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Registration failed", type: "error" });
      console.log(error)
    }
  }

  async function login(e) {
    e.preventDefault();
    if (!validateForm(false)) return;
    try {
      const response = await axiosInstance.post("/user/login", {
        email: formData.email,
        password: formData.password
      });
      setMessage({ text: response.data.message, type: "success" });
      setIsLoggedIn(true);
      navigate("/");
      onClose();
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Login failed", type: "error" });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <div className="flex items-center justify-between">
          <img src="https://www.metacritic.com/images/icons/metacritic-icon.svg" alt="Metacritic" className="h-8 w-8" />
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 flex border-b">
          <button className={`flex-1 border-b-2 pb-2 text-center font-medium ${activeTab === "register" ? "border-black text-black" : "border-transparent text-gray-500"}`} onClick={() => onTabChange("register")}>Register</button>
          <button className={`flex-1 border-b-2 pb-2 text-center font-medium ${activeTab === "signin" ? "border-black text-black" : "border-transparent text-gray-500"}`} onClick={() => onTabChange("signin")}>Sign In</button>
        </div>

        {message.text && (
          <div className={`mt-4 rounded-md p-2 text-center ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{message.text}</div>
        )}

        {activeTab === "register" ? (
          <form className="mt-6 space-y-4" onSubmit={register}>
            <div>
              <label htmlFor="email" className="block font-medium">Email</label>
              <input type="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 p-2" />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="username" className="block font-medium">Username</label>
              <input type="text" id="username" value={formData.username} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 p-2" />
              {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block font-medium">Password</label>
              <input type="password" id="password" value={formData.password} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 p-2" />
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>

            <button type="submit" className="w-full rounded-md bg-gray-800 py-2 font-medium text-white hover:bg-gray-700">Register</button>
          </form>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={login}>
            <div>
              <label htmlFor="email" className="block font-medium">Email</label>
              <input type="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 p-2" />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block font-medium">Password</label>
              <input type="password" id="password" value={formData.password} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 p-2" />
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>

            <button type="submit" className="w-full rounded-md bg-gray-800 py-2 font-medium text-white hover:bg-gray-700">Sign In</button>
          </form>
        )}
      </div>
    </div>
  );
}
