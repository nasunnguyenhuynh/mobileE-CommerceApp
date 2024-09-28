import React, { useState } from 'react'
import { View, Text, TextInput, Image, ActivityIndicator, Platform, Alert, TouchableOpacity, StyleSheet } from 'react-native'
import FontAwesome from "react-native-vector-icons/FontAwesome"
import { authAPI, endpoints } from '../../utils/api'
//Camera
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { PermissionsAndroid, Linking } from 'react-native';
// components
import { Notify } from '../../components'
// redux
import store from '../../redux/store'
// Navigation
import { ProfileStackParamList } from '../../routers/types';
import { StackScreenProps } from '@react-navigation/stack';
type Props = StackScreenProps<ProfileStackParamList, 'EditProfileScreen'>;
const EditProfileScreen = ({ navigation }: Props) => {
    const [avatar, setAvatar] = useState(store.getState().user.info?.avatar);
    const [username, setUsername] = useState(store.getState().user.info?.username);
    const [firsname, setFirstname] = useState(store.getState().user.info?.first_name);
    const [lastname, setLastname] = useState(store.getState().user.info?.last_name);
    const [email, setEmail] = useState(store.getState().user.info?.email);
    const [phone, setPhone] = useState(store.getState().user.info?.phone);
    const [loading, setLoading] = useState(false)
    // changeAvatar
    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Camera Permission",
                    message: "This app needs access to your camera so you can take pictures.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            console.log('CameraPermission ', granted);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
                Alert.alert("Camera Permission Denied", "Please enable camera permission in settings.");
                return false;
            } else {
                Alert.alert(
                    "Camera Permission Required",
                    "Please enable camera permission in settings.",
                    [
                        {
                            text: "Cancel",
                            style: "cancel"
                        },
                        {
                            text: "Open Settings",
                            onPress: () => Linking.openSettings()
                        }
                    ]
                );
                return false;
            }
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    const pickImage = async (arg: 'avatar') => {
        Alert.alert(
            'Select Image',
            'Choose an option',
            [
                {
                    text: 'Camera',
                    onPress: async () => {
                        if (Platform.OS === 'android') {
                            const granted = await requestCameraPermission();
                            if (!granted) {
                                return;
                            }
                        }
                        launchCamera(
                            {
                                mediaType: 'photo',
                                includeBase64: false,
                            },
                            (response) => {
                                if (response.didCancel) {
                                    console.log('User cancelled image picker');
                                } else if (response.errorMessage) {
                                    console.log('ImagePicker Error: ', response.errorMessage);
                                } else if (response.assets && response.assets.length > 0) {
                                    const uri = response.assets[0].uri;
                                    if (arg === 'avatar') {
                                        setAvatar(uri);
                                    }
                                }
                            }
                        );
                    },
                },
                {
                    // Package automatically access mediafile without asking permission
                    text: 'Gallery',
                    onPress: async () => {
                        launchImageLibrary(
                            {
                                mediaType: 'photo',
                                includeBase64: false,
                            },
                            (response) => {
                                if (response.didCancel) {
                                    console.log('User cancelled image picker');
                                } else if (response.errorMessage) {
                                    console.log('ImagePicker Error: ', response.errorMessage);
                                } else if (response.assets && response.assets.length > 0) {
                                    const uri = response.assets[0].uri;
                                    if (arg === 'avatar') {
                                        setAvatar(uri);
                                    }
                                }
                            }
                        );
                    },
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    };
    // handle error
    const [error, setError] = useState('');
    const [focusField, setFocusField] = useState('');
    const handleFieldFocus = (focusField: String) => {
        if (error && (focusField === 'username' || focusField === 'avatar' ||
            focusField === 'firstname' || focusField === 'lastname' ||
            focusField === 'phone' || focusField === 'email'
        )) {
            setError('');
        }
    };
    const [openModel, setOpenModal] = useState(false);
    const [notifyText, setNotifyText] = useState('');
    const handleNotify = (notifyText: string) => {
        setNotifyText(notifyText)
        setOpenModal(true)
        const timeout = setTimeout(() => {
            setOpenModal(false)
        }, 800);

        return () => clearTimeout(timeout)
    }

    // updateUserInfo
    const updateUserInfo = async () => {
        if (!username) {
            setError("Username cannot be empty");
            setFocusField('username');
            return;
        } else if (!avatar) {
            setError("Avatar cannot be empty");
            setFocusField('avatar');
            return;
        } else {
            try {
                setLoading(true);
                const axiosInstance = await authAPI();
                const response = await axiosInstance.patch(endpoints.currentUser);
                if (response.status === 200 && response.data) {
                    navigation.navigate('HomeNavigator', { screen: 'ProfileScreen' })
                }
            } catch (error) {
                handleNotify('An error occur, plz try again later!')
            } finally {
                setLoading(false);
            }
        }
    }


    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.avatarContainer}
                onPress={() => { pickImage('avatar') }}
                onFocus={() => handleFieldFocus('avatar')}
                onBlur={() => setFocusField('')}
            >
                <Image
                    source={avatar ? { uri: avatar } : require("../../assets/images/blank-profile.png")}
                    style={styles.avatar}
                />
                <View style={styles.iconContainer} >
                    <FontAwesome
                        name={"pencil"}
                        size={16}
                        color={"black"}
                        style={{}}
                    />
                </View>
            </TouchableOpacity>
            <View style={styles.wrapInputContainer}>
                <View style={styles.inputContainer} >
                    <FontAwesome
                        name={"user"}
                        size={24}
                        color={"#9A9A9A"}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Username"
                        onChangeText={setUsername}
                        value={username}
                        onFocus={() => handleFieldFocus('username')}
                        onBlur={() => setFocusField('')} />
                </View>
            </View>
            <View style={styles.wrapInputContainer}>
                <View style={styles.inputContainer} >
                    <FontAwesome
                        name={"user"}
                        size={24}
                        color={"#9A9A9A"}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Firstname"
                        onChangeText={setFirstname}
                        value={firsname}
                        onFocus={() => handleFieldFocus('firsname')}
                        onBlur={() => setFocusField('')} />
                </View>
            </View>
            <View style={styles.wrapInputContainer}>
                <View style={styles.inputContainer} >
                    <FontAwesome
                        name={"user"}
                        size={24}
                        color={"#9A9A9A"}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Lastname"
                        onChangeText={setLastname}
                        value={lastname}
                        onFocus={() => handleFieldFocus('lastname')}
                        onBlur={() => setFocusField('')} />
                </View>
            </View>
            <View style={styles.wrapInputContainer}>
                <View style={styles.inputContainer} >
                    <FontAwesome
                        name={"envelope"}
                        size={24}
                        color={"#9A9A9A"}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Email"
                        onChangeText={setEmail}
                        value={email}
                        onFocus={() => handleFieldFocus('email')}
                        onBlur={() => setFocusField('')} />
                </View>
            </View>
            <View style={styles.wrapInputContainer}>
                <View style={styles.inputContainer} >
                    <FontAwesome
                        name={"phone"}
                        size={24}
                        color={"#9A9A9A"}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Phone"
                        keyboardType="numeric"
                        maxLength={10}
                        onChangeText={setPhone}
                        value={phone}
                        onFocus={() => handleFieldFocus('phone')}
                        onBlur={() => setFocusField('')}
                    />
                </View>
            </View>
            <Text style={{ color: "red" }}>{error}</Text>
            <TouchableOpacity style={styles.updateButtonContainer} onPress={updateUserInfo}>
                {loading ?
                    <ActivityIndicator size="large" color="#0000ff" /> :
                    <Text style={styles.updateButtonText}>Update</Text>}
                {openModel && <Notify visible={openModel} text={notifyText} />}
            </TouchableOpacity>
        </View>
    )
}

export default EditProfileScreen
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F5F5F5",
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    avatarContainer: {
        alignSelf: 'center',
        width: 100,
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 100,
    },
    iconContainer: {
        position: "absolute",
        bottom: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "gray",
        width: 20,
        height: 20,
        borderRadius: 100,
    },
    wrapInputContainer: {
        marginVertical: 14,
    },
    inputContainer: {
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        borderRadius: 20,
        elevation: 10,
        alignItems: "center",
        height: 50,
    },
    inputIcon: {
        marginLeft: 15,
        marginRight: 5,
    },
    textInput: {
        flex: 1,
        marginRight: 10,
    },
    updateButtonContainer: {
        marginVertical: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#016dcb",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20
    },
    updateButtonText: {
        fontSize: 20,
        fontWeight: "400",
        color: "#fff"
    },
})