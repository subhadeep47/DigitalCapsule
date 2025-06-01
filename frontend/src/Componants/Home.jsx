import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const Home = () => {
  const [isLoggedIn] = useState(localStorage.getItem("isLoggedIn"));
  const navigate = useNavigate();

  const handleLinkClick = (e) => {
    // Prevent default link behavior if not logged in
    if (!isLoggedIn) {
      e.preventDefault();  // Prevents the navigation
      window.alert('To create a time capsule you need to log in first!!!');
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-indigo-800 text-white flex flex-col items-center justify-center px-4">
      
      {/* Hero Section */}
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-4xl md:text-6xl font-extrabold text-center mb-4"
      >
        Save Your Memories,  
        <br />
        Unlock Your Future ✨
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="text-lg md:text-xl text-gray-200 text-center max-w-2xl"
      >
        Store your thoughts, letters, and memories in a **Time Capsule**.  
        Open them in the future and relive your journey. 🚀  
      </motion.p>

      {/* Call-to-Action Button */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        className="mt-10"
        >
        <Link
            to={isLoggedIn ? "/create" : "#"}
            onClick={handleLinkClick}
            className="px-6 py-3 bg-white text-blue-600 font-semibold text-lg rounded-full shadow-lg hover:bg-gray-200 transition duration-300"
        >
            Create Your Capsule 🚀
        </Link>
    </motion.div>


      {/* Features Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
      >
        {[
          { icon: "🔒", title: "Secure & Private", desc: "Your memories are encrypted and stored safely." },
          { icon: "📅", title: "Set Unlock Dates", desc: "Choose when you want to open your capsule." },
          { icon: "🎭", title: "Public or Private", desc: "Keep it personal or share it with the world." }
        ].map((feature, index) => (
          <motion.div 
            key={index}
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl text-center shadow-lg transition-transform"
          >
            <h3 className="text-xl font-semibold">{feature.icon} {feature.title}</h3>
            <p className="text-gray-300 mt-2">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
}

export default Home;
