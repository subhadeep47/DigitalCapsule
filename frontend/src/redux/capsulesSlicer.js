import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  myCapsules: [],
  receivedCapsules: [],
  selectedCapsule: null,
  isModalOpen: false,
  searchQuery: "",
  activeTab: "my-capsules",
  error: null,
}

const capsulesSlicer = createSlice({
  name: "capsules",
  initialState,
  reducers: {
    // Data actions
    setMyCapsules(state, action) {
      state.myCapsules = action.payload
    },
    setReceivedCapsules(state, action) {
      state.receivedCapsules = action.payload
    },
    addCapsule(state, action) {
      state.myCapsules.push(action.payload)
    },
    removeCapsule(state, action) {
      state.myCapsules = state.myCapsules.filter((capsule) => capsule.id !== action.payload)
      state.receivedCapsules = state.receivedCapsules.filter((capsule) => capsule.id !== action.payload)
    },

    // UI actions
    setSearchQuery(state, action) {
      state.searchQuery = action.payload
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload
    },
    setSelectedCapsule(state, action) {
      state.selectedCapsule = action.payload      
    },
    setModalOpen(state, action) {
      state.isModalOpen = action.payload
    },

    // Error handling
    setError(state, action) {
      state.error = action.payload
    },
    clearError(state) {
      state.error = null
    },
  },
})

export const {
  setMyCapsules,
  setReceivedCapsules,
  addCapsule,
  removeCapsule,
  setSearchQuery,
  setActiveTab,
  setSelectedCapsule,
  setModalOpen,
  setError,
  clearError,
} = capsulesSlicer.actions

export default capsulesSlicer
