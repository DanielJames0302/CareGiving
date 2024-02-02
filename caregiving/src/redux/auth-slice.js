import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedIn: false,
  username: '',
  isVerified: false,
  isAdmin: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.username = action.payload.username;
      state.isVerified = true;
      state.isAdmin = action.payload.isAdmin;
    },
    logout: state => {
      state.isLoggedIn = false;
      state.isAdmin = false;
      state.isVerified = true;
    },
    updateUsername: (state, action) => {
      state.username = action.payload;
    },
  }
})

export const { login, logout, setStaff, setSuperuser, updateUsername } = authSlice.actions

export default authSlice.reducer
