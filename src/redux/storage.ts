import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectedProductList } from '../interfaces/product';
export const CART_KEY = 'ecommerce_cart';

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


export const loadCartFromStorage = async (token: string | undefined) => {
    try {
        const cartData = await AsyncStorage.getItem(`${CART_KEY}_${token}`);
        console.log('cartData ', cartData);

        return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
        console.error('Failed to load cart from storage', error);
        return [];
    }
};
// TH1: Login: cartData[] -> Logout: cartData[]
// TH2: Login: cartData[] -> Logout: cartData[+]

// TH3: Login: cartData[{},..{}] -> Logout: cartData[{},..{} + ]
// TH4: Login: cartData[{},..{}] -> Logout: cartData[{},..{} - ]
// TH5: Login: cartData[{},..{}] -> Logout: cartData[{},..{} +- ]



// Compare cartSlice and cartLocalStorage(maybecontainsProductsbe4)
// export const saveCartToStorage = async (products: SelectedProductList[], token: string | undefined) => {
//     try {
//         // Get products from storage
//         let cartData: SelectedProductList[] = await loadCartFromStorage(token);
//         console.log('storage_cartData ', cartData);

//         if (!cartData) {
//             cartData = [];
//         }

//         products.forEach(newProduct => {
//             // Find the shop in cartData
//             let existingShop = cartData.find(item => item.shopId === newProduct.shopId);

//             if (existingShop) {
//                 // If shop exists, update its products
//                 newProduct.products.forEach(newProductDetail => {
//                     const existingProductDetail = existingShop.products.find(
//                         item => item.id === newProductDetail.id && item.color === newProductDetail.color
//                     );

//                     if (existingProductDetail) {
//                         // If the product already exists, update the quantity
//                         existingProductDetail.quantity += newProductDetail.quantity;
//                     } else {
//                         // If the product doesn't exist, add it
//                         existingShop.products.push(newProductDetail);
//                     }
//                 });
//             } else {
//                 // If the shop doesn't exist, add it along with its products
//                 cartData.push(newProduct);
//             }
//         });

//         // Save the updated cartData back to AsyncStorage
//         await AsyncStorage.setItem(`${CART_KEY}_${token}`, JSON.stringify(cartData));

//     } catch (error) {
//         console.error('Failed to save cart to storage', error);
//     }
// };
export const saveCartToStorage = async (products: SelectedProductList[], token: string | undefined) => {
    try {
        // Get products from storage
        let cartData: SelectedProductList[] = await loadCartFromStorage(token);
        console.log('storage_cartData ', cartData);
        cartData = [...products]
        console.log('updated cart ', cartData);
        // Save the updated cartData back to AsyncStorage
        await AsyncStorage.setItem(`${CART_KEY}_${token}`, JSON.stringify(cartData));

    } catch (error) {
        console.error('Failed to save cart to storage', error);
    }
};


export const clearLocalStorage = async () => {
    AsyncStorage.clear()
};