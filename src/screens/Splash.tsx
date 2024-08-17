import React from 'react'
import { ImageBackground, ActivityIndicator } from 'react-native'
import globalStyles from '../styles/globalStyles'

const Splash = () => {
    return (
        <ImageBackground
            source={require('../assets/images/splash.jpg')}
            imageStyle={{ flex: 1, resizeMode: 'cover' }}
            style={[globalStyles.container, globalStyles.center]}
        >
            <ActivityIndicator size="large" color="#bc2b78" />
        </ImageBackground>
    )
}

export default Splash
