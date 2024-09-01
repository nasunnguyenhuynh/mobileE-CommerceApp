import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReceiverInformation } from "../../interfaces/receiverinfo";

interface ReInfo {
    reInfoList: ReceiverInformation[]
}

const initialState: ReInfo = {
    reInfoList: [],
}

const reInfoSlice = createSlice({
    name: 'receiverInformation',
    initialState,
    reducers: {
        addReInfo: (state, action: PayloadAction<ReceiverInformation>) => {
            state.reInfoList = [...state.reInfoList, action.payload]
        },
        addReInfoList: (state, action: PayloadAction<ReceiverInformation[]>) => {
            state.reInfoList = [...action.payload]
        },
        clearReInfo: () => initialState,
    }
})

export const { addReInfo, addReInfoList, clearReInfo } = reInfoSlice.actions;
export default reInfoSlice.reducer
