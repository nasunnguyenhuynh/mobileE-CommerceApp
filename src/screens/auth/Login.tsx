import React, { useState, useEffect } from 'react'
import { Image, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import styles from '../../styles/Auth/styles';
import FontAwesome from "react-native-vector-icons/FontAwesome"
import AntDesign from "react-native-vector-icons/AntDesign"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import globalStyles from '../../styles/globalStyles'
//navigation
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../routers/types';
import { useFocusEffect } from '@react-navigation/native';
//redux
import type { RootState, AppDispatch } from '../../redux/store';
import { useSelector, useDispatch } from 'react-redux'
import { loginUser, loginWithGG } from '../../redux/auth/authSlice';

type Props = StackScreenProps<AuthStackParamList, 'Login'>;
const Login = ({ navigation }: Props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [focusField, setFocusField] = useState('');
    // State variable to track password visibility 
    const [showPassword, setShowPassword] = useState(false);

    // Function to toggle the password visibility state 
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const navigateSignup = () => {
        navigation.navigate('Signup')
    }
    const navigateLoginpWithSms = () => {
        navigation.navigate('LoginWithSMS')
    }

    const dispatch = useDispatch<AppDispatch>()
    const { status, error: err } = useSelector((state: RootState) => state.auth);
    const handleLogin = async () => {
        if (!username) {
            setError("Username cannot be empty");
            setFocusField('username');
            return;
        } else if (!password) {
            setError("Password cannot be empty");
            setFocusField('password');
            return;
        } else {
            dispatch(loginUser({ username, password }));
        }
    };

    const handleFieldFocus = (focusField: String) => {
        if (error && (focusField === 'username' || focusField === 'password')) {
            setError('');
        }
    };

    const handleLoginWithGoogle = () => {
        dispatch(loginWithGG());
    }

    // Similar to useEffect but just listen to focused screen
    useFocusEffect(
        React.useCallback(() => {
            if (status === 'failed') {
                setError(err);
            }
            if (status === 'success') {
                setUsername('')
                setPassword('')
                navigation.navigate('HomeNavigator');
            }
        }, [status])
    );

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
                        <Text style={styles.loginText}>Login</Text>
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
                        <View style={styles.textLinkContainer}>
                            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                            <TouchableOpacity onPress={navigateLoginpWithSms}>
                                <Text style={styles.loginWithSMSText}>Login with SMS</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ color: "red" }}>{error}</Text>
                        <TouchableOpacity style={styles.loginButtonContainer} onPress={handleLogin}>
                            {status === 'pending' ?
                                <ActivityIndicator size="large" color="#0000ff" /> :
                                <Text style={styles.loginButtonText}>Login</Text>}
                        </TouchableOpacity>
                        <View style={styles.textLinkSignupContainer}>
                            <TouchableOpacity onPress={navigateSignup}>
                                <Text>Don't have an account?
                                    <Text style={{ color: "#0171d3" }}> Signup</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
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
    )
}

export default Login
