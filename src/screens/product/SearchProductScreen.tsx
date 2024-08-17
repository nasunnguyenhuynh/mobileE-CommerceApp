import React, { useState, useEffect, useRef } from "react";
import {
    StyleSheet,
    Text,
    FlatList,
    View,
    Image,
    TouchableOpacity,
    Dimensions, TextInput,
    NativeSyntheticEvent,
    NativeScrollEvent
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign"
import Feather from "react-native-vector-icons/Feather"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import formatCurrency from "../../constants/formatCurrency";
import api, { endpoints } from "../../utils/api";
import useModal from "../../hooks/useModal";
import ProductFilter from "../../components/Home/ProductFilter";

//navigation
import { StackScreenProps } from '@react-navigation/stack';
import { ProductStackParamList } from '../../routers/types'

type Props = StackScreenProps<ProductStackParamList, 'SearchProductScreen'>;
const SearchProductScreen = ({ navigation, route }: Props) => {
    const [search, setSearch] = useState(route.params?.data);
    const { isModalVisible, toggleModal } = useModal();
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(true);
    const [showScrollTopButton, setShowScrollTopButton] = useState(false);
    const scrollViewRef = useRef<FlatList<Product>>(null);

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

    function containsOnlyDigits(input: any) {
        return !isNaN(input);
    }

    const handleApplyFilters = async (newFilters: any) => {
        console.log('newFilters ', newFilters);

        setRefreshing(true);
        try {
            const cate_name = newFilters.selectedCategory?.name ? `&cate_name=${newFilters.selectedCategory.name}` : ''
            const product_name = search ? `&product_name=${search}` : ''
            const pmn = newFilters?.min ? `&pmn=${newFilters.min}` : ''
            const pmx = newFilters?.max ? `&pmx=${newFilters.max}` : ''
            const priceOrder = newFilters?.priceOrder === 'opi' ? `&opi` : (newFilters.priceOrder === 'opd' ? `&opd` : '')
            const sortOrder = newFilters?.sortOrder === 'oni' ? `&oni` : (newFilters.sortOrder === 'ond' ? `&ond` : '')

            const response = await api.get(`/products/?${product_name}${sortOrder}${cate_name}${pmn}${pmx}${priceOrder}`);

            setData(response.data.results);
            setRefreshing(false);
        } catch (error) {
            console.error('Error fetching filterd products:', error);
            setRefreshing(false);
        }
    };

    const fetchProducts = async () => { // Fetch searched products
        setRefreshing(true);
        try {
            if (containsOnlyDigits(search)) {
                const response = await api.get(endpoints.products_pmn(search));
                setData(response.data.results);
                setRefreshing(false);
            } else {
                const response = await api.get(endpoints.product_name(search));
                setData(response.data.results);
                setRefreshing(false);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setRefreshing(false);
        }
    };

    const handleProductPress = (productId: number) => {   // Navigate to ProductDetail
        try {
            api.get(`/products/${productId}`)
                .then(async response => {
                    if (response.status === 200 && response.data) {
                        //console.log('data to ProductDetail : ', response.data); //Send JSON
                        navigation.navigate('ProductDetailScreen', { data: response.data })
                    }
                })
                .catch(error => {
                    console.error(`Error fetching product has id ${productId}:`, error)
                });
        } catch (error) {
            console.error(`Error fetching product has id ${productId}:`, error);
        }
    };

    const renderItemComponent = ({ item }: { item: Product }) => { // Render Component for Flatlist
        // console.log(item.images[0].image)
        return (
            <TouchableOpacity style={styles.containerProductCard} onPress={() => handleProductPress(item.id)}>
                <Image style={styles.image} source={{ uri: item.images[0].image }} />
                <View style={{ margin: 4 }}>
                    <Text numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
                    <View style={styles.wrapRating}>
                        <FontAwesome name={"star"} size={10} color={"#e7700d"} />
                        <Text style={{ fontSize: 8 }}>{item.product_rating}</Text>
                    </View>
                    <View style={styles.wrapPriceSold}>
                        <Text style={{ fontSize: 16, color: "#cf3131", textDecorationLine: 'underline' }}>{formatCurrency(item.price)}đ</Text>
                        <Text style={{ fontSize: 10, color: "#6d696996" }}>{item.sold} sold</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };
    // handleRefresh
    const handleRefresh = () => {
        setRefreshing(false);
        fetchProducts();
    };
    // handleScroll
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const yOffset = event.nativeEvent.contentOffset.y;
        setShowScrollTopButton(yOffset > 300);
    };

    const scrollToTop = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToOffset({ offset: 0, animated: true });
        }
    };
    // fetchProducts
    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <>
            {/* header */}
            <View style={styles.wrapHeaderHompage}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" size={30} color="black" />
                </TouchableOpacity>
                <View style={styles.inputContainer} >
                    <TouchableOpacity
                        onPress={() => fetchProducts()}
                    >
                        <Feather
                            name={"search"}
                            size={20}
                            color={"#9A9A9A"}
                            style={styles.inputIcon}
                        />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Search"
                        value={search}
                        onChangeText={text => setSearch(text)}
                    />
                </View>
                {/* Filter */}
                <TouchableOpacity
                    style={styles.wrapFilter}
                    onPress={toggleModal}
                >
                    <AntDesign
                        name={"filter"}
                        size={30}
                        color={"#000"}
                        style={{}}
                    />
                    <View style={{ height: "100%", justifyContent: "flex-end" }}>
                        <Text style={{ fontSize: 8 }}>
                            Filter
                        </Text>
                    </View>
                </TouchableOpacity>
                {isModalVisible && (
                    <ProductFilter
                        visible={isModalVisible}
                        toggleModal={toggleModal}
                        onApplyFilters={handleApplyFilters}
                    />
                )}
            </View>
            <FlatList
                data={data}
                renderItem={renderItemComponent}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                style={{}}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                ref={scrollViewRef}
            />

            {showScrollTopButton && (
                <TouchableOpacity style={styles.scrollTopButton} onPress={scrollToTop}>
                    <AntDesign name="arrowup" size={24} color="white" />
                </TouchableOpacity>
            )}
        </>
    );
}

export default SearchProductScreen

const { width: screenWidth } = Dimensions.get('window');
const containerWidth = screenWidth * 0.46;
const styles = StyleSheet.create({
    containerProductCard: {
        height: 240,
        marginBottom: 10,
        marginLeft: 10,
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
        height: 140,
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

    // header
    wrapHeaderHompage: {
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
        width: '100%',
    },
    inputContainer: {
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        borderRadius: 20,
        elevation: 10,
        alignItems: "center",
        height: "100%",
        marginLeft: 10,
        width: '60%',
    },
    inputIcon: {
        marginLeft: 15,
        marginRight: 5,
    },
    textInput: {
        flex: 1,
        marginRight: 15,
    },
    wrapFilter: {
        marginLeft: 10,
        // backgroundColor: "tomato",
        height: 30,
        flexDirection: "row",
        alignItems: "center",
    }
});