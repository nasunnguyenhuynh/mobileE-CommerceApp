import React from 'react'
import { View, Text, Modal } from 'react-native'
import AntDesign from "react-native-vector-icons/AntDesign"

interface NotifyProps {
    visible: boolean;
    text: string;
}
export const Notify = ({ visible, text }: NotifyProps) => {
    const transparent = 'rgba(0,0,0,0.5)';

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <View style={{
                    position: "absolute",
                    backgroundColor: transparent,
                    padding: 15,
                    width: "60%",
                    borderRadius: 10,
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <AntDesign name="infocirlce" size={30} color="#fff" />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 16, color: '#fff' }}>{text}</Text>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default Notify
