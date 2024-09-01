export interface Product {
    id: number,
    name: string
}

interface Category extends Product { }

interface PaymentMethod extends Product { }

interface Shipping extends Product { fee: number }

export interface Condition {
    id: number,
    min_order_amount: number,
    discount: number,
    remain: number,
    products: Product[],
    categories: Category[],
    payment_methods: PaymentMethod[],
    shippings: Shipping[],
}

export interface Voucher extends Product {
    code: string,
    is_multiple: boolean,
    start_date: string,
    end_date: string,
    voucher_type_name: string,
    conditions: Condition[] | []
}
// for voucherSlice
interface VoucherCondition extends Omit<Condition, 'remain'> {
    quantity: number;
}

export interface MyVoucher extends Product {
    code: string;
    is_multiple: boolean;
    start_date: string;
    end_date: string;
    voucher_type_name: string;
    conditions: VoucherCondition[] | [];
}