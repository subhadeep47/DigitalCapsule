import { login, logout } from "./authSlicer"
import {
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
} from "./capsulesSlicer"

export const ACTION_TYPES = {
  // Auth actions
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",

  // Data actions
  SET_MY_CAPSULES: "SET_MY_CAPSULES",
  SET_RECEIVED_CAPSULES: "SET_RECEIVED_CAPSULES",
  ADD_CAPSULE: "ADD_CAPSULE",
  REMOVE_CAPSULE: "REMOVE_CAPSULE",

  // UI actions
  SET_SEARCH_QUERY: "SET_SEARCH_QUERY",
  SET_ACTIVE_TAB: "SET_ACTIVE_TAB",
  SET_SELECTED_CAPSULE: "SET_SELECTED_CAPSULE",
  SET_MODAL_OPEN: "SET_MODAL_OPEN",

  // Error actions
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
}

export const dispatchAction = (dispatch, type, payload) => {
  switch (type) {
    // Auth actions
    case ACTION_TYPES.LOGIN:
      dispatch(login())
      break
    case ACTION_TYPES.LOGOUT:
      dispatch(logout())
      break

    // Data actions
    case ACTION_TYPES.SET_MY_CAPSULES:
      dispatch(setMyCapsules(payload))
      break
    case ACTION_TYPES.SET_RECEIVED_CAPSULES:
      dispatch(setReceivedCapsules(payload))
      break
    case ACTION_TYPES.ADD_CAPSULE:
      dispatch(addCapsule(payload))
      break
    case ACTION_TYPES.REMOVE_CAPSULE:
      dispatch(removeCapsule(payload))
      break

    // UI actions
    case ACTION_TYPES.SET_SEARCH_QUERY:
      dispatch(setSearchQuery(payload))
      break
    case ACTION_TYPES.SET_ACTIVE_TAB:
      dispatch(setActiveTab(payload))
      break
    case ACTION_TYPES.SET_SELECTED_CAPSULE:
      dispatch(setSelectedCapsule(payload))
      break
    case ACTION_TYPES.SET_MODAL_OPEN:
      dispatch(setModalOpen(payload))
      break

    // Error actions
    case ACTION_TYPES.SET_ERROR:
      dispatch(setError(payload))
      break
    case ACTION_TYPES.CLEAR_ERROR:
      dispatch(clearError())
      break

    default:
      console.warn(`Unknown action type: ${type}`)
  }
}
