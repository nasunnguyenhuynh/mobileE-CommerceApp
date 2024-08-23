import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Product {
    id: number,
    name: string
}

interface Category {
    id: number,
    name: string
}

interface PaymentMethod {
    id: number,
    name: string
}

interface Shipping {
    id: number,
    name: string,
    fee: number
}

interface Condition {
    id: number,
    min_order_amount: number,
    discount: number,
    remain: number,
    products: Product[],
    categories: Category[],
    payment_methods: PaymentMethod[],
    shippings: Shipping[],
}

interface Voucher {
    id: number,
    name: string,
    code: string,
    start_date: string,
    end_date: string,
    voucher_type_name: string,
    conditions: Condition[] | []
}

interface VoucherState {
    vouchers: Voucher[]
}

const initialState: VoucherState = {
    vouchers: []
}

const voucherSlice = createSlice({
    name: 'voucher',
    initialState,
    reducers: {
        // remain > 0 -> luu
        // currentDateTime < end_date -> Duoc dung -> Check other conditions
        addVoucher: (state, action: PayloadAction<Product>) => {
            // const { id, name, code, start_date, end_date, voucher_type_name, conditions } = action.payload;
            // const existingItem = state.products.find(product => product.id === id && product.color === color);
            // if (existingItem) {
            //     existingItem.quantity += quantity;
            // } else {
            //     state.products.push({ id, color, quantity });
            // }
        },
        removeVoucher: ((state, action: PayloadAction<{ id: number }>) => {
            // state.products = state.products.filter(item => item.id !== action.payload.id);
        }),
        // clearVoucher: () => {
        //     AsyncStorage.removeItem('ecommerce_voucher_25');
        // }
        clearVoucher: () => initialState  // clear voucherState not voucher in storage
    }
})

export const { addVoucher, clearVoucher } = voucherSlice.actions;
export default voucherSlice.reducer