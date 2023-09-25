import React, { useRef, useState } from 'react';
import Feather from "react-native-vector-icons/Feather";
import { ScrollView, View, StyleSheet, SafeAreaView, Text, Image, Button, TouchableOpacity, PermissionsAndroid, Platform, ActivityIndicator } from "react-native";
import GalleryCard from '../components/GalleryCard';
import { request, PERMISSIONS } from 'react-native-permissions';
import VideoPlayer from "react-native-video-player";
import RNFetchBlob from 'rn-fetch-blob';
import PhotoEditor from 'react-native-photo-editor';
function PreviewScreen({ navigation, route }) {
  const [selectedImage_p, setSelectedImage_p] = useState(null);
  const scrollViewRef = useRef(null);
  const handleImagePress = (image) => {
    setSelectedImage_p(image);
    navigation.navigate('Preview', { selectedImage: image, filteredData: filteredData });
    scrollToTop();
  };


  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const { selectedImage, filteredData } = route.params;



  const REMOTE_IMAGE_PATH = selectedImage?.data.url;
  const checkPermission = async () => {

    if (Platform.OS === 'ios') {
      openImageEditor();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'App needs access to your storage to download Photos',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Once user grant the permission start downloading
          console.log('Storage Permission Granted.');


          openImageEditor();
        } else {
          // If permission denied then show alert
          alert('Storage Permission Not Granted');
        }
      } catch (err) {

        console.warn(err);
        alert('Error requesting storage permission: ' + err.message);
      }
    }
  };
  // openImageEditor
  const openImageEditor = () => {
    const image_URL = REMOTE_IMAGE_PATH; // The image you want to edit
    PhotoEditor.Edit({
      
      path: image_URL, // Original image path
      hiddenControls:['save'],
      onDone: editedImage => {
        // Handle the edited image (save it locally or upload it)
        saveEditedImageLocally(editedImage);
      },
      onCancel: () => {
        // Handle editing cancellation
      },
    });
    console.warn(image_URL);
  };
  const saveEditedImageLocally = editedImage => {
    let date = new Date();
    let ext = getExtention(editedImage); // Assuming getExtention can handle the edited image
    ext = '.' + ext[0];
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/edited_image_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Nupost_Images',
      },
    };
    config(options)
      .fetch('GET', editedImage)
      .then(res => {
        // Showing alert after successful downloading
        alert('Edited Image Downloaded Successfully.');
      })
      .catch(err => {
        console.error('Error creating directory:', err);
      });
  };

  const getExtention = filename => {
    // To get the file extension
    return filename.split('.').pop();
  };

  const url = selectedImage?.data.url;
  const isVideo = url && /\.(mp4|mov|avi|mkv)$/i.test(url);
  const [indicator, setIndicator] = useState(false);
  const handleLoadStart = () => {
    setIndicator(true);
  };
  const handleBuffering = (isBuffering) => {
    if (isBuffering) {

      console.warn('Video is buffering...');
    } else {

      console.warn('Buffering is complete.');
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} ref={scrollViewRef}>
        <View style={styles.top_container}>
          {isVideo ? (
            <View style={styles.videoContainer}>
              <VideoPlayer
                video={{ uri: url }}
                style={styles.video}
                resizeMode="cover"
                controls={false}
                repeat={true}
                disableControlsAutoHide={true}
                pauseOnPress={true}
                onLoadStart={handleLoadStart}
                onBuffer={handleBuffering}
                onLoad={() => setIndicator(false)}
              />
              {indicator ? <ActivityIndicator size='small' color='black' style={styles.activityIndicator} /> : null}
            </View>

          ) : (
            <Image
              style={styles.preview_image}
              source={{ uri: url }}
              resizeMode="contain"
            />
          )}

          <View style={styles.btns_wrapper}>
            <TouchableOpacity onPress={checkPermission} style={styles.btns}>
              <Text style={styles.btns_text}>Download</Text>
              <Feather name="download" style={{ color: 'white' }} size={20} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bottom_container}>

          <View style={styles.bottom_heading}>
            <Text style={styles.containers_heading}>Related Photo</Text>
          </View>
          <View style={styles.gallery}>
            {
              filteredData.filter((item) => item?.data.url !== selectedImage?.data.url) // Remove the selected image from related images
                .map((item, index) => (
                  <TouchableOpacity key={index} onPress={() => handleImagePress(item)}>
                    <GalleryCard item={item} navigation={navigation} />
                  </TouchableOpacity>
                ))
            }
          </View>


        </View>
      </ScrollView>
    </SafeAreaView>
  );
}




const styles = StyleSheet.create({
  top_container: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  bottom_container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 12
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    justifyContent: 'space-between',
    marginTop: 20,
  },
  preview_image: {
    height: 380,
    width: 320,
    borderRadius: 10,
    marginTop: 20
  },
  btns_wrapper: {
    flexDirection: 'row',
    padding: 20,
    gap: 30
  },
  btns: {
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10
  },
  btns_text: {
    fontSize: 16,
    color: 'white'
  },
  containers_heading: {
    color: 'black',
    fontSize: 18,
    fontWeight: '700'
  },
  video: {
    height: 380,
    width: 320,
    borderRadius: 20
  },
   videoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
   activityIndicator: {
    position: 'absolute',
  },
});


export default PreviewScreen;