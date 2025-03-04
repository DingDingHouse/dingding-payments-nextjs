import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Permission {
    resource: string;
    permission: string;
}

interface Role {
    _id: string;
    name: string;
    descendants: string[];
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface User {
    _id: string;
    name: string;
    username: string;
    role: Role;
    status: string;
    permissions: Permission[];
}

interface UserState {
    currentUser: User | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    currentUser: null,
    isLoading: false,
    error: null,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.currentUser = action.payload;
            state.error = null;
        },
        clearUser: (state) => {
            state.currentUser = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
});

export const { setUser, clearUser, setLoading, setError } = usersSlice.actions;
export default usersSlice.reducer;