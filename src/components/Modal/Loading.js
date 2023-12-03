import LottieView from 'lottie-react-native';
import React from 'react';
import {View} from 'react-native';

function Loading(props) {
  return (
    <View
      style={{
        margin: 0,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#66000000',
      }}>
      <LottieView
        source={require('../../assets/lottie/loading.json')}
        resizeMode="cover"
        style={{height: 50, width: 100}}
        autoPlay
        loop={true}
      />
    </View>
  );
}

export default Loading;
