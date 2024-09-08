import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectedProductList } from "../../interfaces/product";

interface Cart {
    productList: SelectedProductList[]
    isSelectAll: boolean
}

const initialState: Cart = {
    productList: [],
    isSelectAll: false
}
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
            const { products, shopId, isSelected } = action.payload;
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
                    ],
                    isSelected
                });
            }
        },
        addProducts: (state, action: PayloadAction<SelectedProductList[]>) => {
            state.productList = [...action.payload]
        },
        removeProduct: (state, action: PayloadAction<{ shopId: number, productId: number, color: number | null }>) => {
            const { shopId, productId, color } = action.payload;
            const shop = state.productList.find(shop => shop.shopId === shopId)
            if (shop) { // Check if delete shop?
                if (shop.products.length === 1) {
                    state.productList = state.productList.filter(product => product.shopId !== shopId);
                }
                if (shop.products.length > 1) {
                    const productIndex = shop.products.findIndex(
                        item => item.id === productId && item.color === color
                    );

                    state.productList.find(shop => shop.shopId === shopId)?.products.splice(productIndex, 1)
                }
            }
        },
        increaseProductQuantity: (state, action: PayloadAction<{ shopId: number, productId: number, color: number | null }>) => {
            const { shopId, productId, color } = action.payload;
            const shop = state.productList.find(shop => shop.shopId === shopId);

            if (shop) {
                const product = shop.products.find(p => p.id === productId && p.color === color);

                if (product) {
                    product.quantity += 1;
                }
            }
        },
        decreaseProductQuantity: (state, action: PayloadAction<{ shopId: number, productId: number, color: number | null }>) => {
            const { shopId, productId, color } = action.payload;
            const product = state.productList.
                find(shop => shop.shopId === shopId)?.products.
                find(p => p.id === productId && p.color === color);
            if (product) {
                if (product.quantity === 1) {
                    removeProduct({ shopId, productId, color })
                }
                else
                    product.quantity -= 1;
            }
        },
        toggleSelectedProduct: (state, action: PayloadAction<{ shopId: number, productId: number, color: number | null }>) => {
            const { shopId, productId, color } = action.payload;
            const shop = state.productList.find(shop => shop.shopId === shopId);

            if (shop) {
                const product = shop.products.find(p => p.id === productId && p.color === color);

                if (product) {
                    product.isSelected = !product.isSelected;
                    console.log('product ', product);
                }

                // Update shop's isSelected based on products' isSelected

                shop.isSelected = shop.products.every(p => p.isSelected);
                console.log('shop ', shop);
            }

            // Update selectAll based on all shops' isSelected
            state.isSelectAll = state.productList.every(shop => shop.isSelected);
        },
        toggleSelectedShop: (state, action: PayloadAction<{ shopId: number }>) => {
            const { shopId } = action.payload;
            const shop = state.productList.find(shop => shop.shopId === shopId);

            if (shop) {
                const isSelected = !shop.isSelected;
                shop.isSelected = isSelected;

                // Update all products in the shop
                shop.products.forEach(product => {
                    product.isSelected = isSelected;
                });
            }

            // Update selectAll based on all shops' isSelected
            state.isSelectAll = state.productList.every(shop => shop.isSelected);
        },
        toggleSelectAll: (state) => {
            const isSelectAll = !state.isSelectAll;

            // Update all shops and products based on isSelectAll
            state.productList.forEach(shop => {
                shop.isSelected = isSelectAll;
                shop.products.forEach(product => {
                    product.isSelected = isSelectAll;
                });
            });

            state.isSelectAll = isSelectAll;
        },
        clearCart: () => initialState,
    }
})

export const { addProduct, addProducts, removeProduct, increaseProductQuantity, decreaseProductQuantity,
    toggleSelectedProduct, toggleSelectedShop, toggleSelectAll, clearCart } = cartSlice.actions;
export default cartSlice.reducer