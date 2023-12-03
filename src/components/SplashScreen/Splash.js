import LottieView from 'lottie-react-native';
import React from 'react';
import {View} from 'react-native';

function Splash({setIsLoading}) {
  return (
    <View
      style={{
        margin: 0,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
      }}>
      <LottieView
        source={require('../../assets/lottie/nupost_splash_screen.json')}
        resizeMode="cover"
        style={{height: 300, width: 300}}
        autoPlay
        loop={false}
        onAnimationFinish={() => setIsLoading(false)}
      />
    </View>
  );
}

export default Splash;
