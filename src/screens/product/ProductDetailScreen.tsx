import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import AntDesign from "react-native-vector-icons/AntDesign"
import Ionicons from "react-native-vector-icons/Ionicons"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import { colors as useColor } from '../../constants/colors';
//components
import Carousel from '../../components/ProductDetail/Carousel';
import PriceNameRatingSold from '../../components/ProductDetail/PriceNameRatingSold';
import Delivery from '../../components/ProductDetail/Delivery';
import Shop from '../../components/ProductDetail/Shop';
import Info from '../../components/ProductDetail/Info';
import Description from '../../components/ProductDetail/Description';
import Review from '../../components/ProductDetail/Review';
import AddToCart from '../../components/ProductDetail/AddToCart';
import useModal from '../../hooks/useModal'
//navigation
import { StackScreenProps } from '@react-navigation/stack';
import { ProductStackParamList } from '../../routers/types'

type Props = StackScreenProps<ProductStackParamList, 'ProductDetailScreen'>;
const ProductDetailScreen = ({ route, navigation }: Props) => {
    const { data } = route.params;
    const {
        id, name, price, images, videos, colors, details, sold, product_rating, category, shop_id
    } = data;
    // scroll to top
    const [showScrollTopButton, setShowScrollTopButton] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleScroll = (event: any) => {
        const yOffset = event.nativeEvent.contentOffset.y;
        setShowScrollTopButton(yOffset > 300);
    };

    const scrollToTop = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    };
    // toggle
    const { isModalVisible, toggleModal } = useModal();
    const handleAddToCart = () => {
        if (colors.length > 0) {
            console.log(colors)
            toggleModal
        }
        else
            console.log('Add To Cart')
    }

    const handleBuyNow = () => {
        if (colors.length > 0) {
            console.log('Choose the option')
        }
        else
            console.log('Navigate to Payment')
    }


    return (
        <>
            <ScrollView
                ref={scrollViewRef}
                onScroll={handleScroll}
                scrollEventThrottle={16}  //Limits how often scroll events will be fired while scrolling
            >
                <Carousel imgList={images} />
                <View style={styles.container}>
                    <View style={{ marginVertical: 0 }}>
                        {/* price_name_rating_sold */}
                        <PriceNameRatingSold
                            productId={id}
                            categoryId={category}
                            price={price}
                            name={name}
                            rating={product_rating}
                            sold={sold} />

                        {/* Delivery */}
                        <Delivery/>  

                        {/* Shop */}
                        <Shop id={shop_id} />

                        {/* Info */}
                        <Info material={details.material} manufactory={details.manufactory} />

                        {/* Description */}
                        <Description description={details.description} />

                        {/* Reviews */}
                        <Review
                            productId={id}
                            shopId={shop_id}
                            productRating={product_rating} />

                        {/* <AddToCart/> */}
                        {/* colors > 0 && Add -> Optional + Add */}
                        {/* !colors > 0 && Add -> Add */}
                        {/* !colors > 0 && !Add -> Payment */}
                        {/* colors > 0 && !Add -> Optional + Payment */}
                        {isModalVisible && (
                            <AddToCart
                                visible={isModalVisible}
                                toggleModal={toggleModal}

                                id={id}
                                price={price}
                                colors={colors}
                                images={images}
                                shopId={shop_id}
                            />
                        )}
                    </View>
                </View>
            </ScrollView>
            {showScrollTopButton && (
                <TouchableOpacity style={styles.scrollTopButton} onPress={scrollToTop}>
                    <AntDesign name="arrowup" size={24} color="white" />
                </TouchableOpacity>
            )}
            <View style={styles.footerProductDetail}>
                <View style={styles.wrapBtnChatCart}>
                    <TouchableOpacity style={styles.wrapIcon}>
                        <Ionicons
                            name={"chatbubbles-outline"}
                            size={30}
                            color={"black"}
                        />
                    </TouchableOpacity>
                    <Text style={{ borderWidth: 0.2, borderColor: useColor.lightGray, }}></Text>
                    <TouchableOpacity style={styles.wrapIcon} onPress={toggleModal}>
                        <FontAwesome5
                            name={"cart-plus"}
                            size={30}
                            color={"black"}
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.wrapBtnBuy} onPress={toggleModal}>
                    <Text>Buy Now</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default ProductDetailScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F5F5F5",
    },

    // Component SlideVoucher
    //Flatlist
    footerProductDetail: {
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

        height: 50,
    },
    wrapBtnChatCart: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        height: "100%",
        backgroundColor: useColor.blueSky,
    },
    wrapIcon: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    wrapBtnBuy: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        height: "100%",
        backgroundColor: "tomato",
    },
    //ScrollTopbutton
    scrollTopButton: {
        position: 'absolute',
        bottom: 60,
        right: 20,
        backgroundColor: 'gray',
        width: 40,
        height: 40,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },

})