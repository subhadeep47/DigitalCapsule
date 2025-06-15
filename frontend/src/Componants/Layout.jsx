"use client"

import { Outlet } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { ACTION_TYPES, dispatchAction } from "../redux/actionDispatcher"

const Layout = () => {
  const dispatch = useDispatch()

  // Initialize auth state from localStorage on app load
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (isLoggedIn) {
      dispatchAction(dispatch, ACTION_TYPES.LOGIN)
    }
  }, [dispatch])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
