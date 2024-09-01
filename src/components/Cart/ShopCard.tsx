import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import AntDesign from "react-native-vector-icons/AntDesign"
import Feather from "react-native-vector-icons/Feather"
import globalStyles from '../../styles/globalStyles';
import { SelectedProductList, SelectedProductDetail } from '../../interfaces/product';
import ProductCard from './ProductCard';
import api, { endpoints } from '../../utils/api';
import { Shop } from '../../interfaces/shop';
// redux
import type { AppDispatch } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux'
import { toggleSelectedShop } from '../../redux/cart/cartSlice';
import store from '../../redux/store';

const ShopCard = ({
    shopId,
    products,
    isSelected }: SelectedProductList) => {
    const dispatch = useDispatch();
    const handleChange = () => {
        dispatch(toggleSelectedShop({ shopId }));
    };
    const [loading, setLoading] = useState(true);
    const [shop, setShop] = useState<Shop>();
    const [productData, setProductData] = useState<SelectedProductDetail[] | undefined>([]);

    const getShopByID = async (id: number) => {
        const response = await api.get(endpoints.shop_id(id));
        if (response.status === 200 && response.data) {
            setShop(response.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        getShopByID(shopId);
    }, [shopId]);

    useEffect(() => {
        if (shop) {
            setProductData(store.getState().cart.productList.find(shop => shop.shopId === shopId)?.products)
        }
    }, [store.getState().cart.productList.find(shop => shop.shopId === shopId)?.products.length])
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => handleChange()}>
                    <MaterialIcons
                        name={isSelected ? "check-box" : "check-box-outline-blank"}
                        size={30}
                        color={isSelected ? "#22a779" : "#ccc"}
                    />
                </TouchableOpacity>
                <View>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={styles.shopText}>
                        {shop && shop.name}
                    </Text>
                </View>
            </View>
            {/* product */}
            {products?.length > 0 && products?.map((product, index) => (
                <ProductCard
                    key={index}
                    shopId={shopId}

                    id={product.id}
                    color={product.color}
                    quantity={product.quantity}
                    isSelected={false}
                />
            ))}
            {/* Voucher */}
            <View style={{ paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#ccc' }}>
                {/* Shop */}
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[globalStyles.center, { marginRight: 10 }]}>
                            <MaterialCommunityIcons name="ticket-percent-outline" size={24} color="tomato" />
                        </View>
                        <Text style={{ color: '#000', fontSize: 16 }}>Shop Voucher</Text>
                    </View>
                    <AntDesign name="right" size={14} color="gray" />
                </TouchableOpacity>
                {/* Delivery */}
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View style={[globalStyles.center, { marginRight: 10 }]}>
                            <Feather name="truck" size={24} color="powderblue" />
                        </View>
                        <Text numberOfLines={2} style={{ color: '#000', fontSize: 16, flex: 1, flexWrap: 'wrap' }}>I'm sending out an occasional email with the latest tutorials on programming, web development, and statistics. Drop your email in the box below and I'll send new stuff straight into your inbox!</Text>
                    </View>
                    <AntDesign name="right" size={14} color="gray" />
                </TouchableOpacity>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10
    },
    // header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    shopText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    checkbox: {
        marginRight: 10,
    },
    // product
    containerProduct: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    detailProduct: {
        flexDirection: 'row',
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 5,
    },
    detailsContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000'
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
    editButton: {
        marginTop: 10,
        padding: 5,
        backgroundColor: '#eee',
        borderRadius: 5,
    },
    removeButton: {
        marginTop: 5,
        padding: 5,
        backgroundColor: '#eee',
        borderRadius: 5,
    },
});

export default ShopCard;
