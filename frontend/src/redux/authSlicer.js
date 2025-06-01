import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: !!localStorage.getItem('token')
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state) {
      state.isLoggedIn = true;
      localStorage.setItem('isLoggedIn', true);
    },
    logout(state) {
      state.isLoggedIn = false;
      localStorage.removeItem('isLoggedIn');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice;
