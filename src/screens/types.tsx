
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

export type ReviewStackParamList = {
    ReviewScreen: undefined;

    ReviewProductScreen: { productReview: any; productRating: number; };
    ReviewShopScreen: { shopReview: any; shopRating: number };
    ReviewCommentScreen: {productId: number};
};

export type ReviewFormStackParamList = {
    ReviewFormScreen: undefined;
};

