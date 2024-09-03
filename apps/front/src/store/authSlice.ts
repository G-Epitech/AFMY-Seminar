import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface IAuthState {
    user?: string | null;
}

const initialState: IAuthState = {
    user: undefined,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IAuthState['user']>) => {
            state.user = action.payload;
        },
    },
});

export const { setUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
