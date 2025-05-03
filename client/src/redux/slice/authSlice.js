import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    isGoogleid: false,
}

const authSlice = createSlice({
    name: "authSlice", initialState, reducers: {
        setGoogleID: (state) => {
            state.isGoogleid = true;
        },
        login: (state) => {
            state.status = true;
        },
        logout: (state) => {
            state.status = false;
            state.isGoogleid = false;
        },
        reset: () => initialState
    }
});

export const { login, logout, reset, setGoogleID } = authSlice.actions;
export default authSlice.reducer;