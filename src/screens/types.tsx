import { PaymentStackParamList, ReviewStackParamList } from "../routers/types";

export type ExtensionShopStackParamList = {
    ExtensionShopScreen: undefined
    CreateShopScreen: undefined;
    AddInfoShopScreen: undefined;
    MyShopScreen: undefined;

    ProfileScreen: undefined;
};

export type ExtensionActivityStackParamList = {
    ExtensionActivityScreen: undefined
};

export type ReviewScreenStackParamList = {
    ReviewScreen: undefined;

    ReviewProductScreen: { productReview: any; productRating: number; };
    ReviewShopScreen: { shopReview: any; shopRating: number };
    ReviewCommentScreen: { productId: number };
};

export type ReviewFormStackParamList = {
    ReviewFormScreen: undefined;
};

export type OrderScreenStackParamList = {
    OrderConfirmingScreen: { orderConfirming: any };
    OrderPackingScreen: { orderPacking: any };
    OrderDeliveringScreen: { orderDelivering: any };
    OrderDeliveredScreen: { orderDelivered: any };
    OrderCanceledScreen: { orderCanceled: any };
    OrderReturnedScreen: { orderReturned: any };
    
    PaymentNavigator: { screen: keyof PaymentStackParamList; params?: any };
    ReviewNavigator: { screen: keyof ReviewStackParamList; params?: any };
};