import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import {firestore} from '../firebase/firebase';
import {collection, getDocs} from 'firebase/firestore';
import {Frames} from '../vectors/frames/Frames';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import Feather from 'react-native-vector-icons/Feather';
const FRAME_SIZE = SCREEN_WIDTH * 0.42;

function Frame_list({selectedFrame, onSelectImage, image, allowedFrames}) {
  const [framesData, SetFrameData] = useState([]);
  // const [selectedFrame, setSelectedFrame] = useState(null);
  const fetch_frames = async () => {
    try {
      const logo_name_Collection = collection(firestore, 'frameimages');
      const politicalPartylogo = await getDocs(logo_name_Collection);
      const data = politicalPartylogo.docs?.map(doc => doc.data());

      SetFrameData(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetch_frames();
  }, []);

  const handleCardPress = uri => {
    console.log(uri, 'here is uri______');
    onSelectImage(uri);
  };

  const isFrameAllowed = frameId => {
    return allowedFrames.some(item => item.id === frameId);
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{paddingBottom: 150}}
        numColumns={2}
        data={Frames}
        ItemSeparatorComponent={() => <View style={{margin: 10}} />}
        renderItem={({item, index}) => {
          const isAllowed = isFrameAllowed(item?.id);

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleCardPress(item?.id)}
              style={{
                marginRight: index % 2 === 0 ? 20 : 0,
                marginLeft: index % 2 === 0 ? 20 : 0,
              }}>
              <View style={styles.card}>
                <Image
                  source={{uri: image}}
                  style={{
                    width: FRAME_SIZE,
                    height: FRAME_SIZE,
                    position: 'absolute',
                  }}
                />
                {isAllowed ? (
                  item?.image(FRAME_SIZE, FRAME_SIZE)
                ) : (
                  <>
                    <Image
                      source={require('../assets/img/lock.png')}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1,
                        height: 20,
                        width: 20,
                      }}
                    />
                    {item?.image(FRAME_SIZE, FRAME_SIZE)}
                  </>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* <FlatList
        contentContainerStyle={{paddingBottom:150}}
        numColumns={2}
        data={Frames}
        ItemSeparatorComponent={() => <View style={{ margin: 10 }} />}
        renderItem={({ item, index }) => {
          return <TouchableOpacity activeOpacity={0.9} onPress={() => handleCardPress(item?.id)}
            style={{
              marginRight: index % 2 === 0 ? 20 : 0,
              marginLeft: index % 2 === 0 ? 20 : 0
            }}>
            <View style={styles.card}>
              <Image source={{ uri: image }} 
                style={{
                  width: FRAME_SIZE,
                  height: FRAME_SIZE,
                  position: 'absolute',                  
              }}
              />
              {item?.image(FRAME_SIZE, FRAME_SIZE)}
            </View>
          </TouchableOpacity>
        }}
      /> */}

      {/* <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {Frames.map((item,index) => (
            //
            <TouchableOpacity key={index} onPress={() => handleCardPress(item?.id)}>
            
            </TouchableOpacity>
          ))}
        </ScrollView> */}

      {/* {selectedImage && (
          <Text style={styles.selectedImageText}>
            Selected Image URI: {selectedImage}
          </Text>
        )} */}
    </View>
  );
}
const styles = StyleSheet.create({
  category_name: {
    padding: 6,
  },
  category_text: {
    color: 'black',
    fontSize: 18,
    fontWeight: '700',
  },
  imageitems: {
    flexDirection: 'row',
    gap: 10,
    padding: 6,
  },
  container: {
    flex: 1,
    // padding: 20,
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    elevation: 10,
    backgroundColor: '#FFF',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 5,
  },
  cardText: {
    marginTop: 10,
    textAlign: 'center',
  },
  selectedImageText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});
export default Frame_list;
