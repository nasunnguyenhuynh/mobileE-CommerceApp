import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons"
import { Badge } from "react-native-elements";
// navigation
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
// redux
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
const BubbleChat = () => {
    const numberMessage = 12;
    const navigation = useNavigation<NavigationProp<any>>();
    return (
        <TouchableOpacity onPress={() => {}}>
            <View>
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
                    status="error"
                    textProps={{}}
                    textStyle={{
                        fontSize: 10,
                    }}
                    value={numberMessage}
                />
            </View>
        </TouchableOpacity>
    )
}

export default BubbleChat
