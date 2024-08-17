import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface ExtensionElementProps {
    iconType: 'AntDesign' | 'FontAwesome' | 'Feather' | 'Ionicons' | 'MaterialIcons';
    iconName: string;
    iconColor: string;
    text: string;
    containerStyle?: ViewStyle;
    textStyle?: TextStyle;
}

const ExtensionElement = ({ iconType, iconName, iconColor, text, containerStyle, textStyle }: ExtensionElementProps) => {
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
        case 'MaterialIcons':
            IconComponent = MaterialIcons;
            break;
        default:
            IconComponent = Ionicons; // Set a default icon component
    }
    const isTextLong = text.length > 16;

    return (
        <View style={[styles.extensionElement, containerStyle]}>
            <View>
                <IconComponent
                    name={iconName}
                    size={30}
                    color={iconColor}
                // style={{ margin: 2 }}
                />
            </View>
            {isTextLong ? (
                <View>
                    <Text style={[styles.text, textStyle]}>{text.substring(0, 15)}</Text>
                    <Text style={[styles.text, textStyle]}>{text.substring(15)}</Text>
                </View>
            ) : (
                <Text style={[styles.text, textStyle]}>{text}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    extensionElement: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        borderColor: "gray",
        borderWidth: 0.5,
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    text: {
        margin: 2,
    }
});

export default ExtensionElement;
