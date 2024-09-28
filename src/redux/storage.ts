import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectedProductList } from '../interfaces/product';
import { MyVoucher } from '../interfaces/voucher';
export const CART_KEY = 'ecommerce_cart';
export const VOUCHER_KEY = 'ecommerce_voucher';
import remainDateTime from '../constants/remainDateTime';

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
        return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
        console.error('Failed to load cart from storage', error);
        return [];
    }
};

export const loadVoucherFromStorage = async (token: string | undefined) => {
    try {
        const voucherData = await AsyncStorage.getItem(`${VOUCHER_KEY}_${token}`);
        return voucherData ? JSON.parse(voucherData).filter((voucher: MyVoucher) => 
            remainDateTime(voucher.end_date) !== "Time has passed.") : [];
    } catch (error) {
        console.error('Failed to load voucher from storage', error);
        return [];
    }
};

export const saveCartToStorage = async (products: SelectedProductList[], token: string | undefined) => {
    try {
        // Get products from storage
        let cartData: SelectedProductList[] = await loadCartFromStorage(token);
        cartData = [...products]
        // Save the updated cartData back to AsyncStorage
        await AsyncStorage.setItem(`${CART_KEY}_${token}`, JSON.stringify(cartData));

    } catch (error) {
        console.error('Failed to save cart to storage', error);
    }
};

export const saveVoucherToStorage = async (vouchers: MyVoucher[], token: string | undefined) => {
    try {
        // Get vouchers from storage
        let voucherData: MyVoucher[] = await loadVoucherFromStorage(token);
        console.log('storage_voucherData ', voucherData);
        voucherData = [...vouchers]
        console.log('updated voucher ', voucherData);
        // Save the updated voucherData back to AsyncStorage
        await AsyncStorage.setItem(`${VOUCHER_KEY}_${token}`, JSON.stringify(voucherData));

    } catch (error) {
        console.error('Failed to save voucher to storage', error);
    }
};


export const clearLocalStorage = async () => {
    AsyncStorage.clear()
};