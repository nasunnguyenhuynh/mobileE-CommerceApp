// import { API_KEY } from "@env";
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import FontAwesome from "react-native-vector-icons/FontAwesome"

const ShopScreen = () => {
    return (
        // container
        <View>
            {/* Header */}
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 20
            }}>
                {/* Logo */}
                {/* Info */}
                <View>
                    <View>
                        <Text style={{ color: "#fff", fontSize: 16 }}>Shop Name</Text>
                        <FontAwesome name={'angle-right'} size={16} color={'#fff'} />
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <FontAwesome name={"star"} size={10} color={"#e7700d"} />
                            <Text style={{ color: '#fff', fontSize: 10 }}>4.7/5</Text>
                        </View>
                        <Text style={{ color: '#fff' }}>|</Text>
                        <Text>165follower</Text>
                    </View>
                </View>
                {/* Button */}

                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                }}>
                    <FontAwesome name={'plus'} size={16} color={'#fff'} />
                    <Text style={{ color: '#fff', fontSize: 16 }}>Follow</Text>
                </View>
            </View>
            {/* productList */}
        </View>
    )
}

export default ShopScreen
