// redux-store/actionDispatcher.js
import { login, logout } from './authSlicer';

export const ACTION_TYPES = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT'
};

export const dispatchAction = (dispatch, type, payload) => {
  switch (type) {
    case ACTION_TYPES.LOGIN:
      dispatch(login());
      break;
    case ACTION_TYPES.LOGOUT:
      dispatch(logout());
      break;
    default:
      console.warn(`Unknown action type: ${type}`);
  }
};
