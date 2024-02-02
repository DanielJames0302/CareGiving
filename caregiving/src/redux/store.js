import { configureStore } from 'react-redux'
import  useReducer  from './auth-slice'

export default configureStore({
  reducer: {
    user: useReducer
  }
})