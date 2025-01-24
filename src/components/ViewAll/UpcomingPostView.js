import React, {useEffect, useLayoutEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
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

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from '@firebase/firestore';
import {firestore} from '../firebase/firebase';
import {SCREEN_WIDTH, SCREEN_HEIGHT} from '../../utils/dimensions';
import DatePicker from '../DatePicker';

function UpcomingPostView({navigation, route}) {
  const {title, isVideo, upcomingDatePosts, catId} = route.params;
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: title || 'View All', // Set a default title if necessary
      title: title || videotitle || 'View All', // Set a default title if necessary
    });
  }, [title, navigation]);

  const imageWidth = (SCREEN_WIDTH - 30) / 3;

  const handleImagePress = image => {
    navigation.navigate('Preview', {
      selectedImage: image,
      // filteredData: filteredData,
    });
  };
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDateChange = (event, date) => {
    if (date !== undefined) {
      setSelectedDate(date);
      hideDatePicker();
    } else {
      hideDatePicker();
    }
  };
  const filterByDate = (images, catId, filterDate) => {
    return images.filter(
      imageitem =>
        new Date(imageitem.data.date).getDate() ==
        new Date(filterDate).getDate(),
    );
  };
  const filterDatabyDate = (catId, selectedDate) => {
    console.log(selectedDate, 'date');

    let filteredImages = [];
    let filteredVideo = [];

    filteredImages = upcomingDatePosts;
    filteredImages = selectedDate
      ? filterByDate(filteredImages, catId, selectedDate)
      : filteredImages;
    if (isVideo) {
      filteredVideo = videoData?.filter(videoitem =>
        videoitem.data.ctgIds.includes(catId),
      );
    }

    return isVideo ? filteredVideo : filteredImages;
  };
  return (
    <View style={{backgroundColor: '#111', flex: 1}}>
      <DatePicker selectedDate={selectedDate} showDatePicker={showDatePicker} />

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
      {false ? (
        <Loading />
      ) : (
        <FlatList
          data={filterDatabyDate(catId, selectedDate)}
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
        />
      )}
    </View>
  );
}
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

export default UpcomingPostView;
