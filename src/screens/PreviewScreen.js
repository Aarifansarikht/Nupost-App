import React, { useEffect, useRef, useState } from 'react';
import Feather from "react-native-vector-icons/Feather";
import { ScrollView, View, StyleSheet, SafeAreaView, Text, Image, Modal, Button, Pressable, TouchableOpacity, PermissionsAndroid, Platform, ActivityIndicator } from "react-native";
import GalleryCard from '../components/GalleryCard';
import VideoPlayer from "react-native-video-player";
import RNFetchBlob from 'rn-fetch-blob';
import PhotoEditor from "react-native-photo-editor";
import RNFS from 'react-native-fs'

import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource'
import CategoriesList from '../components/CategoriesList';
function PreviewScreen({ navigation, route }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage_p, setSelectedImage_p] = useState(null);
  const { selectedImage, filteredData } = route.params;
  const scrollViewRef = useRef(null);
  const REMOTE_IMAGE_PATH = selectedImage?.data.url
  const LOCAL_IMAGE_PATH = `${RNFS.DocumentDirectoryPath}/photo.jpg`;

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

  const checkPermission = async () => {
    if (Platform.OS === 'ios') {
      downloadImage(REMOTE_IMAGE_PATH);
    } else {
      try {

        if (Platform.Version <= 31) {

          const storagePermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission Required',
              message:
                'App needs access to your storage to download Photos',
            }
          );
          if (storagePermission === PermissionsAndroid.RESULTS.GRANTED) {
            // Once user grant the permission start downloading
            console.log('Storage Permission Granted.');
            setModalVisible(!modalVisible)
            downloadImage(REMOTE_IMAGE_PATH);
          } else {
            // If permission denied then show alert
            alert('Storage Permission Not Granted');
          }
        }
        else {
          const mediaImagesPermission = await PermissionsAndroid.request(
            'android.permission.READ_MEDIA_IMAGES',
            {
              title: 'Media Images Permission Required',
              message: 'App needs access to media images.',
            }
          );

          const mediaVideosPermission = await PermissionsAndroid.request(
            'android.permission.READ_MEDIA_VIDEO',
            {
              title: 'Media Videos Permission Required',
              message: 'App needs access to media videos.',
            }
          );

          const mediaAudioPermission = await PermissionsAndroid.request(
            'android.permission.READ_MEDIA_AUDIO',
            {
              title: 'Media Audio Permission Required',
              message: 'App needs access to media audio.',
            }
          );

          if (
            mediaImagesPermission === PermissionsAndroid.RESULTS.GRANTED &&
            mediaVideosPermission === PermissionsAndroid.RESULTS.GRANTED &&
            mediaAudioPermission === PermissionsAndroid.RESULTS.GRANTED
          ) {
            // Once all permissions are granted, start downloading
            console.log('All Permissions Granted.');
            setModalVisible(!modalVisible);
            downloadImage(REMOTE_IMAGE_PATH);
          } else {
            // If any permission is denied, show an alert
            alert('Permissions Not Granted');
          }
        }
      } catch (err) {

        console.warn(err);
        alert('Error requesting storage permission: ' + err.message);
      }
    }
  };




  const openPhotoEditor = (img) => {
    try {
      PhotoEditor.Edit({
        path: img,


      });
    } catch (error) {
      console.error('Error opening the photo editor:', error);
      Alert.alert('Error', 'Failed to open the photo editor.');
    }
  };





  const downloadImage = editedImage => {
    let date = new Date();
    let ext = getExtention(editedImage);
    ext = '.' + ext;

    // Define the path to the 'Nupost_Images' directory
    const { config, fs } = RNFetchBlob;
    const PictureDir = fs.dirs.PictureDir;
    const nupostImagesDir = PictureDir + '/Nupost_Images';

    // Check if the 'Nupost_Images' directory exists, and create it if not
    if (!fs.exists(nupostImagesDir)) {
      fs.mkdir(nupostImagesDir)
        .then(() => {
          // Directory is created, proceed with downloading the image
          const options = {
            fileCache: false,
            addAndroidDownloads: {
              useDownloadManager: true,
              notification: true,
              path:
                (nupostImagesDir +
                  '/' +
                  Math.floor(date.getTime() + date.getSeconds() / 2) +
                  ext).replace('?alt=media', ""),
              description: 'Nupost_Images',
            },
          };
          config(options)
            .fetch('GET', editedImage)
            .then(res => {
              // Showing alert after successful downloading       
              setModalVisible(false)
              openPhotoEditor(options.addAndroidDownloads.path);
            })
            .catch(err => {
              console.error('Error downloading image:', err);
            });
        })
        .catch(err => {
          console.error('Error creating directory:', err);
        });
    } else {
      // The 'Nupost_Images' directory already exists, proceed with downloading the image
      const options = {
        fileCache: false,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path:
            (nupostImagesDir +
              '/' +
              Math.floor(date.getTime() + date.getSeconds() / 2) +
              ext).replace('?alt=media', ""),
          description: 'Nupost_Images',
        },
      };
      config(options)
        .fetch('GET', editedImage)
        .then(res => {
          // Showing alert after successful downloading       
          setModalVisible(false)
          openPhotoEditor(options.addAndroidDownloads.path);
        })
        .catch(err => {
          console.error('Error downloading image:', err);
        });
    }
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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} ref={scrollViewRef}>
        <View style={styles.centeredView}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>

                <Text style={styles.modalText}>Downloading Starting...</Text>

                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>Ok</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
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

      </ScrollView>
    </SafeAreaView>
  );
}




const styles = StyleSheet.create({
  top_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',

  },

  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    justifyContent: 'space-between',
  },
  preview_image: {
    height: 380,
    width: 320,
    borderRadius: 10,
    marginBottom: 170
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
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: 'black',
  },
  buttonClose: {
    backgroundColor: 'black',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
});


export default PreviewScreen;