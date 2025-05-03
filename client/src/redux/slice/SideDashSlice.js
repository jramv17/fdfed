import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    collapsed: false,
    iconvisibility: false,
}

const SideBar = createSlice({
    name: "sideDashSlice", initialState, reducers: {
        toggleSideBar: (state) => {
            state.collapsed = !state.collapsed;
        },
        toggleIconVisibility: (state, action) => {
            state.iconvisibility = action.payload;
        },
        reset: () => initialState

    }
});

export const { toggleSideBar, reset, toggleIconVisibility } = SideBar.actions;
export default SideBar.reducer;