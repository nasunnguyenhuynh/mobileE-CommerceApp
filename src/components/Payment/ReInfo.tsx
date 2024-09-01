import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Modal, Text, TextInput, ActivityIndicator } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import api, { authAPI, endpoints } from "../../utils/api";
import { ReceiverInformation } from "../../interfaces/receiverinfo";
// redux
import store from "../../redux/store";

interface ReInfoProps {
    visible: boolean;
    toggleModal: () => void;

    selectedReceiverInfo: ReceiverInformation;
    setReceiverInfoList: React.Dispatch<React.SetStateAction<ReceiverInformation[]>>;
}
const ReInfo = ({ visible, toggleModal, selectedReceiverInfo, setReceiverInfoList }: ReInfoProps) => {
    const transparent = 'rgba(0,0,0,0.5)';

    // Check data
    const [id, setId] = useState(selectedReceiverInfo?.id || null)
    const [name, setName] = useState(selectedReceiverInfo?.name || '');
    const [address, setAddress] = useState(selectedReceiverInfo?.address || '');
    const [phone, setPhone] = useState(selectedReceiverInfo?.phone || '');
    const [isDefault, setIsDefault] = useState(selectedReceiverInfo?.default || false);

    const [error, setError] = useState('');
    const [focusField, setFocusField] = useState('');
    const [loading, setLoading] = useState(false);
    if (!visible) return null;

    const handleFieldFocus = (field: String) => {
        if (error && (field === 'name' || field === 'address' || field === 'phone')) {
            setError('');
        }
    };

    const handleCreateUpdateAddress = async () => {
        if (!name) {
            setError("This field cannot be empty");
            setFocusField('name');
            return;
        } else if (!address) {
            setError("This field cannot be empty");
            setFocusField('address');
            return;
        } else if (!phone) {
            setError("This field cannot be empty");
            setFocusField('phone');
            return;
        } else {
            try {
                setLoading(true);
                const closeModal = async () => {
                    const response = await axiosInstance.get(endpoints["address-phone"](store.getState().user.info?.id))
                    setReceiverInfoList(response.data);
                    toggleModal();
                }

                const axiosInstance = await authAPI();
                if (id) {
                    const response = await axiosInstance.patch(endpoints["address-phone"](store.getState().user.info?.id), {
                        id: selectedReceiverInfo.id, name, phone, address
                    })
                    if (response.status === 200 && response.data) {
                        closeModal();
                    }
                }
                else {
                    const response = await axiosInstance.post(endpoints["address-phone"](store.getState().user.info?.id), {
                        name, phone, address
                    })
                    if (response.status === 201 && response.data) {
                        closeModal();
                    }
                }
            } catch (error) {
                setLoading(false);
                setError("An error occurred while updating user's information");
                console.error('Error update user\'s information:', error);
            }
        }
    };


    function renderModal() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: transparent,
                    }}
                >
                    <View style={{
                        position: "absolute",
                        bottom: 0,
                        backgroundColor: "white",
                        padding: 15,
                        width: "90%",
                        height: "60%",
                        borderRadius: 10,
                    }}>
                        <TouchableOpacity
                            onPress={toggleModal}
                            style={{
                                zIndex: 1,
                                flexDirection: "row",
                                position: "absolute",
                                right: 10, top: 10,
                            }}>
                            <AntDesign
                                name={"close"}
                                size={30}
                                color={"black"}
                            />
                        </TouchableOpacity>

                        <View style={styles.wrapProductDetailTitle}>
                            <Text
                                style={{
                                    color: "red",
                                    fontSize: 16,
                                    marginTop: 15,
                                }}
                            >Receiver Information</Text>
                        </View>

                        <View style={styles.wrapInputContainer}>
                            <View style={styles.inputContainer}>
                                <FontAwesome
                                    name={"user"}
                                    size={24}
                                    color={"#9A9A9A"}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Enter name here ... "
                                    onChangeText={setName}
                                    value={name}
                                    onFocus={() => handleFieldFocus('name')}
                                    onBlur={() => setFocusField('')}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <FontAwesome
                                    name={"home"}
                                    size={24}
                                    color={"#9A9A9A"}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Address ... "
                                    onChangeText={setAddress}
                                    value={address}
                                    onFocus={() => handleFieldFocus('address')}
                                    onBlur={() => setFocusField('')}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <FontAwesome
                                    name={"phone"}
                                    size={24}
                                    color={"#9A9A9A"}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Phone ... "
                                    maxLength={10}
                                    onChangeText={setPhone}
                                    value={phone}
                                    onFocus={() => handleFieldFocus('phone')}
                                    onBlur={() => setFocusField('')}
                                />
                            </View>


                            {error !== "" && <Text style={{ color: "red" }}>{error}</Text>}
                            <TouchableOpacity
                                style={styles.loginButtonContainer}
                                onPress={handleCreateUpdateAddress}
                                disabled={loading}>
                                {loading ?
                                    <ActivityIndicator size="small" color="#bc2b78" />
                                    : !id ?
                                        <Text style={styles.loginButtonText}>Create</Text> :
                                        <Text style={styles.loginButtonText}>Update</Text>
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <View style={styles.containerProductDetail}>
            {renderModal()}
        </View >
    )
}

export default ReInfo

const styles = StyleSheet.create({
    containerProductDetail: {
        backgroundColor: "#fff",
        marginBottom: 10,
        paddingHorizontal: 10,
    },


    wrapProductDetailTitle: {
        flexDirection: "row",
        justifyContent: "center",
    },


    wrapInputContainer: {
        marginVertical: 10,
    },
    inputContainer: {
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        borderRadius: 20,
        elevation: 10,
        alignItems: "center",
        height: 50,
        marginVertical: 14
    },
    inputIcon: {
        marginLeft: 15,
        marginRight: 5,
    },
    textInput: {
        flex: 1,
    },


    loginButtonContainer: {
        marginVertical: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#016dcb",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20
    },
    loginButtonText: {
        fontSize: 20,
        fontWeight: "400",
        color: "#fff"
    },
})