import {configureStore, createSlice} from '@reduxjs/toolkit'
import {apiSlice} from './api/apiSlice'
import { chatApiSlice } from '../features/chat/chatApiSlice'
import { setupListeners } from "@reduxjs/toolkit/query"
import authReducer from '../features/auth/authSlice'
import { appointmentsReducer } from '../features/appointments/appointmentsApiSlice'

const apiResetSlice = createSlice({
    name: 'apiReset',
    initialState: false,
    reducers: {
        setApiReset: (state, action) => action.payload,
      },
  });
  
  export const { setApiReset } = apiResetSlice.actions;
  export default apiResetSlice.reducer;

  export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        [chatApiSlice.reducerPath]: chatApiSlice.reducer,
        auth: authReducer,
        apiReset: apiResetSlice.reducer,
        appointments: appointmentsReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware, chatApiSlice.middleware),
    devTools: false
})


setupListeners(store.dispatch)