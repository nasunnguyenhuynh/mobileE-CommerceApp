import AsyncStorage from '@react-native-async-storage/async-storage';
interface Product {
    id: number
    color: number | null
    quantity: number
}
const CART_KEY = 'ecommerce_cart';

export const loadCartFromStorage = async (userId: number | undefined) => {
    try {
        const cartData = await AsyncStorage.getItem(`${CART_KEY}_${userId}`);
        return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
        console.error('Failed to load cart from storage', error);
        return [];
    }
};

export const saveCartToStorage = async (product: Product, userId: number | undefined) => {
    try {
        // get products from storage
        let cartData: Product[] = await loadCartFromStorage(userId);
        // console.log(cartData);
        
        if (cartData.length > 0) {
            // Check if the product already exists in the cart
            const productExists = cartData.some(
                (item) => item.id === product.id && item.color === product.color
            );

            if (productExists) {
                cartData = cartData.map((item) => {
                    if (item.id === product.id && item.color === product.color) {
                        return {
                            ...item,
                            quantity: item.quantity + product.quantity
                        };
                    }
                    return item;
                });
            } else {
                cartData.push(product);
            }
            await AsyncStorage.setItem(`${CART_KEY}_${userId}`, JSON.stringify(cartData));
        }
        if (cartData.length === 0) {
            cartData.push(product)
            await AsyncStorage.setItem(`${CART_KEY}_${userId}`, JSON.stringify(cartData));
        }
        if (!cartData) {
            console.log('cartData undefined');
        }
    } catch (error) {
        console.error('Failed to save cart to storage', error);
    }
};