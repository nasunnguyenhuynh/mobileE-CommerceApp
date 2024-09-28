import { Product } from "../interfaces/product";
import { PaymentMethod } from "../interfaces/category";
import { ShippingUnit } from "../interfaces/shipping";
import { MyVoucher } from "../interfaces/voucher";
import { Order, OrderDetail } from '../interfaces/order';
export type RootStackParamList = {
    AuthNavigator: undefined;
    ExtensionNavigator: { screen: string };
    HomeNavigator: undefined;
    ProfileNavigator: { screen: keyof ProfileStackParamList; params?: any };
    ProductNavigator: { screen: keyof ProductStackParamList; params?: any };
    ReviewNavigator: { screen: keyof ReviewStackParamList; params?: any };
    CartNavigator: undefined;
    PaymentNavigator: { screen: keyof PaymentStackParamList; params?: any };
    VoucherNavigator: { screen: keyof VoucherStackParamList; params?: any };
    ShopNavigator: undefined;
    SettingsNavigator: undefined;
    OrderNavigator: { screen: keyof OrderStackParamList; params?: any };
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

    ProfileNavigator: { screen: keyof ProfileStackParamList; params?: any };
    AuthNavigator: { screen: keyof AuthStackParamList; params?: any };
    ExtensionNavigator: { screen: keyof ExtensionStackParamList; params?: any };
    ProductNavigator: { screen: keyof ProductStackParamList; params?: any };
    CartNavigator: { screen: keyof CartStackParamList; params?: any };
    OrderNavigator: { screen: keyof OrderStackParamList; params?: any };
};

export type ProfileStackParamList = { //ProfileNavigator
    EditProfileScreen: undefined;
    ExtensionShopScreen: undefined;

    HomeNavigator: { screen: keyof HomeStackParamList; params?: any };
};

export type ProductStackParamList = { //ProductNavigator
    ProductDetailScreen: { data: Product }; //from ProductList -> ProductDetailScreen
    SearchProductScreen: { data: string };
    ReviewNavigator: { screen: keyof ReviewStackParamList; params?: any }; //from ProductDetailScreen -> ReviewScreen
    ShopScreen: undefined;
    ProductComparisionScreen: { data: any }
};

export type ShopStackParamList = { // ShopNavigator
    ShopScreen: undefined;
};

export type ReviewStackParamList = { // ReviewNavigator
    ReviewScreen: { product_id: string };
    ReviewFormScreen: { params?: OrderDetail }; // custom param

    HomeNavigator: { screen: keyof HomeStackParamList; params?: any };
};


export type SettingsStackParamList = { // SettingNavigator
    SettingsScreen: undefined;
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
    VoucherNavigator: { screen: keyof VoucherStackParamList; params?: any };
    PaymentResultScreen: { url?: string };
    HomeNavigator: { screen: keyof HomeStackParamList; params?: any };
};

export type VoucherStackParamList = { // VoucherNavigator
    VoucherConditionScreen: undefined;
};

export type OrderStackParamList = { // OrderNavigator
    OrderScreen: {
        orderConfirming: Order[],
        orderPacking: Order[],
        orderDelivering: Order[],
        orderDelivered: Order[],
        orderCanceled: Order[],
        orderReturned: Order[],
    };
};


