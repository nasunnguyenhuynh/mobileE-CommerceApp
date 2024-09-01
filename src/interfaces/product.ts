export interface ProductColor {
    id: number;
    name: string;
    image: string;
}

export interface ProductImage {
    id: number;
    image: string;
}

export interface ProductVideo {
    id: number;
    video: string;
}

interface ProductDetail {
    id: number;
    material: string;
    manufactory: string;
    description: string;
}

export interface Product {
    id: number;
    name: string;
    remain: number;
    price: number;
    sold: number;
    product_rating: number;
    category: number;
    shop_id: number;
    details: ProductDetail
    images: ProductImage[];
    videos: ProductVideo[];
    colors: ProductColor[];
}


export interface SelectedProductDetail {
    id: number;
    color: number | null;
    quantity: number;
    isSelected: boolean;
}

export interface SelectedProductList {
    shopId: number;
    products: SelectedProductDetail[];
    isSelected: boolean
}