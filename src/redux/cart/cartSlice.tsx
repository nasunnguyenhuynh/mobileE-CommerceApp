import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectedProductList } from "../../interfaces/product";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CART_KEY } from "../storage";

interface Cart {
    productList: SelectedProductList[]
}

const initialState: Cart = {
    productList: []
};

// sample
// productList = [
// {
//     shopId: 5,
//     products: [
//         {id: 1, color: 2, quantity: 3}
//     ]
// },
// ...
//]

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<SelectedProductList>) => {
            const { products, shopId } = action.payload;
            const productDetail = products[0];
            // Find the shop by shopId
            const shop = state.productList.find(product => product.shopId === shopId);
            if (shop) {
                // Shop exists, check if the product with the same id and color exists
                const existingProduct = shop.products.find(
                    item => item.id === productDetail.id && item.color === productDetail.color
                );
                if (existingProduct) {
                    // If the product exists, increment the quantity
                    existingProduct.quantity += productDetail.quantity;
                } else {
                    // If the product doesn't exist, add it to the shop's products array
                    shop.products.push({
                        id: productDetail.id,
                        color: productDetail.color,
                        quantity: productDetail.quantity,
                        isSelected: productDetail.isSelected
                    });
                }
            } else {
                // If the shop doesn't exist, add a new shop with the product
                state.productList.push({
                    shopId,
                    products: [
                        {
                            id: productDetail.id,
                            color: productDetail.color,
                            quantity: productDetail.quantity,
                            isSelected: productDetail.isSelected
                        }
                    ]
                });
            }
        },
        addProducts: (state, action: PayloadAction<SelectedProductList[]>) => {
            state.productList = [...action.payload]
        },
        removeProduct: (state, action: PayloadAction<SelectedProductList>) => {
            const { products, shopId } = action.payload;
            const productDetail = products[0];

            // Find the shop by shopId
            const shop = state.productList.find(product => product.shopId === shopId);
            if (shop) {
                // Find the index of the product in the shop's products array
                console.log('shop_found ', shop);

                const productIndex = shop.products.findIndex(
                    item => item.id === productDetail.id && item.color === productDetail.color
                );
                console.log('findidx ', productIndex);

                if (productIndex !== -1) {
                    // If the product is found, remove it from the array
                    shop.products.splice(productIndex, 1);
                    console.log('shop_updated ', shop);
                    // If the shop has no more products, remove the shop from the productList
                    if (shop.products.length === 0) {
                        console.log('shop_removed ', shop);
                        state.productList = state.productList.filter(product => product.shopId !== shopId);
                    }
                }
            }
        },
        toggleSelectedProduct: (state,
            action: PayloadAction<{ shopId: number, productId: number, color: number | null }>) => {
            const { shopId, productId, color } = action.payload;

            // Find the shop by shopId
            const shop = state.productList.find(shop => shop.shopId === shopId);

            if (shop) {
                // Find the product by productId and color
                const product = shop.products.find(p => p.id === productId && p.color === color);

                if (product) {
                    // Toggle the isSelected value
                    product.isSelected = !product.isSelected;
                }
            }
        },
        clearCart: () => initialState,
    }
})

export const { addProduct, addProducts, toggleSelectedProduct, removeProduct, clearCart } = cartSlice.actions;
export default cartSlice.reducer