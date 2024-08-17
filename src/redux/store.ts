import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth/authSlice';
import userSlice from './user/userSlice';
import userShopConfirmationSlice from './user/userShopConfirmationSlice';
import cartSlice from './cart/cartSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        user: userSlice,
        userShopConfirmation: userShopConfirmationSlice,
        cart: cartSlice
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;