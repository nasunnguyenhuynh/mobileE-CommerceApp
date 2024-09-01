import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MyVoucher } from "../../interfaces/voucher";
interface VoucherState {
    vouchers: MyVoucher[],
}

const initialState: VoucherState = {
    vouchers: []
}

const voucherSlice = createSlice({
    name: 'voucher',
    initialState,
    reducers: {
        addVoucher: (state, action: PayloadAction<MyVoucher>) => {
            const { id, is_multiple, conditions } = action.payload;
            // Voucher has already saved ?
            const existingVoucher = state.vouchers.find(voucher => voucher.id === id)
            if (existingVoucher) {
                const existingCondition = existingVoucher.conditions.find(cond => cond.id === conditions[0].id);
                // Can users save more than 1 ?
                if (is_multiple && existingCondition) {
                    existingCondition.quantity += 1;
                }
                else if (!is_multiple) {
                }
            }
            else {
                state.vouchers = [...state.vouchers, action.payload]
            }
        },
        addVouchers: (state, action: PayloadAction<MyVoucher[]>) => {
            state.vouchers = [...action.payload]
        },
        removeVoucher: ((state, action: PayloadAction<{ id: number }>) => {
            state.vouchers.filter(voucher => voucher.id !== action.payload.id)
        }),
        clearVoucher: () => initialState  // clear voucherState not voucher in storage
    }
})

export const { addVoucher, addVouchers, removeVoucher, clearVoucher } = voucherSlice.actions;
export default voucherSlice.reducer