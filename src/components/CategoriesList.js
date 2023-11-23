import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';

function CategoriesList({
  ctgData,
  filteredData,
  navigation,
  videoData,
  videocategories,
  route,
}) {
  const imgdata = useSelector(state => state.reducer);
  const [indicator, setIndicator] = useState(false);
  const handleLoadStart = () => {
    setIndicator(true);
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const isVideo = useSelector(state => state.isVideo.isVideo);
  // console.warn("img_______data",imgdata);
  const handleImagePress = image => {
    setSelectedImage(image);
    navigation.navigate('Preview', {
      selectedImage: image,
      filteredData: filteredData,
    });
  };

  return (
    <ScrollView style={{backgroundColor: 'black'}}>
      {ctgData?.length === 0 && (
        <Text
          style={{
            color: '#000',
            textAlign: 'center',
            fontSize: 16,
            margin: 30,
          }}>
          Data Not Found
        </Text>
      )}
      {isVideo && videoData?.length === 0 && (
        <Text
          style={{
            color: '#000',
            textAlign: 'center',
            fontSize: 16,
            margin: 30,
          }}>
          Data Not Found
        </Text>
      )}

      {isVideo &&
        videoData &&
        videocategories?.map((ctgitem, index) => (
          <View key={index}>
            <View style={styles.category_name}>
              <Text style={styles.category_text}>
                {ctgitem.data?.videoctgName}
              </Text>
            </View>

            <ScrollView horizontal={true}>
              <View style={styles.imageitems}>
                {isVideo && videoData
                  ? videoData
                      .filter(
                        imageitem =>
                          imageitem.data &&
                          /\.(mp4|mov|avi|mkv)$/i.test(imageitem.data?.url) &&
                          imageitem.data.ctgIds.includes(ctgitem.id),
                      )
                      .map((filteredItem, index) => (
                        <View
                          key={index}
                          style={{height: 160, width: 145, borderRadius: 10}}>
                          <View style={styles.videoContainer}>
                            {/* {indicator ? (
                              <ActivityIndicator
                                size="small"
                                color="black"
                                style={styles.activityIndicator}
                              />
                            ) : null} */}
                            <View
                              style={{
                                height: 160,
                                width: 145,
                                borderRadius: 20,
                                backgroundColor: 'black',
                                justifyContent: 'center',
                              }}>
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('FullScreen', {
                                    uri: filteredItem.data.url,
                                  })
                                }>
                                <Image
                                  source={require('../assets/img/play.png')}
                                  resizeMode="contain"
                                  style={{
                                    width: 30,
                                    height: 30,
                                    alignSelf: 'center',
                                  }}
                                />
                              </TouchableOpacity>
                            </View>

                            {/* <VideoPlayer
                              style={{
                                height: 160,
                                width: 145,
                                borderRadius: 10,
                              }}
                              video={{uri: filteredItem.data.url}}
                              autoPlay={true}
                              controlsTimeout={1000}
                              repeat={true}
                              onLoadStart={handleLoadStart}
                              seekBarFullWidth={true}
                              defaultMuted={true}
                              onLoad={() => setIndicator(false)}
                            
                            /> */}
                          </View>
                        </View>
                      ))
                  : ''}
              </View>
            </ScrollView>
          </View>
        ))}

      {ctgData?.map((ctgitem, index) => (
        <View key={index}>
          {!isVideo && (
            <View style={styles.category_name}>
              <Text style={styles.category_text}>{ctgitem.data?.ctgName}</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ViewAllPost', {catId: ctgitem.id})
                }
                style={{
                  backgroundColor: 'white',
                  padding: 5,
                  borderRadius: 5,
                }}>
                <Text style={styles.viewAll_text}>View All</Text>
              </TouchableOpacity>
            </View>
          )}
          <ScrollView horizontal={true}>
            <View style={styles.imageitems}>
              {!isVideo &&
                imgdata
                  .filter(
                    imageitem =>
                      !/^(mp4|mov|avi|mkv)$/i.test(imageitem.data?.url) &&
                      imageitem.data.ctgIds.includes(ctgitem.id),
                  )
                  .map((filteredItem, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleImagePress(filteredItem)}>
                      <Image
                        style={{height: 90, width: 90, borderRadius: 10}}
                        source={{uri: filteredItem.data.url}}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  ))}
            </View>
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  category_name: {
    padding: 6,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category_text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  imageitems: {
    flexDirection: 'row',
    gap: 10,
    padding: 6,
  },
  viewAll_text: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
});
export default CategoriesList;
