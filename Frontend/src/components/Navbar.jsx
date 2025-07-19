"use client"

import { useState, useEffect, React } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, User, Clock, ChevronDown, Home } from "lucide-react"
import axiosInstance from "../utils/axiosConfig"
import { useAuth } from "../utils/authContext"

export default function Navbar({ onLogoutClick, setSearch }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { isLoggedIn, setIsLoggedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/") // Navigate when logged in changes to true
    }
  }, [isLoggedIn, navigate])

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.post("/user/logout")
      setIsLoggedIn(false)
      navigate("/")
      window.location.reload()
    } catch (e) {
      console.log(e)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    navigate("/searchResults")
  }

  return (
    <nav className="bg-black w-full">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-gray-300">
              <Home className="h-6 w-6" />
            </Link>
            <Link to="/" className="text-2xl font-bold text-white">
              Movie Mate
            </Link>
            <div className="hidden md:flex space-x-6">
              <NavLink href="/movies">Recommanded Movies</NavLink>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <form onSubmit={handleSubmit}>
                <input
                  onChange={(e) => setSearch(e.target.value)}
                  type="search"
                  placeholder="Search"
                  className="w-64 rounded-full bg-white/10 px-5 py-2 text-white placeholder-gray-400 focus:bg-white focus:text-black focus:outline-none"
                />
                <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </form>
            </div>

            <Link to="/watchlist" className="flex items-center space-x-2 text-white hover:text-gray-300">
              <Clock className="h-5 w-5" />
              <span>Watch Later</span>
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20"
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-lg bg-white p-4 shadow-xl z-10" style={{zindex:5}}>
                  <ProfileMenu onClose={() => setIsProfileOpen(false)} />
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="rounded-full bg-red-500 px-6 py-2 font-medium text-white hover:bg-red-400"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, children }) {
  return (
    <Link to={href} className="text-base font-medium text-gray-300 hover:text-white">
      {children}
    </Link>
  )
}

function ProfileMenu({ onClose }) {
  useEffect(()=>{fetchUserdata()},[])
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
  
  })

  const handleSave = async () => {
    setIsEditing(false)
    try{
      const res = await axiosInstance.post("/user/updateUser",userData);
      console.log(res);
      setUserData(res.data)
    }
    catch(e){
      console.log(e);
    }
  }
  const fetchUserdata = async()=>{
    try{
      const res = await axiosInstance.get("/user");
      console.log(res.data);
      setUserData(res.data)
    }
    catch(e){
      console.log(e);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2 z-10">
        <h3 className="text-lg font-semibold">Profile</h3>
        {isEditing ? (
          <button onClick={handleSave} className="text-sm font-medium text-green-600 hover:text-green-700">
            Save
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Edit
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700">Username</label>
          {isEditing ? (
            <input
              type="text"
              value={userData.username}
              onChange={(e) => setUserData({ ...userData, username: e.target.value })}
              className="mt-1 w-full rounded-md border p-2"
            />
          ) : (
            <div className="mt-1 text-gray-900">{userData.username}</div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          {isEditing ? (
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className="mt-1 w-full rounded-md border p-2"
            />
          ) : (
            <div className="mt-1 text-gray-900">{userData.email}</div>
          )}
        </div>
      </div>
    </div>
  )
}
