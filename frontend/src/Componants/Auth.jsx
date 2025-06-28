"use client"

import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react"
import api from "../Utils/api"
import { ACTION_TYPES, dispatchAction } from "../redux/actionDispatcher"

const Auth = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isRegister, setIsRegister] = useState(searchParams.get("register") === "true")
  const [userDetails, setUserDetails] = useState({ name: "", email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoggedIn } = useSelector((state) => state.auth)

  // Redirect if already logged in
  useEffect(() => {
    const loggedIn = isLoggedIn || localStorage.getItem("isLoggedIn")
    if (loggedIn) {
      dispatchAction(dispatch, ACTION_TYPES.LOGIN)
      navigate("/dashboard")
    }
  }, [isLoggedIn, navigate, dispatch])

  // Update form mode based on URL params
  useEffect(() => {
    const registerParam = searchParams.get("register") === "true"
    setIsRegister(registerParam)
    // Clear form when switching modes
    setUserDetails({ name: "", email: "", password: "" })
    setErrors({})
  }, [searchParams])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserDetails((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (isRegister && !userDetails.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!userDetails.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(userDetails.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!userDetails.password) {
      newErrors.password = "Password is required"
    } else if (userDetails.password.length < 5) {
      newErrors.password = "Password must be at least 5 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login"
      const response = await api.post(endpoint, userDetails)

      if(isRegister){
        alert("Account created successfully!")
        navigate('/')
      }
      else{
        // Store auth token if provided
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token)
        }
        localStorage.setItem("isLoggedIn", true)
        dispatchAction(dispatch, ACTION_TYPES.LOGIN)
        alert("Welcome back!")
        navigate("/dashboard")
      }
    } catch (err) {
      console.error("Auth error:", err)
      const errorMessage =
        err.response?.data?.message || (isRegister ? "Failed to create account" : "Invalid email or password")
      setErrors({ submit: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    const newMode = !isRegister
    setSearchParams(newMode ? { register: "true" } : {})
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center px-4 py-8">      
      <motion.div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 text-white text-center">
          <motion.h2
            key={isRegister ? "register" : "login"}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-bold"
          >
            {isRegister ? "Create Account" : "Welcome Back"}
          </motion.h2>
          <p className="text-purple-100 mt-1">
            {isRegister ? "Join us to start creating time capsules" : "Sign in to your account"}
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-6">
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
            >
              {errors.submit}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.form
              key={isRegister ? "register-form" : "login-form"}
              onSubmit={handleSubmit}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {isRegister && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={userDetails.name}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                        errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={userDetails.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                      errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={userDetails.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.password ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    {isRegister ? "Create Account" : "Sign In"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium hover:underline transition-colors duration-200"
            >
              {isRegister
                ? "Already have an account? Sign In"
                : "Don't have an account? Create one"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Auth
