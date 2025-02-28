import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Role {
    _id: string;
    name: string;
    descendants: any[];
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface Permission {
    resource: string;
    permission: string;
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
    user: User | null;
}

const initialState: UserState = {
    user: null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {

        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
        clearUser(state) {
            state.user = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;