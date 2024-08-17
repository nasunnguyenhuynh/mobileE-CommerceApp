import React from 'react'
import { View, Text } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack';
import {ChatStackParamList} from '../../routers/types'

type Props = StackScreenProps<ChatStackParamList, 'ChatScreen'>;

const ChatScreen = ({navigation}: Props) => {
    return (
        <View>
            <Text>Chat Screen</Text>
        </View>
    )
}

export default ChatScreen
