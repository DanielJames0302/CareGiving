import { configureStore } from '@reduxjs/toolkit'
import  userReducer  from './auth-slice'

export default configureStore({
  reducer: {
    user: userReducer
  }
})