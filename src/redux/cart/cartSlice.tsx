import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Product {
    id: number
    color: number | null
    quantity: number
}

interface CartState {
    products: Product[]
}

const initialState: CartState = {
    products: []
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<Product>) => {
            const { id, color, quantity } = action.payload;
            const existingItem = state.products.find(product => product.id === id && product.color === color);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.products.push({ id, color, quantity });
            }
        },
        removeProduct: ((state, action: PayloadAction<{ id: number }>) => {
            state.products = state.products.filter(item => item.id !== action.payload.id);
        }),
        // clearCart: () => {
        //     AsyncStorage.removeItem('ecommerce_cart_25');
        // }
        clearCart: () => initialState  // clear cartState not cart in storage
    }
})

export const { addProduct, clearCart } = cartSlice.actions;
export default cartSlice.reducer