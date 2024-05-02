import React, {useEffect, useRef, useState} from 'react';
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
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Thumbnail} from 'react-native-thumbnail-video';
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
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import LottieView from 'lottie-react-native';
import Video from 'react-native-video';
import {ImageBackground} from 'react-native';
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
  const [isLoading, setIsLoading] = useState(false);
  const handleLoadStart = () => {
    setIndicator(true);
  };
  const [currentDatePost, setCurrentDatePost] = useState([]);
  const [upcomingDatePosts, setUpcomingDatePosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const isVideo = useSelector(state => state.isVideo.isVideo);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;

  // const handleImagePress = image => {
  //   setSelectedImage(image);
  //   navigation.navigate('Preview', {
  //     selectedImage: image,
  //     filteredData: filteredData,
  //   });
  //   // setIsLoading(false)
  // };
  const handleImagePress = (image, catId, catName, postdata) => {
    console.log(image);
    setSelectedImage(image);
    navigation.navigate('CategoryAllPost', {
      selectedImage: image,
      filteredData: filteredData,
      catId: catId,
      catName: catName,
      postdata: postdata,
    });
    // setIsLoading(false)
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

        setUserData({userData: updatedData});
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const filterDatabyUserType = ctgitem => {
    // Define the conditions based on userType
    let filteredImages = [];
    // if (userData?.userData?.userType === 'free') {
    //   // Show all images until today's date

    //   filteredImages = imgdata.filter(
    //     imageitem =>
    //       new Date(imageitem.data.date) <= currentDate &&
    //       imageitem.data.ctgIds.includes(ctgitem.id),
    //   );
    // } else if (userData?.userData?.userType === 'basic') {
    //   const endDateBasic = new Date(currentDate);
    //   endDateBasic.setDate(currentDate.getDate() + 3);

    //   filteredImages = imgdata.filter(
    //     imageitem =>
    //       new Date(imageitem.data.date) <= endDateBasic &&
    //       imageitem.data.ctgIds.includes(ctgitem.id),
    //   );
    // } else if (userData?.userData?.userType === 'premium') {
    //   // Show all images

    //   filteredImages = imgdata.filter(imageitem =>
    //     imageitem.data.ctgIds.includes(ctgitem.id),
    //   );
    // }

    filteredImages = imgdata.filter(imageitem =>
      imageitem.data.ctgIds.includes(ctgitem.id),
    );
    // const formattedDate = `${year}-${month}-${day}`;
    // const filterbypreviousdate = filteredImages.filter(post => {
    //   const postDate = post?.data?.date;

    //   return formattedDate > postDate;
    // });
    return filteredImages;
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (imgdata) {
      const filteredPosts = imgdata.filter(post => {
        const postDate = post?.data?.date;

        if (formattedDate === postDate) {
          return true;
        }

        return false;
      });

      const upcomingPosts = imgdata.filter(post => {
        const postDate = post.data.date;
        return postDate > formattedDate;
      });
      setUpcomingDatePosts(upcomingPosts);
      setCurrentDatePost(filteredPosts);
    }
  }, [imgdata]);

  return (
    <ImageBackground style={styles.backgroundImage}>
      <ScrollView style={styles.scrollView}>
        {/* <View style={{flexDirection:"row"}}>
        <TouchableOpacity style={{backgroundColor:"#fff",width:WINDOW_WIDTH/2.5,marginRight:20,left:10,borderRadius:5}}>
         <Text style={{fontSize:16,color:"#000",textAlign:"center"}}>Business</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{backgroundColor:"#fff",width:WINDOW_WIDTH/2.5,left:10,borderRadius:5}}>
          <Text style={{fontSize:16,color:"#000",textAlign:"center"}}>Political</Text>
          </TouchableOpacity>
      </View> */}

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
              color: '#fff',
              textAlign: 'center',
              fontSize: 26,
              margin: 30,
              fontWeight: 700,
            }}>
            Coming Soon
          </Text>
        )}

        <View>
          {!isVideo && currentDatePost.length > 0 && (
            <View style={styles.category_name}>
              <Text style={styles.category_text}>Today Post</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('TodayPostView', {
                    title: 'Today Post',
                    isVideo: isVideo,
                    currentDatePost: currentDatePost,
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
                currentDatePost.length > 0 &&
                // imgdata
                // .filter(
                //   imageitem =>
                //     !/^(mp4|mov|avi|mkv)$/i.test(imageitem.data?.url) &&
                //     imageitem.data.ctgIds.includes(ctgitem.id),
                // )
                currentDatePost.map((filteredItem, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      handleImagePress(
                        filteredItem,
                        '1',
                        'Today Post',
                        currentDatePost,
                      )
                    }>
                    <Image
                      style={{height: 90, width: 90, borderRadius: 100}}
                      source={{uri: filteredItem?.data.url}}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
        </View>

        <View>
          {!isVideo && upcomingDatePosts.length > 0 && (
            <View style={styles.category_name}>
              <Text style={styles.category_text}>Upcoming Post</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('UpcomingPostView', {
                    title: 'Upcoming Posts',
                    isVideo: isVideo,
                    upcomingDatePosts: upcomingDatePosts,
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
                upcomingDatePosts.length > 0 &&
                // imgdata
                // .filter(
                //   imageitem =>
                //     !/^(mp4|mov|avi|mkv)$/i.test(imageitem.data?.url) &&
                //     imageitem.data.ctgIds.includes(ctgitem.id),
                // )
                upcomingDatePosts.slice(0, 5).map((filteredItem, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      handleImagePress(
                        filteredItem,
                        '2',
                        'Upcoming Post',
                        upcomingDatePosts,
                      )
                    }>
                    <Image
                      style={{height: 90, width: 90, borderRadius: 10}}
                      source={{uri: filteredItem?.data.url}}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
        </View>
        {/* {isVideo && (
        <ScrollView>
          <View style={{flex: 1, backgroundColor: 'red'}}>
            <Text>comin soon</Text>
          </View>
        </ScrollView>
      )} */}
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
                      videotitle: ctgitem.data?.videoctgName,
                      videoData: videoData,
                      isVideo: isVideo,
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
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('FullScreen', {
                                    uri: filteredItem.data.url,
                                  })
                                }>
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
                                  <AntDesign name="play" size={20} />
                                </View>
                              </TouchableOpacity>
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
                <Text style={styles.category_text}>
                  {ctgitem.data?.ctgName}
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
                    .slice(0, 5)
                    .map((filteredItem, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() =>
                          handleImagePress(
                            filteredItem,
                            ctgitem.id,
                            ctgitem.data?.ctgName,
                            filterDatabyUserType(ctgitem),
                          )
                        }>
                        <Image
                          style={{height: 90, width: 90, borderRadius: 10}}
                          source={{uri: filteredItem?.data.url}}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    ))}
              </View>
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  category_name: {
    padding: 6,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category_text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  imageitems: {
    flexDirection: 'row',
    gap: 8,
    padding: 2,
  },
  viewAll_text: {
    color: '#000',
    fontWeight: '500',
    fontSize: 12,
  },
  video: {
    flex: 1,
    width: 88,
    height: 90,
    borderRadius: 20,
  },
});
export default CategoriesList;
