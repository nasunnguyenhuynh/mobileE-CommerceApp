import React from 'react'
import { View, Text } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack';
import { ExtensionShopStackParamList } from '../../types';
import { createStackNavigator } from '@react-navigation/stack';

import store from '../../../redux/store';

const ExtensionShopStack = createStackNavigator<ExtensionShopStackParamList>();
import AddInfoShopScreen from './AddInfoShopScreen';
import CreateShopScreen from './CreateShopScreen';
import MyShopScreen from './MyShopScreen';
type Props = StackScreenProps<ExtensionShopStackParamList, 'ExtensionShopScreen'>;

const ExtensionShopScreen = ({ navigation }: Props) => {
    return (
        <ExtensionShopStack.Navigator>
            {/* <ExtensionShopStack.Screen name="CreateShopScreen" component={CreateShopScreen} /> */}
            {!store.getState().user.info?.is_vendor
                && store.getState().userShopConfirmation.error === 'No ShopConfirmation'
                && <ExtensionShopStack.Screen name="CreateShopScreen" component={CreateShopScreen} />
            }
            {!store.getState().user.info?.is_vendor
                && store.getState().userShopConfirmation.info?.status === 'Providing Additional Information'
                && <ExtensionShopStack.Screen name="AddInfoShopScreen" component={AddInfoShopScreen} />
            }
            {store.getState().user.info?.is_vendor
                && store.getState().userShopConfirmation.info?.status === 'Successful'
                && <ExtensionShopStack.Screen name="MyShopScreen" component={MyShopScreen} />
            }
        </ExtensionShopStack.Navigator>
    )
}

export default ExtensionShopScreen