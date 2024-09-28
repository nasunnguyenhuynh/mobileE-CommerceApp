import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Badge } from 'react-native-elements';

interface OrderProcessElementProps {
    iconType: 'AntDesign' | 'FontAwesome' | 'Feather' | 'Ionicons' | 'MaterialIcons';
    iconName: string;
    text: string;
    value: number
}

const OrderProcessElement = ({ iconType, iconName, text, value }: OrderProcessElementProps) => {
    let IconComponent;
    switch (iconType) {
        case 'AntDesign':
            IconComponent = AntDesign;
            break;
        case 'FontAwesome':
            IconComponent = FontAwesome;
            break;
        case 'Feather':
            IconComponent = Feather;
            break;
        case 'Ionicons':
            IconComponent = Ionicons;
            break;
        default:
            IconComponent = Ionicons; // Set a default icon component
    }

    return (
        <View style={{ alignItems: "center", position: "relative" }}>
            <IconComponent
                name={iconName}
                size={30}
                color={"black"}
            />
            {value !== null && value !== 0 && (
                <Badge
                    badgeStyle={{
                        backgroundColor: "#cf3131",
                    }}
                    containerStyle={{
                        position: 'absolute',
                        top: -4,
                        right: 0,
                    }}
                    onPress={() => { }}
                    status="error"
                    textProps={{}}
                    textStyle={{
                        fontSize: 10,
                    }}
                    value={value}
                />
            )}
            <Text style={{ color: '#000' }}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({});

export default OrderProcessElement;
