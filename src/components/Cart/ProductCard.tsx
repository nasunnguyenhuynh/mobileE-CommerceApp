import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import formatCurrency from '../../constants/formatCurrency';
import api, { endpoints } from '../../utils/api';
import { Product } from '../../interfaces/product';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { SelectedProductList, SelectedProductDetail } from '../../interfaces/product';
// redux
import type { AppDispatch } from '../../redux/store';
import { useDispatch } from 'react-redux'
import store from '../../redux/store';
import { toggleSelectedProduct } from '../../redux/cart/cartSlice';

interface ProductCardProps extends SelectedProductDetail {
    shopId: number;
    checkedShop: boolean;
    checkedProductList: (params: { id: number; color: number | null; isChecked: boolean, action: "add" | "remove" }) => void;
}

const ProductCard = ({
    id,
    color,
    quantity,
    isSelected,
    shopId,
    checkedShop,
    checkedProductList
}: ProductCardProps) => {
    // cartSlice
    const dispatch = useDispatch<AppDispatch>()
    // declare states
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<Product | null>(null);

    const getProductByID = async (id: number) => {
        const response = await api.get(endpoints.products_id(id));
        if (response.status === 200 && response.data) {
            setProduct(response.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        getProductByID(id);
    }, [id]);


    const getColorName = (id: number): string | undefined => {
        const color = product?.colors.find(color => color.id === id);
        return color ? color.name : undefined;
    };

    const [checkedProduct, setCheckedProduct] = useState(checkedShop);
    useEffect(() => {
        if (checkedShop) {
            const shop = store.getState().cart.productList.find(shop => shop.shopId === shopId);
            const notSelectedProducts = shop?.products.filter(product => !product.isSelected) || [];
            if (notSelectedProducts.length > 0) {
                notSelectedProducts.forEach(product => {
                    dispatch(toggleSelectedProduct({ shopId, productId: product.id, color }));
                });
                setCheckedProduct(checkedShop)
            }
        }
        if (!checkedShop) {
            const shop = store.getState().cart.productList.find(shop => shop.shopId === shopId);
            const selectedProducts = shop?.products.filter(product => product.isSelected) || [];
            if (selectedProducts.length > 0) {
                selectedProducts.forEach(product => {
                    dispatch(toggleSelectedProduct({ shopId, productId: product.id, color }));
                });
                setCheckedProduct(checkedShop)
            }
        }
    }, [checkedShop])
    const handleCheckedProduct = (shopId: number, productId: number, color: number | null) => {
        dispatch(toggleSelectedProduct({ shopId, productId, color }));  // productSlice
        const isChecked = !checkedProduct
        const action = isChecked ? 'add' : 'remove'
        checkedProductList({ id, color, isChecked, action })
        setCheckedProduct(!checkedProduct) // productCardState <-> ShopCard
    }

    return (
        <>
            {
                product && (product.remain > 0 ?
                    <View style={styles.containerProduct}>
                        <TouchableOpacity
                            style={styles.checkbox}
                            onPress={() => handleCheckedProduct(shopId, id, color)}
                        >
                            <MaterialIcons
                                name={checkedProduct ? "check-box" : "check-box-outline-blank"}
                                size={30}
                                color={checkedProduct ? "#22a779" : "#ccc"} />
                        </TouchableOpacity>
                        <View style={styles.detailProduct}>
                            <Image source={{ uri: product?.images[0].image }} style={styles.image} />
                            <View style={styles.detailsContainer}>
                                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.title}>{product?.name}</Text>
                                {color && <Text style={styles.variant}>Variant: {getColorName(color)}</Text>}
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.price}>₫{formatCurrency(product?.price)}</Text>

                                    <View style={styles.quantityContainer}>
                                        <TouchableOpacity
                                            // onPress={onDecrease}
                                            style={styles.button}>
                                            <Text>-</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.quantity}>{quantity}</Text>
                                        <TouchableOpacity
                                            // onPress={onIncrease}
                                            style={styles.button}>
                                            <Text>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View> :
                    <TouchableOpacity
                        style={[styles.containerProduct, styles.containerinvalidProduct]}
                    // onPress={() => {
                    //     console.log(`product ${id} removed`);

                    //     const selectedProduct: SelectedProductList = {
                    //         shopId,
                    //         products: [{ id, color, quantity }]
                    //     };
                    //     dispatch(removeProduct(selectedProduct))
                    //     setProduct(null)
                    // }}
                    >
                        <View style={styles.checkbox} />
                        <View style={styles.detailProduct}>
                            <Image source={{ uri: product?.images[0].image }} style={styles.image} />
                            <View style={styles.detailsContainer}>
                                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.title}>{product?.name}</Text>
                                {color && <Text style={styles.variant}>Variant: {getColorName(color)}</Text>}
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.price}>OUT OF STOCK</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            }
        </>
    );
};

const styles = StyleSheet.create({
    checkbox: {
        // width: 24,
        // height: 24,
        // borderColor: '#ccc',
        // borderRadius: 5,
        // borderWidth: 1,
        marginRight: 10,
    },
    // product
    containerProduct: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    containerinvalidProduct: {
        backgroundColor: '#ccc',
        borderRadius: 10,
        marginBottom: 10
    },
    detailProduct: {
        flexDirection: 'row',
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 5,
        backgroundColor: 'powderblue'
    },
    detailsContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        flexWrap: 'wrap',
        width: '90%'
    },
    variant: {
        fontSize: 14,
        color: '#888',
    },
    price: {
        fontSize: 18,
        color: '#f00',
        fontWeight: 'bold',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10
    },
    button: {
        padding: 5,
        backgroundColor: '#eee',
        borderRadius: 5,
    },
    quantity: {
        marginHorizontal: 10,
    },
});

export default ProductCard;
