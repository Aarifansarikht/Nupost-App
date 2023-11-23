import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import {err} from 'react-native-svg/lib/typescript/xml';
import Video from 'react-native-video';
const {width, height} = Dimensions.get('window');

const VideoPlayerComponent = ({route}) => {
  const {uri} = route.params;
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  console.log(uri, 'uri');

  const onBuffer = buffer => {
    if (buffer.isBuffering) {
      setIsVideoLoading(true);
    } else {
      setIsVideoLoading(false);
    }
  };

  const videoError = error => {
    console.log(error);
  };

  return (
    <View style={styles.container}>
      {isVideoLoading && (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <Video
        source={{uri: uri}}
        ref={ref => {
          this.player = ref;
        }}
        resizeMode={'contain'}
        onBuffer={onBuffer}
        onError={videoError}
        style={styles.backgroundVideo}
        controls={true}
        fullscreen={true}
        fullscreenAutorotate={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  backgroundVideo: {
    position: 'absolute',
    width: width,
    aspectRatio: width / height,
  },
});

export default VideoPlayerComponent;
