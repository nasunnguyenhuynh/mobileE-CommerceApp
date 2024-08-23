import { useState, useEffect } from 'react';
import { SelectedProductDetail } from '../interfaces/product';
interface ProductCardProps extends SelectedProductDetail {
    shopId: number;
}

// Custom hook để quản lý trạng thái chọn
export function useSelect(initialProducts: ProductCardProps[]) {
    const [products, setProducts] = useState<ProductCardProps[]>(initialProducts);
    const [shopChecked, setShopChecked] = useState<boolean>(false);

    // Hàm để cập nhật trạng thái checking của tất cả ProductCard khi ShopCard thay đổi
    const handleShopCheckChange = (checked: boolean) => {
        setShopChecked(checked);
        setProducts(products.map(product => ({
            ...product,
            checked: checked && product.quantity > 0
        })));
    };

    // Hàm để cập nhật trạng thái checking của từng ProductCard
    const handleProductCheckChange = (id: number, checked: boolean) => {
        const updatedProducts = products.map(product =>
            product.id === id
                ? { ...product, checked: checked }
                : product
        );
        setProducts(updatedProducts);
        // Cập nhật trạng thái checking của ShopCard
        const allChecked = updatedProducts.every(p => p.checked || p.quantity === 0);
        setShopChecked(allChecked);
    };

    // Cập nhật trạng thái checking của tất cả ProductCard khi count của bất kỳ ProductCard thay đổi
    useEffect(() => {
        setProducts(products.map(product => ({
            ...product,
            checked: product.quantity > 0 ? product.checked : false
        })));
        const allChecked = products.every(p => p.checked || p.quantity === 0);
        setShopChecked(allChecked);
    }, [products]);

    return { products, shopChecked, handleShopCheckChange, handleProductCheckChange };
}

// ShopCard
// const [checking, setChecking] = useState(false);
// useEffect(()=> {
//  if (select && !checking) {
//      setChecking(!checking)
//  }
//  if (!select && checking) {
//      setChecking(!checking)
//  }
//},[select])

// ProductCard
// const [checking, setChecking] = useState(false);
// useEffect(()=> {
//  if (select && !checking) {
//      setChecking(!checking)
//  }
//},[select])



// <ShopCard countProduct={}/> 