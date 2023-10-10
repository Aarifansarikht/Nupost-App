import React, { useState } from 'react';
import { StyleSheet, View, Image, ActivityIndicator } from 'react-native';

import VideoPlayer from "react-native-video-player";
function GalleryCard(props) {
  const { url } = props.item?.data;
  const isVideo = url && /\.(mp4|mov|avi|mkv)$/i.test(url);
  const [indicator, setIndicator] = useState(false);
  const handleLoadStart = () => {
    setIndicator(true);
  };
  return (

    <View style={styles.card}>
      {isVideo ? (
        <View style={styles.videoContainer}>
          <VideoPlayer
            style={{ height: 180, width: 165, borderRadius: 10 }}
            video={{ uri: filteredItem.data.url }}
            autoPlay={true}
            controlsTimeout={1000}
            defaultMuted={true}
            repeat={true}
            onLoadStart={handleLoadStart}
            hideSeekBar={true}
            onLoad={() => setIndicator(false)}
          />
          {indicator ? <ActivityIndicator size='small' color='white' style={styles.activityIndicator} /> : null}
        </View>
      ) : (
        <Image
          style={{ height: 180, width: 165, borderRadius: 10 }}
          source={{ uri: filteredItem.data.url }}
          resizeMode="cover"
        />
      )}
    </View>

  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'black',
    height: 180,
    width: 165,
    borderRadius: 10,
    marginBottom: 10,
  }, videoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicator: {
    position: 'absolute',
  },
})

export default GalleryCard;