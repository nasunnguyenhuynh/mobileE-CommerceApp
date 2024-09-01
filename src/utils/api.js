import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HOST } from "@env";


export const endpoints = {
    'currentUser': '/users/current-user/', //GET, PATCH
    'login': '/accounts/login/',
    'loginWithSms': '/accounts/login-with-sms/',
    'loginWithGoogle': '/accounts/login-with-google/',
    'signup': '/accounts/signup/',
    'verifyOTP': '/accounts/verify-otp/',

    'categories': '/categories/',
    'shipping-unit': '/shipping-unit/',
    'vouchers': '/vouchers/',
    'shop_id': (id) => `shops/${id}/`,

    'products': (page) => `/products/?page=${page}`,
    'products_id': (productId) => `/products/${productId}/`,
    'product_name': (name) => `/products/?product_name=${name}`,
    'products_pmn': (pmn) => `/products/?pmn=${pmn}`,
    'products_pmx': (pmx) => `/products/?pmx=${pmx}`,
    'products_comments': (productId) => `/products/${productId}/comment/`, //CRUD
    'products_child_comments': (productId, commentId) => `/products/${productId}/comment/${commentId}`, //GET

    'productReview': (productId) => `/products/${productId}/reviews/`,
    'shopReview': (shopId) => `/shops/${shopId}/reviews/`,

    'shopConfirmation': (userId) => `/users/${userId}/shop-confirmation/`, //GET, POST

    'address-phone': (userId) => `/users/${userId}/address-phone/`, //GET, POST, DELETE, PATCH

    'order': (userId) => `/users/${userId}/orders/`, //GET, POST
    'payment': '/payment',
}

export const authAPI = async () => {
    const token = await AsyncStorage.getItem('access_token');

    return axios.create({
        baseURL: HOST,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export default axios.create({
    baseURL: HOST
})