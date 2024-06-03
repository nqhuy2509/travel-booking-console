import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../api/auth.api';
export interface IAuthState {
    currentUser: IUser | null;
    error: null;
    loading: boolean;
}

const initialState: IAuthState = {
    currentUser: null,
    error: null,
    loading: false
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
        },
        loginSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        logoutStart: (state) => {
            state.loading = true;
        },
        logoutSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        logoutFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logoutStart,
    logoutSuccess,
    logoutFailure
} = authSlice.actions;

export default authSlice.reducer;
