import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { authAPI, endpoints } from "../../utils/api";

import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from "@react-native-google-signin/google-signin";
// cd android
// ./gradlew signingReport
GoogleSignin.configure({
    webClientId: '94351095163-3mijcspelts6uk77oi8051viqvmg6mv9.apps.googleusercontent.com',
})

interface AuthState {
    token: string;
    status: 'idle' | 'pending' | 'success' | 'failed' | 'Signup Success!';
    error: string;
}

const initialState: AuthState = {
    token: '',
    status: 'idle',
    error: '',
};


export const loginUser = createAsyncThunk(
    //actiontype_name: auth/loginUser/pending, auth/loginUser/fulfilled, auth/loginUser/rejected
    'auth/loginUser',
    async ({ username, password }: { username: string; password: string }) => {
        const axiosInstance = await authAPI();
        const response = await axiosInstance.post(endpoints.login, {
            username,
            password,
        });
        const { access_token } = response.data;
        await AsyncStorage.setItem('access_token', access_token);
        return access_token;
    }
);

export const verifyOTP = createAsyncThunk(
    'auth/verifyOTP',
    async ({ otp }: { otp: string }) => {
        const axiosInstance = await authAPI();
        const response = await axiosInstance.post(endpoints.verifyOTP, {
            otp
        });
        const { access_token } = response.data;
        await AsyncStorage.setItem('access_token', access_token);
        return access_token;
    }
);

export const loginWithGG = createAsyncThunk(
    'auth/loginWithGG',
    async () => {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const response = await api.post(endpoints.loginWithGoogle, {
            idToken: userInfo.idToken,
            user: {
                email: userInfo.user.email,
                familyName: userInfo.user.familyName,
                givenName: userInfo.user.givenName,
                id: userInfo.user.id,
                name: userInfo.user.name,
                photo: userInfo.user.photo
            }
        });

        const { access_token } = response.data;
        await AsyncStorage.setItem('access_token', access_token);
        return access_token;
    }
);

export const signup = createAsyncThunk(
    'auth/signup',
    async ({ username, password }: { username: string; password: string }) => {
        const axiosInstance = await authAPI();
        const response = await axiosInstance.post(endpoints.signup, {
            username,
            password,
        });
        return response.data;
    }
);

const authSlice = createSlice({
    name: 'auth', //slice_name
    initialState,
    reducers: { // handle actions created by the slice itself using the createSlice function
        logout: (state) => {
            if (GoogleSignin.getCurrentUser()) {
                GoogleSignin.signOut();
            }
            state.token = '';
            state.status = 'idle';
            AsyncStorage.removeItem('access_token');
        },
        resetAuth: () => initialState, // Reset to initial state
    },
    extraReducers: (builder) => { //handle async actions created by `createAsyncThunk`
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.status = 'pending';
                state.error = '';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'success';
                state.token = action.payload || '';
                state.error = '';
            })
            .addCase(loginUser.rejected, (state) => {
                state.status = 'failed';
                state.error = 'Invalid username/phone or password.';
            })
            //VerifyOTP
            .addCase(verifyOTP.pending, (state) => {
                state.status = 'pending';
                state.error = '';
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.status = 'success';
                state.token = action.payload || '';
                state.error = '';
            })
            .addCase(verifyOTP.rejected, (state) => {
                state.status = 'failed';
                state.error = 'OTP has been expired or invalid';
            })
            //loginWithGG
            .addCase(loginWithGG.pending, (state) => {
                state.status = 'pending';
                state.error = '';
            })
            .addCase(loginWithGG.fulfilled, (state, action) => {
                state.status = 'success';
                state.token = action.payload || '';
                state.error = '';
            })
            .addCase(loginWithGG.rejected, (state) => {
                state.status = 'failed';
                state.error = 'User information mismatch';
            })
            //Signup
            .addCase(signup.pending, (state) => {
                state.status = 'pending';
                state.error = '';
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.status = 'Signup Success!';
                state.token = action.payload || '';
                state.error = '';
            })
            .addCase(signup.rejected, (state) => {
                state.status = 'failed';
                state.error = 'Username already used';
            })
    },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer