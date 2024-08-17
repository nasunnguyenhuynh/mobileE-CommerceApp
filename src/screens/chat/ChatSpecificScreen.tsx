import React from 'react'
import { View, Text } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack';
import { ChatStackParamList } from '../../routers/types'

type Props = StackScreenProps<ChatStackParamList, 'ChatSpecificScreen'>;

const ChatSpecificScreen = ({ navigation }: Props) => {
    return (
        <View>
            <Text>Chat Specific Screen</Text>
        </View>
    )
}

export default ChatSpecificScreen
