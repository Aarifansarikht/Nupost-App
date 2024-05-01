import React, {useLayoutEffect, useRef} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native';
import ViewShot from 'react-native-view-shot';
import PostList from '../components/PostList';
import Feather from 'react-native-vector-icons/Feather';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {useSelector} from 'react-redux';

const POSTER_WIDTH = SCREEN_WIDTH - 20;
const POSTER_RATIO = 1 / 1;
const POSTER_HEIGHT = POSTER_WIDTH / POSTER_RATIO;
function CategoryAllPostScreen({navigation, route}) {
  const viewShotRef = useRef(null);
  const {selectedImage, filteredData, catId, catName, postdata} = route.params;

  const REMOTE_IMAGE_PATH = selectedImage?.data?.url;
  useLayoutEffect(() => {
    navigation.setOptions({
      title: catName || 'View All',
      title: catName || videotitle || 'View All',
    });
  }, [catName, navigation]);
  const imgdata = useSelector(state => state.reducer);

  const handleNext = image => {
    navigation.navigate('Preview', {
      selectedImage: image,
      filteredData: filteredData,
    });
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.top_container}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            marginBottom: 4,
          }}>
          <ViewShot
            ref={viewShotRef}
            options={{format: 'jpg', quality: 0.9}}
            style={styles.preview_image}>
            {/* Background Image */}
            <Image
              source={{uri: REMOTE_IMAGE_PATH}}
              style={styles.overlayImage}
            />
          </ViewShot>
        </View>
        <View style={styles.btns_wrapper}>
          <TouchableOpacity
            onPress={() => handleNext(selectedImage)}
            style={styles.btns}>
            <Text style={styles.btns_text}>Next</Text>
          </TouchableOpacity>
        </View>
        <PostList
          selectedImage={selectedImage}
          image={REMOTE_IMAGE_PATH}
          imgdata={postdata}
          catName={catName}
          navigation={navigation}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  top_container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#333',
    // alignItems:'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  btns_wrapper: {
    flexDirection: 'row',
    padding: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  btns: {
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
    zIndex: 2,
  },
  btns_text: {
    fontSize: 16,
    color: 'white',
  },
  overlayImage: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    resizeMode: 'cover',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    justifyContent: 'flex-end',
  },
});
export default CategoryAllPostScreen;
