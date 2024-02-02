import { configureStore } from '@reduxjs/toolkit'
import  useReducer  from './auth-slice'

export default configureStore({
  reducer: {
    user: useReducer
  }
})