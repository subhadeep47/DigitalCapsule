import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../Utils/api";
import { useDispatch } from "react-redux";
import { ACTION_TYPES, dispatchAction } from "../redux/actionDispatcher";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get("register") === "true");
  const [userDetails, setUserDetails] = useState({name: '', email: '', password: ''});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redirect if already logged in
  useEffect(() => {
    const user = localStorage.getItem("isLoggedIn"); // Replace with your auth logic
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    if(searchParams.get("register") === "true"){
        setIsRegister(true);
    }
    else{
        setIsRegister(false);
    }
  }, [searchParams]);

  const handleOnChange = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    setUserDetails({...userDetails,[key]:value});
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post(isRegister ? '/auth/register' : '/auth/login', userDetails).then(res => {
      dispatchAction(dispatch, ACTION_TYPES.LOGIN);
      navigate("/dashboard");
    }).catch( err => {
      console.log(err);
      window.alert('Email/password is not correct!');
    }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center px-4">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md relative"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">
          {isRegister ? "Create an Account" : "Welcome Back"}
        </h2>

        <AnimatePresence mode="wait">
          <motion.form
            key={isRegister ? "signup" : "login"}
            onSubmit={handleSubmit}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isRegister && (
              <input
                type="text"
                placeholder="Full Name"
                name="name"
                value={userDetails.name}
                onChange={handleOnChange}
                className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={userDetails.email}
              onChange={handleOnChange}
              className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={userDetails.password}
              onChange={handleOnChange}
              className="w-full mb-6 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
            >
              {isRegister ? "Sign Up" : "Log In"}
            </button>
          </motion.form>
        </AnimatePresence>

        <button
          onClick={() => setIsRegister((prev) => !prev)}
          className="mt-6 text-indigo-600 text-sm hover:underline block text-center"
        >
          {isRegister
            ? "Already have an account? Log In"
            : "Don't have an account? Sign Up"}
        </button>
      </motion.div>
    </div>
  );
};

export default Auth;
