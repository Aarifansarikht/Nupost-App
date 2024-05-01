import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Frames} from '../vectors/frames/Frames';
import {SCREEN_WIDTH, SCREEN_HEIGHT} from '../utils/dimensions';

const FRAME_SIZE = SCREEN_WIDTH * 0.42;
const imageWidth = (SCREEN_WIDTH - 40) / 3;

function PostList({navigation, image, imgdata, catName}) {
  const handleCardPress = (image, catId, catName) => {
    console.log(image);

    navigation.navigate('CategoryAllPost', {
      selectedImage: image,
      filteredData: imgdata,
      catId: catId,
      catName: catName,
      postdata: imgdata,
    });
  };
  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{paddingBottom: 150}}
        numColumns={3}
        data={imgdata}
        renderItem={({item, index}) => {
          return (
            <View style={{margin: 5, width: imageWidth}}>
              <TouchableOpacity
                onPress={() =>
                  handleCardPress(item, item?.data.ctgIds, catName)
                }>
                <Image
                  source={{uri: item?.data?.url}}
                  style={{
                    height: imageWidth,
                    borderRadius: 5,
                  }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    elevation: 10,
    backgroundColor: '#FFF',
  },
});
export default PostList;
