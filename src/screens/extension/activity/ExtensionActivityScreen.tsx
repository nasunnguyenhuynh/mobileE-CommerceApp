import React from 'react'
import { View, Text } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack';
import { ExtensionActivityStackParamList } from '../../types';

type Props = StackScreenProps<ExtensionActivityStackParamList, 'ExtensionActivityScreen'>;

const ExtensionActivityScreen = ({ navigation }: Props) => {
    return (
        <View>
            <Text>ExtensionActivityScreen</Text>
        </View>
    )
}

export default ExtensionActivityScreen