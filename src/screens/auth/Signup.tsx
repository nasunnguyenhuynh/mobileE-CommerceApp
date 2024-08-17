import React, { useState, useEffect } from 'react'
import { Image, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import styles from '../../styles/Auth/styles';
import FontAwesome from "react-native-vector-icons/FontAwesome"
import Entypo from "react-native-vector-icons/Entypo"
import AntDesign from "react-native-vector-icons/AntDesign"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import globalStyles from '../../styles/globalStyles'

import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../routers/types';
import { useFocusEffect } from '@react-navigation/native';

import type { RootState, AppDispatch } from '../../redux/store';
import { useSelector, useDispatch } from 'react-redux'
import { signup, loginWithGG } from '../../redux/auth/authSlice';

type Props = StackScreenProps<AuthStackParamList, 'Signup'>;
const Signup = ({ navigation }: Props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const [focusField, setFocusField] = useState('');
    // State variable to track password visibility 
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    // Function to toggle the password visibility state 
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const toggleShowPassword2 = () => {
        setShowPassword2(!showPassword2);
    };

    const navigateLogin = () => {
        navigation.navigate('Login')
    }
    const navigateLoginWithSms = () => {
        navigation.navigate('LoginWithSMS')
    }

    const dispatch = useDispatch<AppDispatch>()
    const { status, error: err } = useSelector((state: RootState) => state.auth);
    const handleSignup = async () => {
        if (!username) {
            setError("Username cannot be empty");
            setFocusField('username');
            return;
        } else if (!password) {
            setError("Password cannot be empty");
            setFocusField('password');
            return;
        }
        else if (!password2 || password2 !== password) {
            setError("Plz retype password");
            setFocusField('password2');
            return;
        } else {
            dispatch(signup({ username, password }));
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            if (status === 'failed') {
                setError(err)
            }
            if (status === 'Signup Success!') {
                Alert.alert(
                    "Signup Success!",
                    "Your account has been created, plz login again!",
                    [
                        {
                            text: "Oke",
                            onPress: () => navigation.navigate('Login')
                        }
                    ]
                );
            }
        }, [status])
    );

    const handleFieldFocus = (focusField: String) => {
        if (error && (focusField === 'username' || focusField === 'password' || focusField === 'password2')) {
            setError('');
        }
    };

    const handleLoginWithGoogle = async () => {
        dispatch(loginWithGG());
    }

    return (
        <View style={[globalStyles.container, globalStyles.center]}>
            <View>
                <View>
                    <View style={styles.logoLoginContainer} >
                        <Image
                            source={require("../../assets/images/logo.jpg")}
                            style={styles.logo}
                        />
                    </View>
                    <View style={styles.loginTextContainer}>
                        <Text style={styles.loginText}>Signup</Text>
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
                                placeholder="Username"
                                onChangeText={setUsername}
                                value={username}
                                onFocus={() => handleFieldFocus('username')}
                                onBlur={() => setFocusField('')} />
                        </View>
                        <View style={styles.inputContainer} >
                            <FontAwesome
                                name={"lock"}
                                size={24}
                                color={"#9A9A9A"}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Password"
                                onChangeText={setPassword}
                                value={password}
                                secureTextEntry={!showPassword}
                                onFocus={() => handleFieldFocus('password')}
                                onBlur={() => setFocusField('')}
                            />
                            <MaterialCommunityIcons
                                name={showPassword ? 'eye-off' : 'eye'}
                                size={24}
                                color="#aaa"
                                style={{ marginRight: 10 }}
                                onPress={toggleShowPassword}
                            />
                        </View>
                        <View style={styles.inputContainer} >
                            <FontAwesome
                                name={"lock"}
                                size={24}
                                color={"#9A9A9A"}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Retype password"
                                onChangeText={setPassword2}
                                value={password2}
                                secureTextEntry={!showPassword2}
                                onFocus={() => handleFieldFocus('password2')}
                                onBlur={() => setFocusField('')}
                            />
                            <MaterialCommunityIcons
                                name={showPassword ? 'eye-off' : 'eye'}
                                size={24}
                                color="#aaa"
                                style={{ marginRight: 10 }}
                                onPress={toggleShowPassword2}
                            />
                        </View>
                        <View style={styles.textLinkContainer}>
                            <TouchableOpacity onPress={navigateLogin}>
                                <Text style={styles.loginWithSMSText}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={navigateLoginWithSms}>
                                <Text style={styles.loginWithSMSText}>Login with SMS</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ color: "red" }}>{error}</Text>
                        <TouchableOpacity style={styles.loginButtonContainer} onPress={handleSignup}>
                            {status === 'pending' ?
                                <ActivityIndicator size="large" color="#0000ff" /> :
                                <Text style={styles.loginButtonText}>Signup</Text>}
                        </TouchableOpacity>

                        <View style={{
                            marginVertical: 16,
                            flexDirection: "row",
                            justifyContent: 'center',
                            alignItems: "center",
                        }}>
                            <View style={{
                                width: "40%",
                                borderTopWidth: 1,
                                borderTopColor: "#8b8b8b",
                            }}></View>
                            <View style={{ marginHorizontal: 10 }}><Text style={{ color: "#8b8b8b" }}>Or</Text></View>
                            <View style={{
                                width: "40%",
                                borderTopWidth: 1,
                                borderTopColor: "#8b8b8b",
                            }}></View>
                        </View>
                    </View>
                    <View style={styles.socialMediaContainer}>
                        {/* <Entypo
                        name={"facebook-with-circle"}
                        size={30}
                        color={"blue"}
                        style={styles.socialIcon}
                    />
                    <AntDesign
                        name={"github"}
                        size={30}
                        color={"black"}
                        style={styles.socialIcon}
                    /> */}
                        <TouchableOpacity onPress={handleLoginWithGoogle}>
                            <AntDesign
                                name={"google"}
                                size={30}
                                color={"red"}
                                style={styles.socialIcon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Signup
