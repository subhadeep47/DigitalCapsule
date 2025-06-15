"use client"

import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import { Menu, X, User, LogOut, Home, Plus } from "lucide-react"
import api from "../Utils/api"
import { ACTION_TYPES, dispatchAction } from "../redux/actionDispatcher"

const Navbar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const { isLoggedIn } = useSelector((state) => state.auth)
  const loggedIn = isLoggedIn || localStorage.getItem("isLoggedIn")

  const handleLogout = async () => {
    if (isLoggingOut) return

    if (!window.confirm("Are you sure you want to logout?")) {
      return
    }

    try {
      setIsLoggingOut(true)
      await api.post("/auth/logout")

      // Clear all auth data
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("authToken")

      dispatchAction(dispatch, ACTION_TYPES.LOGOUT)
      navigate("/")
    } catch (err) {
      console.error("Logout error:", err)
      alert("Unable to logout due to technical issues. Please try again.")
    } finally {
      setIsLoggingOut(false)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <nav className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              className="text-xl font-bold text-white hover:text-blue-200 transition-colors duration-200 flex items-center"
              onClick={closeMobileMenu}
            >
              <span className="mr-2">⏰</span>
              Time Capsule
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {loggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 transition-colors duration-200"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/create"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 transition-colors duration-200"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Capsule
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-400 rounded-md text-sm font-medium text-white transition-colors duration-200"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 transition-colors duration-200"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                  <Link
                    to="/auth?register=true"
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md text-sm font-medium text-white transition-colors duration-200"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-white hover:bg-white/10 transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-blue-700 border-t border-blue-500 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {loggedIn ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={closeMobileMenu}
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 transition-colors duration-200"
                    >
                      <Home className="mr-3 h-5 w-5" />
                      Dashboard
                    </Link>
                    <Link
                      to="/create"
                      onClick={closeMobileMenu}
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 transition-colors duration-200"
                    >
                      <Plus className="mr-3 h-5 w-5" />
                      Create Capsule
                    </Link>
                    <button
                      onClick={() => {
                        closeMobileMenu()
                        handleLogout()
                      }}
                      disabled={isLoggingOut}
                      className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-200 hover:bg-red-600/20 transition-colors duration-200"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth"
                      onClick={closeMobileMenu}
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 transition-colors duration-200"
                    >
                      <User className="mr-3 h-5 w-5" />
                      Login
                    </Link>
                    <Link
                      to="/auth?register=true"
                      onClick={closeMobileMenu}
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium bg-green-500 hover:bg-green-600 transition-colors duration-200 mx-3 mt-2"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar
