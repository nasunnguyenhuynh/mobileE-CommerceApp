import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI, endpoints } from "../../utils/api";

interface UserInfo {
    id: number;
    username: string;
    avatar: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    birthday: string;
    is_vendor: boolean;
}

interface UserState {
    status: 'idle' | 'pending' | 'success' | 'failed';
    info: UserInfo | null;
    error: string | null;
}

const initialState: UserState = {
    status: 'idle',
    info: null,
    error: null
};

export const currentUser = createAsyncThunk(
    'user/currentUser',
    async () => {
        const axiosInstance = await authAPI();
        const response = await axiosInstance.get(endpoints.currentUser);
        return response.data
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUser: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(currentUser.pending, (state) => {
                state.status = 'pending';
                state.info = null;
                state.error = null;
            })
            .addCase(currentUser.fulfilled, (state, action) => {
                state.status = 'success';
                state.info = action.payload;
                state.error = null;
            })
            .addCase(currentUser.rejected, (state) => {
                state.status = 'failed';
                state.error = 'Some thing went wrong, plz try again';
            });
    }
})

export const { clearUser } = userSlice.actions;
export default userSlice.reducer