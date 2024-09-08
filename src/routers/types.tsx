import { Product } from "../interfaces/product";
import { PaymentMethod } from "../interfaces/category";
import { ShippingUnit } from "../interfaces/shipping";
import { MyVoucher } from "../interfaces/voucher";
export type RootStackParamList = {
    AuthNavigator: undefined;
    ExtensionNavigator: { screen: string };
    HomeNavigator: undefined;
    ProductNavigator: { screen: keyof ProductStackParamList; params?: any };
    ReviewNavigator: { screen: keyof ReviewStackParamList, params?: any };
    CartNavigator: undefined;
    PaymentNavigator: undefined;
    VoucherNavigator: { screen: keyof VoucherStackParamList, params?: any };
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
    CartNavigator: { screen: keyof CartStackParamList; params?: any };
};

export type ProfileStackParamList = { //ProfileNavigator
    ProfileScreen: undefined;

    ExtensionShopScreen: undefined
    Login: undefined;
};

export type ProductStackParamList = { //ProductNavigator
    ProductDetailScreen: { data: Product }; //from ProductList -> ProductDetailScreen
    SearchProductScreen: { data: string };
    ReviewNavigator: { screen: keyof ReviewStackParamList, params?: any }; //from ProductDetailScreen -> ReviewScreen
    ShopScreen: undefined;
};

export type ShopStackParamList = { // ShopNavigator
    ShopScreen: undefined;
};

export type ReviewStackParamList = { // ReviewNavigator
    ReviewScreen: { product_id: string };
    ReviewFormScreen: undefined;
};


export type SettingsStackParamList = { // SettingNavigator
    SettingsScreen: undefined;
    ProfileScreen: undefined;
};

export type CartStackParamList = { // CartNavigator
    CartScreen: undefined;
    PaymentNavigator: { screen: keyof PaymentStackParamList; params?: any };
};

export type PaymentStackParamList = { // PaymentNavigator
    PaymentScreen: { // declare params for screen
        receiverInformationList?: any,
        selectedPaymentMethod?: PaymentMethod,
        selectedShippingUnit?: ShippingUnit,
        selectedVoucherList?: MyVoucher[]
    };
    PaymentMethodScreen: undefined;
    ReceiverInformationScreen: undefined;
    ShippingUnitScreen: undefined;
    SelectingVoucherScreen: {
        totalProductPrice: number,
        selectedProductList: Product[],
        selectedPaymentMethod: PaymentMethod,
        selectedShippingUnit: ShippingUnit
    };
    VoucherNavigator: { screen: keyof VoucherStackParamList, params?: any };
    PaymentResultScreen: { url: string };
    HomeNavigator: { screen: keyof HomeStackParamList; params?: any };
};

export type VoucherStackParamList = { // VoucherNavigator
    VoucherConditionScreen: undefined;
};

export type ChatStackParamList = {
    ChatScreen: undefined;
    ChatSpecificScreen: undefined;
};



