export type RootStackParamList = {
    AuthNavigator: undefined;
    ExtensionNavigator: { screen: string };
    HomeNavigator: undefined;
    ProductNavigator: { screen: keyof ProductStackParamList; params?: any };
    ReviewNavigator: { screen: keyof ReviewStackParamList, params?: any };
    ShopNavigator: undefined;
    SettingsNavigator: undefined;
};

export type AuthStackParamList = { //AuthNavigator
    Login: undefined;
    LoginWithSMS: undefined;
    Signup: undefined;
    VerifyOTP: undefined;

    HomeNavigator: undefined
};

export type ExtensionStackParamList = { //ExtensionNavigator
    ExtensionActivityScreen: undefined;
    ExtensionShopScreen: undefined;
};

export type HomeStackParamList = { //HomeNavigator
    HomeScreen: undefined;
    ProfileScreen: undefined;

    ProductNavigator: { screen: keyof ProductStackParamList; params?: any };
};

export type ProfileStackParamList = { //ProfileNavigator
    ProfileScreen: undefined;

    ExtensionShopScreen: undefined
    Login: undefined;
};

export type ProductStackParamList = { //ProductNavigator
    ProductDetailScreen: { //from ProductList -> ProductDetailScreen
        data: {
            id: number;
            name: string;
            price: number;
            images: { id: number; image: string }[];
            videos: { id: number; video: string }[];
            colors: { id: number; name: string; image: string }[];
            details: {
                material: string;
                manufactory: string;
                description: string;
            };
            sold: number;
            product_rating: number;
            category: number;
            shop_id: number;
        };
    };
    SearchProductScreen: { data: string };

    ReviewNavigator: { screen: keyof ReviewStackParamList, params?: any }; //from ProductDetailScreen -> ReviewScreen
    ShopScreen: undefined;
};

export type ShopStackParamList = {
    ShopScreen: undefined;
};

export type ReviewStackParamList = { //ReviewNavigator
    ReviewScreen: { product_id: string };
    ReviewFormScreen: undefined;
};


export type SettingsStackParamList = {
    SettingsScreen: undefined;
    ProfileScreen: undefined;
};

export type CartStackParamList = {
    CartScreen: undefined;
};

export type ChatStackParamList = {
    ChatScreen: undefined;
    ChatSpecificScreen: undefined;
};



