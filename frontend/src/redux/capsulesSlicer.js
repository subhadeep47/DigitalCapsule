import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  myCapsules: [],
  receivedCapsules: [],
  myPagination: null,
  receivedPagination: null,
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
      state.myCapsules = action.payload.capsules || action.payload
      state.myPagination = action.payload.pagination || null
    },
    setReceivedCapsules(state, action) {
      state.receivedCapsules = action.payload.capsules || action.payload
      state.receivedPagination = action.payload.pagination || null
    },
    addCapsule(state, action) {
      state.myCapsules.unshift(action.payload) // Add to beginning
      // Update pagination if it exists
      if (state.myPagination) {
        state.myPagination.totalItems += 1
      }
    },
    removeCapsule(state, action) {
      state.myCapsules = state.myCapsules.filter((capsule) => capsule.id !== action.payload)
      state.receivedCapsules = state.receivedCapsules.filter((capsule) => capsule.id !== action.payload)
      // Update pagination if it exists
      if (state.myPagination) {
        state.myPagination.totalItems = Math.max(0, state.myPagination.totalItems - 1)
      }
      if (state.receivedPagination) {
        state.receivedPagination.totalItems = Math.max(0, state.receivedPagination.totalItems - 1)
      }
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
