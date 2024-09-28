import React, { useEffect, useState, useRef } from "react";
import {
    StyleSheet,
    Text,
    ScrollView,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent,
    RefreshControl
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome"
import AntDesign from "react-native-vector-icons/AntDesign"
import api, { authAPI, endpoints } from "../../utils/api";
import formatCurrency from "../../constants/formatCurrency";
import { NavigationProp } from "@react-navigation/native";

interface image {
    id: number,
    image: string
}

interface Product {
    id: number;
    images: Array<image>;
    name: string;
    product_rating: number;
    price: number;
    sold: number;
}

const ProductList = () => {
    const [data, setData] = useState<Product[]>([]);
    const [refreshing, setRefreshing] = useState(true);
    const [showScrollTopButton, setShowScrollTopButton] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const navigation = useNavigation<NavigationProp<any>>();

    const [page, setPage] = useState(1); // Current page
    const [hasMore, setHasMore] = useState(true); // Flag to check if there are more items to load

    useEffect(() => {
        fetchProducts(page, refreshing);
    }, [page]);

    const fetchProducts = async (page: number, isRefreshing = false) => {
        try {
            const response = await api.get(endpoints.products(page));
            if (response.data.results.length > 0) {
                if (refreshing) { // setData for page 1
                    setData(response.data.results);
                } else {
                    setData(prevProducts => [...prevProducts, ...response.data.results]);
                }
                setHasMore(response.data.next !== null);
            } else {
                setHasMore(false); // No more items to load
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const handleProductPress = async (productId: number) => {   // Navigate to ProductDetail
        try {
            const response = await api.get(endpoints.products_id(productId));
            if (response.status === 200 && response.data) {
                const productInfo = response.data;
                navigation.navigate('ProductNavigator', {
                    screen: 'ProductDetailScreen',
                    params: { data: productInfo },
                });
            }
        } catch (error) {
            console.error(`Error fetching product with id ${productId}:`, error);
        }
    };

    const renderItemComponent = (item: Product) => {
        return (
            <TouchableOpacity key={item?.id.toString()} style={styles.containerProductCard} onPress={() => handleProductPress(item?.id)}>
                <Image style={styles.image} source={{ uri: item?.images[0].image }} />
                <View style={{ margin: 4 }}>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={{ color: '#000' }}>{item?.name}</Text>
                    <View style={styles.wrapRating}>
                        <FontAwesome name={"star"} size={10} color={"#e7700d"} />
                        <Text style={{ fontSize: 8, color: '#000' }}>{Math.round(item?.product_rating * 10) / 10}</Text>
                    </View>
                    <View style={styles.wrapPriceSold}>
                        <Text style={{ fontSize: 16, color: "#cf3131", textDecorationLine: 'underline' }}>{formatCurrency(item?.price)}đ</Text>
                        <Text style={{ fontSize: 10, color: "#6d696996" }}>{item?.sold} sold</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    const handleRefresh = () => {
        setData([]);
        setRefreshing(true);
        setPage(1);
        fetchProducts(1);
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const yOffset = event.nativeEvent.contentOffset.y; // currentPosition
        const contentHeight = event.nativeEvent.contentSize.height;  // totalContentHeightScrollView
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;  // displayViewHeight
        setShowScrollTopButton(yOffset > 250);
        if (yOffset + scrollViewHeight >= contentHeight && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const scrollToTop = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    };

    return (
        <>
            <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}

                onScroll={handleScroll}
                scrollEventThrottle={16}
                ref={scrollViewRef}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
                <View style={styles.gridContainer}>
                    {data.map(renderItemComponent)}
                </View>
            </ScrollView>
            {showScrollTopButton && (
                <TouchableOpacity style={styles.scrollTopButton} onPress={scrollToTop}>
                    <AntDesign name="arrowup" size={24} color="white" />
                </TouchableOpacity>
            )}
        </>
    );
}
export default ProductList;

const { width: screenWidth } = Dimensions.get('window');
const containerWidth = screenWidth * 0.48
const styles = StyleSheet.create({
    scrollViewContent: {
        paddingVertical: 10,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },

    containerProductCard: {
        height: 250,
        marginBottom: 10,
        width: containerWidth,
        backgroundColor: '#FFF',
        borderRadius: 6,
    },
    wrapRating: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 0.5,
        borderColor: "#e7700d",
        backgroundColor: "#eac55b",
        width: 34,
        paddingHorizontal: 2,
        paddingVertical: 1,
        justifyContent: "space-between"
    },
    wrapPriceSold: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    image: {
        height: 150,
        width: "100%",
        borderRadius: 6,
    },
    scrollTopButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'gray',
        width: 40,
        height: 40,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
});