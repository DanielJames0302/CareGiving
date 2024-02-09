import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedIn: false,
  email: '',
  isAdmin: false,
  userId: '',
  name: ''
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.email = action.payload.email;
      state.isAdmin = action.payload.isAdmin;
      state.userId = action.payload.userId;
      state.name = action.payload.name
    },
    logout: state => {
      state.isLoggedIn = false;
      state.email = '';
      state.isAdmin = false;
      state.userId = '';
      state.name = '';
    },
    updateUsername: (state, action) => {
      state.username = action.payload;
    },
  }
})

export const { login, logout, setStaff, setSuperuser, updateUsername } = authSlice.actions

export default authSlice.reducer
