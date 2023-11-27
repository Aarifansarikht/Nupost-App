import React, {useEffect, useLayoutEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  Modal,
} from 'react-native';
import {useSelector} from 'react-redux';
import {getUserData} from '../redux/action/imageData';

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from '@firebase/firestore';
import {firestore} from '../firebase/firebase';

import {SCREEN_WIDTH, SCREEN_HEIGHT} from '../utils/dimensions';

const ViewallPost = ({navigation, route}) => {
  const {catId, title} = route.params;
  const imgdata = useSelector(state => state.reducer);
  const [userData, setUserData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [images,setImages] = useState();


  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const formatSelectedDate = date => {
    return date.toISOString().split('T')[0]; // Format the date to "YYYY-MM-DD"
  };

  const handleDateChange = (event, date) => {
    if (date !== undefined) {
      setSelectedDate(date);
      hideDatePicker();
    } else {
      hideDatePicker();
    }
  };

  const handleImagePress = image => {
    navigation.navigate('Preview', {
      selectedImage: image,
      // filteredData: filteredData,
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

  useEffect(() => {
    getUserData();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title || 'View All', // Set a default title if necessary
    });
  }, [title, navigation]);


  const filterByDate = (images, catId, filterDate) => {
    return images.filter(
      imageitem =>
        new Date(imageitem.data.date) <= filterDate &&
        imageitem.data.ctgIds.includes(catId)
    );
  };
  


  const filterDatabyDate = (catId,selectedDate) => {
    const currentDate = new Date();
    console.log(selectedDate, 'date');
    // Define the conditions based on userType
    let filteredImages = [];
    if (userData?.userData?.userType === 'free') {
      // Show all images until today's date
      console.log('userType is free');
      filteredImages = imgdata.filter(
        imageitem =>
          new Date(imageitem.data.date) <= currentDate &&
          imageitem.data.ctgIds.includes(catId),
      );
         filteredImages =  selectedDate ? filterByDate(filteredImages,catId,selectedDate) : filteredImages
    } else if (userData?.userData?.userType === 'basic') {
      const endDateBasic = new Date(currentDate);
      endDateBasic.setDate(currentDate.getDate() + 3);
      console.log(endDateBasic, 'date of basic');
      filteredImages = imgdata.filter(
        imageitem =>
          new Date(imageitem.data.date) <= endDateBasic &&
          imageitem.data.ctgIds.includes(catId),
      );
      filteredImages =  selectedDate ? filterByDate(filteredImages,catId,selectedDate) : filteredImages
    } else if (userData?.userData?.userType === 'premium') {
      // Show all images
      console.log(userData?.userData?.userType, 'userType');
      filteredImages = imgdata.filter(imageitem =>
        imageitem.data.ctgIds.includes(catId),
      );
      filteredImages =  selectedDate ? filterByDate(filteredImages,catId,selectedDate) : filteredImages
    }
   
  return filteredImages;
  };

  const imageWidth = (SCREEN_WIDTH - 30) / 3;
  return (
    <View style={{backgroundColor: '#111', flex: 1}}>
      <View style={{padding: 10, alignItems: 'center'}}>
        <View
          style={{
            backgroundColor: '#fff',
            width: '100%',
            alignItems: 'center',
            borderRadius: 50,
            padding: 5,
          }}>
          <TouchableOpacity onPress={showDatePicker}>
            <Text style={{color: '#000', padding: 10, fontSize: 16}}>
              {selectedDate ? selectedDate.toDateString() : 'Choose date'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {isDatePickerVisible && (
        <Modal transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
              <TouchableOpacity
                onPress={hideDatePicker}
                style={styles.closeButton}>
                <Text style={{color: 'blue'}}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <FlatList
        data={filterDatabyDate(catId, selectedDate)}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => (
          <TouchableOpacity onPress={() => handleImagePress(item)}>
            <View style={{margin: 5, width: imageWidth}}>
              <Image
                style={{
                  height: imageWidth, // Maintain a square aspect ratio
                  borderRadius: 5,
                }}
                source={{uri: item.data.url}}
                resizeMode="cover"
              />
              <Text
                style={{
                  position: 'absolute',
                  textAlign: 'center',
                  marginTop: 5,
                  backgroundColor: '#000',
                  fontSize: 11,
                  padding: 5,
                  borderRadius: 5,
                  left: 10,
                  bottom: 14,
                }}>
                {item.data.date}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      {/* </View> */}

      {/* <ScrollView >
            <View style={styles.imageitems}>
              {
              
                imgdata
                  .filter(
                    imageitem =>
                      imageitem.data.ctgIds.includes(catId),
                  )

                  .map((filteredItem, index) => 
                  (
                    <TouchableOpacity
                      key={index}s
                      onPress={() => handleImagePress(filteredItem)}>
                      <Image
                        style={{height: 160, width: 145, borderRadius: 10}}
                        source={{uri: filteredItem.data.url}}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  )
                  )}
            </View>
          </ScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  category_name: {
    padding: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category_text: {
    color: 'black',
    fontSize: 18,
    fontWeight: '700',
  },
  imageitems: {
    gap: 10,
    padding: 6,
  },
  viewAll_text: {
    paddingLeft: 5,
    color: '#000',
    textDecorationLine: 'underline',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
  },
  closeButton: {
    marginTop: 10,
    alignItems: 'center',
  },
});

export default ViewallPost;
