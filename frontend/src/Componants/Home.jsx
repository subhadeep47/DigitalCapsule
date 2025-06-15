"use client"

import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import { ArrowRight, Shield, Calendar, Users, Sparkles } from "lucide-react"

const Home = () => {
  const navigate = useNavigate()
  const { isLoggedIn } = useSelector((state) => state.auth)
  const loggedIn = isLoggedIn || localStorage.getItem("isLoggedIn")

  const handleCreateCapsuleClick = (e) => {
    if (!loggedIn) {
      e.preventDefault()
      if (
        window.confirm("You need to log in first to create a time capsule. Would you like to go to the login page?")
      ) {
        navigate("/auth")
      }
    }
  }

  const features = [
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your memories are encrypted and stored safely with enterprise-grade security.",
      color: "text-green-500",
    },
    {
      icon: Calendar,
      title: "Set Unlock Dates",
      description: "Choose exactly when you want to open your capsule and relive those memories.",
      color: "text-blue-500",
    },
    {
      icon: Users,
      title: "Share with Others",
      description: "Send time capsules to friends and family to surprise them in the future.",
      color: "text-purple-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-800 text-white overflow-hidden">
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6"
          >
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Save Your Memories,
              <br />
              Unlock Your Future
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed"
          >
            Store your thoughts, letters, and precious memories in a digital time capsule.
            <br />
            Open them in the future and relive your incredible journey.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to={loggedIn ? "/create" : "#"}
              onClick={handleCreateCapsuleClick}
              className="group px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-full shadow-2xl hover:shadow-3xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              Create Your Capsule
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            
            {!loggedIn && (
              <Link
                to="/auth"
                className="px-8 py-4 border-2 border-white text-white font-semibold text-lg rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Get Started Free
              </Link>
            )}
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
          className="w-full max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Time Capsule?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group p-8 bg-white/10 backdrop-blur-lg rounded-3xl text-center shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-white/10 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-200 transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-blue-100 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-20 text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "10K+", label: "Capsules Created" },
              { number: "5K+", label: "Happy Users" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-200 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Home
