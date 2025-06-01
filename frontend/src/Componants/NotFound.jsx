import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      
      {/* Animated 404 Number */}
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-8xl font-extrabold text-blue-500 drop-shadow-lg"
      >
        404
      </motion.h1>

      {/* Funny Message */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="text-lg text-gray-300 mt-4 text-center max-w-md"
      >
        Oops! Looks like you traveled to the past... or the future?  
        Either way, this page doesn't exist. 🚀
      </motion.p>

      {/* Back to Home Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        className="mt-10"
      >
        <Link
          to="/"
          className="px-6 py-3 bg-blue-500 text-white font-semibold text-lg rounded-full shadow-lg hover:bg-blue-400 transition duration-300"
        >
          Back to Home 🏠
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;
