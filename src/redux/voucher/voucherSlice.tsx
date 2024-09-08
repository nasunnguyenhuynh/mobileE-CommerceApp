import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MyVoucher } from "../../interfaces/voucher";
import { authAPI, endpoints } from "../../utils/api";
interface VoucherState {
    vouchers: MyVoucher[],
}

const initialState: VoucherState = {
    vouchers: []
}

const getVoucher = async (voucherId: number, conditionId: number) => {  //update VoucherCondition remain in database
    const axiosInstance = await authAPI();
    return axiosInstance.patch(endpoints.voucher(voucherId, conditionId))
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
                // Condition has already saved ?
                const existingCondition = existingVoucher.conditions.find(cond => cond.id === conditions[0].id);
                if (existingCondition) {
                    if (is_multiple) {
                        existingCondition.quantity += 1;
                        getVoucher(id, conditions[0].id);
                    }
                }
                else {
                    existingVoucher.conditions = [...existingVoucher.conditions, conditions[0]]
                    getVoucher(id, conditions[0].id);
                }
            }
            else {
                state.vouchers = [...state.vouchers, action.payload]
                getVoucher(id, conditions[0].id);
            }
        },
        addVouchers: (state, action: PayloadAction<MyVoucher[]>) => {
            state.vouchers = [...action.payload]
        },
        removeVoucher: ((state, action: PayloadAction<number>) => {
            state.vouchers.filter(voucher => voucher.id !== action.payload)
        }),
        decreaseVoucherQuantity: ((state, action: PayloadAction<{ voucherId: number, conditionId: number }>) => {
            const { voucherId, conditionId } = action.payload;
            const condition = state.vouchers.
                find(voucher => voucher.id === voucherId)?.conditions.
                find(cond => cond.id === conditionId);
            if (condition) {
                if (condition.quantity > 0) {
                    condition.quantity -= 1;
                }
            }
        }),
        clearVoucher: () => initialState  // clear voucherState not voucher in storage
    }
})

export const { addVoucher, addVouchers, removeVoucher, decreaseVoucherQuantity, clearVoucher } = voucherSlice.actions;
export default voucherSlice.reducer