import {collection, getDocs} from '@firebase/firestore';
import React, {useEffect, useState} from 'react';
import {Alert, Image, StyleSheet, View} from 'react-native';
import {firestore} from '../firebase/firebase';
import {TouchableOpacity} from 'react-native-gesture-handler';

function Banner({banner}) {
  return (
    <View style={styles.BannerContainer}>
      <View style={styles.BannerContent}>
        <>
          <TouchableOpacity>
            <Image
              style={{
                height: 185,
                width: '100%',
                borderRadius: 10,
                position: 'absolute',
              }}
              source={{uri: banner[1]?.data.url}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  BannerContainer: {
    height: 220,
    backgroundColor: '#111111',
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 5,
    paddingRight: 5,
  },
  BannerContent: {
    flex: 1,
    backgroundColor: 'black',
    borderRadius: 10,
  },
});
export default Banner;
