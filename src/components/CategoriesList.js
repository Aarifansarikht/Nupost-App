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
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from '@firebase/firestore';
import {firestore} from '../firebase/firebase';

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
  const [userData, setUserData] = useState(null);

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

  const getUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        const parsedData = JSON.parse(data);
        const email = parsedData?.userData?.email;
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        const userDoc = querySnapshot.docs[0];
        const updatedData = userDoc?.data();
        // console.log({userData:updatedData},"userData from firebase")
        setUserData({userData: updatedData});
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  // console.log(userData,"userData")
  // Get the current date

  const filterDatabyUserType = ctgitem => {
    const currentDate = new Date();

    console.log(currentDate, 'date');
    // Define the conditions based on userType
    let filteredImages = [];
    if (userData?.userData?.userType === 'free') {
      // Show all images until today's date
      console.log('userType is free');
      filteredImages = imgdata.filter(
        imageitem =>
          new Date(imageitem.data.date) <= currentDate &&
          imageitem.data.ctgIds.includes(ctgitem.id),
      );
    } else if (userData?.userData?.userType === 'basic') {
      const endDateBasic = new Date(currentDate);
      endDateBasic.setDate(currentDate.getDate() + 3);
      console.log(endDateBasic, 'date of basic');

      filteredImages = imgdata.filter(
        imageitem =>
          new Date(imageitem.data.date) <= endDateBasic &&
          imageitem.data.ctgIds.includes(ctgitem.id),
      );
    } else if (userData?.userData?.userType === 'premium') {
      // Show all images
      console.log(userData?.userData?.userType, 'userType');
      filteredImages = imgdata.filter(imageitem =>
        imageitem.data.ctgIds.includes(ctgitem.id),
      );
    }
    console.log(filteredImages, 'filteredImages');
  
    return filteredImages;
  };




  useEffect(() => {
    getUserData();
  }, []);

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
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ViewAllPost', {
                    catId: ctgitem.id,
                    title: ctgitem.data?.ctgName,
                  })
                }
                style={{
                  backgroundColor: 'white',
                  padding: 5,
                  borderRadius: 5,
                }}>
                <Text style={styles.viewAll_text}>View All</Text>
              </TouchableOpacity>
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
                          style={{height: 90, width: 90, borderRadius: 10}}>
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
                                height: 90,
                                width: 90,
                                borderRadius: 20,
                                backgroundColor: 'black',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: '#fff',
                              }}>
                                {/* {filteredItem.data.url && } */}
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('FullScreen', {
                                    uri: filteredItem.data.url,
                                  })
                                }>
                                <AntDesign name="play" size={20} />
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
                  navigation.navigate('ViewAllPost', {
                    catId: ctgitem.id,
                    title: ctgitem.data?.ctgName,
                  })
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
                // imgdata
                  // .filter(
                  //   imageitem =>
                  //     !/^(mp4|mov|avi|mkv)$/i.test(imageitem.data?.url) &&
                  //     imageitem.data.ctgIds.includes(ctgitem.id),
                  // )
                filterDatabyUserType(ctgitem)
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
    fontSize: 16,
    fontWeight: '700',
  },
  imageitems: {
    flexDirection: 'row',
    gap: 10,
    padding: 6,
  },
  viewAll_text: {
    color: '#000',
    fontWeight: '500',
    fontSize: 12,
  },
});
export default CategoriesList;
