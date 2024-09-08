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
export interface VoucherCondition extends Omit<Condition, 'remain'> {
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

export const createMyVoucher = (voucher: Voucher, condition: Condition): MyVoucher => ({
    id: voucher.id,
    name: voucher.name,
    code: voucher.code,
    is_multiple: voucher.is_multiple,
    start_date: voucher.start_date,
    end_date: voucher.end_date,
    voucher_type_name: voucher.voucher_type_name,
    conditions: [
        {
            id: condition.id,
            min_order_amount: condition.min_order_amount,
            discount: condition.discount,
            quantity: 1,
            products: condition.products,
            categories: condition.categories,
            payment_methods: condition.payment_methods,
            shippings: condition.shippings,
        }
    ]
});