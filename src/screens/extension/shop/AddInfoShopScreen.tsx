import React, { useState } from 'react'
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native'
import { authAPI } from '../../../utils/api'

//Redux
import store from '../../../redux/store'
//Camera
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { PermissionsAndroid, Linking } from 'react-native';
//Navigation
import { StackScreenProps } from '@react-navigation/stack';
import { ExtensionShopStackParamList } from '../../types';

type Props = StackScreenProps<ExtensionShopStackParamList, 'AddInfoShopScreen'>;

const AddInfoShopScreen = ({ navigation }: Props) => {
    const [CII, setCII] =
        useState<string | undefined>(store.getState().userShopConfirmation.info?.citizen_identification_image);
    const [shopName, setShopName] =
        useState(store.getState().userShopConfirmation.info?.shop_name);
    const [shopImage, setShopImage] =
        useState<string | undefined>(store.getState().userShopConfirmation.info?.shop_image);
    const [shopDescription, setShopDescription] =
        useState(store.getState().userShopConfirmation.info?.shop_description);
    const [error, setError] = useState('');
    const [focusField, setFocusField] = useState('');
    const [loading, setLoading] = useState(false);

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

    const pickImage = async (arg: 'cii' | 'shopImage') => {
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
                                    if (arg === 'cii') {
                                        setCII(uri);
                                    } else if (arg === 'shopImage') {
                                        setShopImage(uri);
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
                                    if (arg === 'cii') {
                                        setCII(uri);
                                    } else if (arg === 'shopImage') {
                                        setShopImage(uri);
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

    const handleFieldFocus = (focusField: String) => {
        if (error &&
            (focusField === 'CII' || focusField === 'shopName' ||
                focusField === 'shopImage' || focusField === 'shopDescription'
            )) {
            setError('');
        }
    };

    const handleSendShopConfirmation = async () => {
        if (!CII) {
            setError("Plz choose your citizen identification image");
            setFocusField('CII');
            return;
        }
        if (!shopName) {
            setError("Plz enter your shop name");
            setFocusField('shopName');
            return;
        }
        if (!shopImage) {
            setError("Plz choose your shop image");
            setFocusField('shopImage');
            return;
        }
        if (!shopDescription) {
            setError("Plz enter your shop description");
            setFocusField('shopDescription');
            return;
        }


        try {
            setLoading(true);
            // Extract Image Info
            const extractFileInfo = (uri: string) => {
                const filename = uri.split('/').pop() || 'unknown';
                const match = /\.(\w+)$/.exec(filename);
                const filetype = match ? `image/${match[1]}` : 'image/jpeg';
                return { uri, name: filename, type: filetype };
            };

            const CIIInfo = extractFileInfo(CII);
            const shopImageInfo = extractFileInfo(shopImage);
            // Add fields into formData
            let formData = new FormData();
            formData.append('citizen_identification_image', {
                uri: CIIInfo.uri,
                name: CIIInfo.name,
                type: CIIInfo.type,
            });
            formData.append('shop_image', {
                uri: shopImageInfo.uri,
                name: shopImageInfo.name,
                type: shopImageInfo.type,
            });
            formData.append('shop_name', shopName);
            formData.append('shop_description', shopDescription);
            //  Send ShopConfirmation
            const axiosInstance = await authAPI();
            axiosInstance.patch(`/users/${store.getState().user.info?.id}/shop-confirmation/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(async response => {
                    if (response.status === 201 && response?.data) {
                        console.log(response.data)
                        navigation.navigate('ProfileScreen')
                    }
                })
                .catch(error => {
                    console.error('error: ', error);
                    setError("An error occurred during sending, please try again");
                    setLoading(false);
                });
        } catch (error) {
            console.error('error: ', error);
            setError("An error occurred during sending, please try again");
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollview}>
                <View style={styles.section}>
                    <Text style={styles.title}>Citizen Identification Image</Text>
                    <TouchableOpacity
                        onPress={() => pickImage('cii')}
                        style={styles.cii_image}
                        onFocus={() => handleFieldFocus('CII')}
                        onBlur={() => setFocusField('')}
                    >
                        {CII ?
                            <Image
                                source={{ uri: CII }}
                                style={styles.cii_image} />
                            :
                            <Image
                                source={require('../../../assets/images/logo.jpg')}
                                style={styles.cii_image}
                            />
                        }
                    </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    <Text style={styles.title}>Shop Name</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter shop name"
                        onChangeText={setShopName}
                        value={shopName}
                        onFocus={() => handleFieldFocus('shopName')}
                        onBlur={() => setFocusField('')} />
                </View>
                <View style={styles.section}>
                    <Text style={styles.title}>Shop Image</Text>
                    <TouchableOpacity
                        style={styles.shopImage}
                        onPress={() => pickImage('shopImage')}
                        onFocus={() => handleFieldFocus('shopImage')}
                        onBlur={() => setFocusField('')}>
                        {shopImage ?
                            <Image source={{ uri: shopImage }} style={styles.shopImage} />
                            :
                            <Image
                                source={require('../../../assets/images/logo.jpg')}
                                style={styles.shopImage}
                            />
                        }
                    </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    <Text style={styles.title}>Shop Description</Text>
                    <TextInput
                        multiline={true}
                        placeholder="Enter shop description here ..."
                        onChangeText={setShopDescription}
                        value={shopDescription}
                        onFocus={() => handleFieldFocus('shopDescription')}
                        onBlur={() => setFocusField('')}
                        style={styles.textInput}
                    >
                    </TextInput>

                </View>

            </ScrollView >

            <View style={styles.wrapInputContainer}>
                {error !== "" && <Text style={{ color: "red" }}>{error}</Text>}
                <TouchableOpacity
                    style={styles.loginButtonContainer}
                    disabled={loading}
                    onPress={handleSendShopConfirmation}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#bc2b78" />
                    ) : (
                        <Text style={styles.loginButtonText}>Send</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View >
    )
}

export default AddInfoShopScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F5F5F5",
        marginHorizontal: 10,
        flex: 1,
    },
    scrollview: {
        marginVertical: 20
    },
    section: { alignItems: 'center', marginBottom: 30 },
    title: { fontSize: 18, color: '#000', width: '100%' },
    cii_image: { width: '100%', height: 200, borderRadius: 5 },
    textInput: { backgroundColor: '#e0e0e0', width: '100%', borderRadius: 5 },
    shopImage: {
        width: 160,
        height: 160,
        borderRadius: 100
    },
    wrapInputContainer: {
        marginVertical: 10,
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
    }
})