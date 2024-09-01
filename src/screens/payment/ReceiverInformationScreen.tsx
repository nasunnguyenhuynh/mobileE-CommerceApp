import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import AntDesign from "react-native-vector-icons/AntDesign"
import Fontisto from "react-native-vector-icons/Fontisto"
import Ionicons from "react-native-vector-icons/Ionicons"
import { colors } from '../../constants/colors'
import api, { authAPI, endpoints } from "../../utils/api";
import useModal from '../../hooks/useModal'
import { ReInfo } from '../../components'
import { ReceiverInformation } from '../../interfaces/receiverinfo'
//navigation
import { StackScreenProps } from '@react-navigation/stack';
import { PaymentStackParamList } from '../../routers/types'
// redux
import type { AppDispatch } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux'
import { addReInfoList } from '../../redux/reInfo/receiverInformationSlice'
import store from '../../redux/store'

type Props = StackScreenProps<PaymentStackParamList, 'ReceiverInformationScreen'>;
const ReceiverInformationScreen = ({ route, navigation }: Props) => {
    const dispatch = useDispatch<AppDispatch>()
    //Init 
    var initReceiverInfo = {
        id: 0,
        name: '',
        address: '',
        phone: '',
        default: false
    };
    const [initReInfo, setInitReInfo] = useState(initReceiverInfo);

    const [receiverInfoList, setReceiverInfoList] =
        useState<ReceiverInformation[]>(store.getState().reInfo.reInfoList); // also used for ReInfo
    const { isModalVisible, toggleModal } = useModal();

    const handleAddNewAddress = () => {
        if (initReInfo.id !== 0) {
            setInitReInfo(initReceiverInfo)
        }
        toggleModal();
    }

    const handleChangeReceiverDefault = async (id: number, is_default: boolean) => {
        try {
            const axiosInstance = await authAPI();
            const response = await axiosInstance.patch(endpoints['address-phone'](store.getState().user.info?.id), { id, default: is_default });
            if (response.status === 200 && response.data) {
                const ReInfoList = await axiosInstance.get(endpoints['address-phone'](store.getState().user.info?.id))
                if (ReInfoList.status === 200 && ReInfoList.data) {
                    dispatch(addReInfoList(ReInfoList.data))
                    navigation.navigate('PaymentScreen',
                        { data: ReInfoList.data.find((item: ReceiverInformation) => item.default) })
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            // setLoadingUserData(false)
        }
    }

    const handleChangeReceiverInfo = (id: number, name: string, address: string, phone: string, isDefault: boolean) => {
        setInitReInfo({ id, name, address, phone, default: isDefault })
        toggleModal();
    }

    const renderReceiverInfo = (item: ReceiverInformation) => {
        return (
            <TouchableOpacity
                style={styles.addressContainer}
                key={item.id}
                onPress={() => { handleChangeReceiverDefault(item.id, true) }}
            >
                <View style={styles.wrapRadioBtn}>
                    {
                        item.default ?
                            <Fontisto
                                name={"radio-btn-active"}
                                size={12}
                                color="#e7700d"
                            /> :
                            <Fontisto
                                name={"radio-btn-passive"}
                                size={12}
                                color="#e7700d"
                            />
                    }

                </View>
                <View style={styles.wrapUserInfo}>
                    <Text numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail">{item.phone}</Text>
                    <Text style={{ flexWrap: "wrap" }}>{item.address}</Text>
                </View>
                <View style={styles.wrapChangeAddress}>
                    <TouchableOpacity onPress={() => {
                        handleChangeReceiverInfo(item.id, item.name, item.address, item.phone, item.default)
                    }}>
                        <Text style={{ fontSize: 12, color: colors.blueSky, }}>Change</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }
    return (
        <ScrollView>
            <View>
                <View style={{ marginHorizontal: 10, marginBottom: 50, }}>
                    {/* Modal */}
                    {isModalVisible && (
                        <ReInfo
                            visible={isModalVisible}
                            toggleModal={toggleModal}

                            selectedReceiverInfo={initReInfo}
                            setReceiverInfoList={setReceiverInfoList}
                        />
                    )}
                    {/* Display receiverInfoList */}
                    {receiverInfoList.map(item => renderReceiverInfo(item))}
                    {/* Create a new address */}
                    <TouchableOpacity
                        onPress={handleAddNewAddress}
                        style={styles.btnAddNewAddress}>
                        <View>
                            <AntDesign
                                name={"pluscircleo"}
                                size={20}
                                color={"tomato"}
                                style={{}}
                            />
                        </View>
                        <Text style={{ color: "tomato", marginLeft: 10, }}>Add new address</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default ReceiverInformationScreen
const styles = StyleSheet.create({
    btnAddNewAddress: {
        backgroundColor: "yellow",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        paddingVertical: 16,
        paddingHorizontal: 8,
    },

    addressContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderWidth: 0.2,
        borderColor: colors.lightGray,
        borderRadius: 4,
        marginBottom: 5,
        padding: 4,
    },
    wrapRadioBtn: {
    },
    wrapUserInfo: {
        marginLeft: 5,
        flex: 1,
    },
    wrapChangeAddress: {
    },
})