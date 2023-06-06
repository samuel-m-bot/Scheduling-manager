import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: { token: null, role: null },  // add role to the state
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken, role } = action.payload  // destructure role from the payload
            state.token = accessToken
            state.role = role  // set the role in state
        },
        logOut: (state, action) => {
            state.token = null
            state.role = null  // clear the role when logging out
        },
    }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token
export const selectCurrentUserRole = (state) => state.auth.role  // selector to get the role from state
