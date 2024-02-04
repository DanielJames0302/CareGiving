import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedIn: false,
  email: '',
  isAdmin: false,
  userId: '',
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.email = action.payload.email;
      state.isAdmin = action.payload.isAdmin;
      state.userId = action.payload.userId
      console.log(state)
    },
    logout: state => {
      state.isLoggedIn = false;
      state.email = '';
      state.isAdmin = false;
      state.userId = '';
    },
    updateUsername: (state, action) => {
      state.username = action.payload;
    },
  }
})

export const { login, logout, setStaff, setSuperuser, updateUsername } = authSlice.actions

export default authSlice.reducer
