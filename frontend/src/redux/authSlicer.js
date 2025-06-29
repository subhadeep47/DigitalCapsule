import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: localStorage.getItem('isLoggedIn')
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
    currentUser(state, action){
      state.user = action.payload;
    }
  },
});

export const { login, logout, currentUser } = authSlice.actions;
export default authSlice;
