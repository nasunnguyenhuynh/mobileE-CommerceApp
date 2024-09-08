import React, { useState, useEffect } from 'react';
import { Alert, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import formatCurrency from '../../constants/formatCurrency';
import api, { endpoints } from '../../utils/api';
import { Product } from '../../interfaces/product';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { SelectedProductDetail } from '../../interfaces/product';
// redux
import type { AppDispatch } from '../../redux/store';
import { useDispatch } from 'react-redux'
import store from '../../redux/store';
import {
    toggleSelectedProduct, removeProduct,
    increaseProductQuantity, decreaseProductQuantity
} from '../../redux/cart/cartSlice';

interface ProductCardProps extends SelectedProductDetail {
    shopId: number;
}

const ProductCard = ({
    id,
    color,
    quantity,
    isSelected,
    shopId,
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


    const handleCheckedProduct = () => {
        dispatch(toggleSelectedProduct({ shopId, productId: id, color }));
    }

    const handleIncrease = () => {
        dispatch(increaseProductQuantity({ shopId, productId: id, color }))
    }

    const handleRemoveProduct = () => {
        Alert.alert(
            'Remove Product',
            'Are you sure you want to remove this product?',
            [
                {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => dispatch(removeProduct({ shopId, productId: id, color })),
                },
            ],
            { cancelable: true }
        );
    }

    var productQuantity = store.getState().cart.productList.
        find(shop => shop.shopId === shopId)?.products.
        find(product => product.id === id && product.color === color)?.quantity

    var isCheckedBox = store.getState().cart.productList
        .find(shop => shop.shopId === shopId)?.products
        .find(product => product.isSelected === true && product.id === id && product.color === color);

    const handleDecrease = () => {
        if (productQuantity && productQuantity > 1) {
            dispatch(decreaseProductQuantity({ shopId, productId: id, color }))
        }
        else if (productQuantity === 1) {
            handleRemoveProduct()
        }
    }

    return (
        <>
            {
                product && (product.remain > 0 ?
                    <View style={styles.containerProduct}>
                        <TouchableOpacity
                            style={styles.checkbox}
                            onPress={() => handleCheckedProduct()}
                        >
                            <MaterialIcons
                                name={isCheckedBox ? "check-box" : "check-box-outline-blank"}
                                size={30}
                                color={isCheckedBox ? "#22a779" : "#ccc"}
                            />
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
                                            onPress={handleDecrease}
                                            style={styles.button}>
                                            <Text>-</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.quantity}>{productQuantity}</Text>
                                        <TouchableOpacity
                                            onPress={handleIncrease}
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
                        onPress={handleRemoveProduct}
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
