import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeStackParamList } from "../../routers/types";
import Ionicons from "react-native-vector-icons/Ionicons"
import Feather from "react-native-vector-icons/Feather"
import { Badge } from "react-native-elements";
import { ProductList } from '../../components';
// Redux
import { AppDispatch } from '../../redux/store';
import { useDispatch } from 'react-redux'
import { loadCartFromStorage } from '../../redux/storage';
import { currentUser } from '../../redux/user/userSlice';
import store from '../../redux/store';

type Props = StackScreenProps<HomeStackParamList, 'HomeScreen'>;
const HomeScreen = ({ navigation }: Props) => {
    const numberMessage = 12;
    const numberProductInCart = 27;
    const [search, setSearch] = useState('');

    //Get UserState & CartState from redux-store
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        if (!store.getState().user.info) {
            console.log("fet info ", store.getState().user.info);
            dispatch(currentUser());
        }
        if (store.getState().user.info) {
            loadCartFromStorage(store.getState().user.info?.id); //not get immediately cz async function
        }
    }, [store.getState().user?.info])

    return (
        <View style={styles.container}>
            {/* Wrap_Top_Hompage */}
            <View>
                <View style={styles.wrapHeaderHompage}>
                    {/* Search */}
                    <View style={styles.inputContainer} >
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('ProductNavigator', {
                                screen: 'SearchProductScreen',
                                params: { data: search }
                            })
                        }}>
                            <Feather
                                name={"search"}
                                size={24}
                                color={"#9A9A9A"}
                                style={styles.inputIcon}
                            />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Search"
                            onChangeText={setSearch}
                        />
                    </View>

                    {/* Cart_Chat */}
                    <View style={styles.wrapCartMessage}>
                        <View style={{ position: 'relative' }}>
                            <Feather
                                name={"shopping-cart"}
                                size={30}
                                color={"black"}
                            />
                            <Badge
                                badgeStyle={{
                                    backgroundColor: "#cf3131",
                                }}
                                containerStyle={{
                                    position: 'absolute',
                                    top: -6,
                                    right: -6,
                                }}
                                // onPress={() => {
                                //     alert("message");
                                // }}
                                status="error"
                                textProps={{}}
                                textStyle={{
                                    fontSize: 10,
                                }}
                                value={numberProductInCart}
                            // options={{}}
                            />
                        </View>
                        <View style={{ position: 'relative' }}>
                            <Ionicons
                                name={"chatbubbles-outline"}
                                size={30}
                                color={"black"}
                                style={{ marginLeft: 12 }}
                            />
                            <Badge
                                badgeStyle={{
                                    backgroundColor: "#cf3131",
                                }}
                                containerStyle={{
                                    position: 'absolute',
                                    top: -6,
                                    right: -6,
                                }}
                                // onPress={() => {
                                //     alert("message");
                                // }}
                                status="error"
                                textProps={{}}
                                textStyle={{
                                    fontSize: 10,
                                }}
                                value={numberMessage}
                            // options={{}}
                            />
                        </View>
                    </View>
                </View>
            </View>
            <ProductList />
        </View >
    );
};
export default HomeScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F5F5F5",
        flex: 1,
    },
    wrapHeaderHompage: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 10,
    },
    inputContainer: {
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        borderRadius: 20,
        elevation: 10,
        alignItems: "center",
        height: 50,
        marginVertical: 10,
        flex: 2,
    },
    inputIcon: {
        marginLeft: 15,
        marginRight: 5,
    },
    textInput: {
        flex: 1,
        marginRight: 10,
    },
    wrapCartMessage: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        justifyContent: "flex-end"
    },
})