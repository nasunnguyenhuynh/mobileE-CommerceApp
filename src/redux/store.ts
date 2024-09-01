import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth/authSlice';
import userSlice from './user/userSlice';
import userShopConfirmationSlice from './user/userShopConfirmationSlice';
import cartSlice from './cart/cartSlice';
import voucherSlice from './voucher/voucherSlice';
import receiverInformationSlice from './reInfo/receiverInformationSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        user: userSlice,
        userShopConfirmation: userShopConfirmationSlice,
        cart: cartSlice,
        voucher: voucherSlice,
        reInfo: receiverInformationSlice
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;