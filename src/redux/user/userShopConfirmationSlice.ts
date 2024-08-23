import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI, endpoints } from "../../utils/api";

interface ShopConfirmationInfo {
    citizen_identification_image: string,
    shop_name: string,
    shop_image: string,
    shop_description: string,
    created_date: string
    updated_date: string,
    status: string,
    user: string
}

interface ShopConfirmation {
    status: 'idle' | 'pending' | 'success' | 'failed';
    error: string | null;
    info: ShopConfirmationInfo | null;
}

const initialState: ShopConfirmation = {
    status: 'idle',
    error: null,
    info: null
};

export const getShopConfirmation = createAsyncThunk(
    'userShopConfirmation/getShopConfirmation',
    async (userId: number) => {
        const axiosInstance = await authAPI();
        const response = await axiosInstance.get(endpoints.shopConfirmation(userId));
        return response.data
    }
)

const userShopConfirmationSlice = createSlice({
    name: 'userShopConfirmation',
    initialState,
    reducers: {
        clearShopConfirmation: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getShopConfirmation.pending, (state) => {
                state.status = 'pending';
                state.error = null;
            })
            .addCase(getShopConfirmation.fulfilled, (state, action) => {
                state.status = 'success';
                state.error = null;
                state.info = action.payload
            })
            .addCase(getShopConfirmation.rejected, (state) => {
                state.status = 'failed';
                state.error = 'No ShopConfirmation';
            });
    }
})

export const {clearShopConfirmation} = userShopConfirmationSlice.actions
export default userShopConfirmationSlice.reducer