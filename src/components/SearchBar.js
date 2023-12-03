import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {SCREEN_WIDTH} from '../utils/dimensions';
import {useSelector} from 'react-redux';
import GalleryCard from './GalleryCard';
function SearchBar({navigation}) {
  const imgdata = useSelector(state => state.reducer);
  const [searchText, setSearchText] = useState('');
  const [filteredImages, setFilteredImages] = useState(imgdata);
  const [selectedImage, setSelectedImage] = useState(null);
  const isVideo = useSelector(state => state.isVideo.isVideo);
  const ImageCategory = useSelector(state => state.ImageCategory);
  const VideoCategory = useSelector(state => state.VideoCategory);
  const VideoData = useSelector(state => state.VideoData);

  const handleImagePress = image => {
    setSelectedImage(image);
    navigation.navigate('Preview', {
      selectedImage: image,
      filteredImages: filteredImages,
    });
  };

  const [categoryId, setCategoryId] = useState('');
  const [VideoCategoryId, setVideoCategoryId] = useState('');
  const [filteredVideos, setFilteredVideos] = useState(VideoData);
  console.log(searchText);
  const handleSearch = text => {
    setSearchText(text);

    if (isVideo) {
      const filteredVideos = VideoData.filter(
        image =>
          (videoctgName = VideoCategory.map(category => {
            if (
              category.data.videoctgName
                .toLowerCase()
                .includes(text.toLowerCase())
            ) {
              setVideoCategoryId(category.id);
              if (categoryId === image.data.ctgIds) {
              }
            }
          })),
        setFilteredVideos(filteredVideos),
      );
    } else {
      const filteredImages = imgdata.filter(
        image =>
          (ctgname = ImageCategory.map(category => {
            if (
              category.data.ctgName.toLowerCase().includes(text.toLowerCase())
            ) {
              setCategoryId(category.id);
              if (categoryId === image.data.ctgIds) {
              }
            }
          })),
      );
      setFilteredImages(filteredImages);
    }
  };

  const finalfilterdata = filteredImages.filter(
    v => categoryId === v.data.ctgIds,
  );

  const finalfilterVideodata = VideoData.filter(
    v => VideoCategoryId === v.data.ctgIds,
  );

  const imageWidth = (SCREEN_WIDTH - 30) / 3;

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      <View style={{padding: 6}}>
        <TextInput
          autoFocus
          placeholder="Search for images..."
          placeholderTextColor={'#fff'}
          onChangeText={handleSearch}
          style={{
            color: '#fff',
            padding: 16,
            fontSize: 16,
            borderRadius: 5,
            backgroundColor: '#000',
            borderWidth: 1,
            borderColor: '#fff',
          }}
        />
      </View>
      <View style={{flex: 7, padding: 8}}>
        <View style={styles.gallery}>
          {filteredImages === null || filteredImages.length === 0 ? (
            <View style={{flex: 1, justifyContent: 'center', height: 500}}>
              <ActivityIndicator size="small" color="black" />
            </View>
          ) : (
            <FlatList
              data={isVideo ? finalfilterVideodata : finalfilterdata}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              renderItem={({item, index}) => (
                <View style={{margin: 5, width: imageWidth}}>
                  {isVideo ? (
                    <View
                      style={{
                        height: 90,
                        width: 90,
                        borderRadius: 20,
                        backgroundColor: 'black',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: '#fff',
                      }}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('FullScreen', {
                            uri: item.data.url,
                          })
                        }>
                        <AntDesign name="play" size={20} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity onPress={() => handleImagePress(item)}>
                      <Image
                        style={{
                          height: imageWidth,
                          borderRadius: 5,
                        }}
                        source={{uri: item.data.url}}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  )}
                  {isVideo ? (
                    <Text>.</Text>
                  ) : (
                    <View>
                      <Text
                        style={{
                          position: 'absolute',
                          textAlign: 'center',
                          marginTop: 5,
                          backgroundColor: '#000',
                          fontSize: 11,
                          padding: 5,
                          borderRadius: 5,
                          left: 6,
                          bottom: 4,
                        }}>
                        {item.data.date}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});

export default SearchBar;
