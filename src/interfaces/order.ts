export interface Order {
    id: number,
    total_amount: number,
    user: number,
    status: string,
    payment_method: string,
    shipping: string,
    product_review: boolean,
    shop_review: boolean
}

export interface Detail {
    id: number,
    order_id: number,
    shop_id: number,
    shop_name: string,
    shop_img: string,
    product_id: number,
    product_name: string,
    product_img: string,
    color_name: string,
    quantity: number,
    price: number,
    product_review: boolean,
    shop_review: boolean
}

export interface OrderDetail extends Order {
    order_details: Detail[]
}