import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from "react-native-vector-icons/Feather";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  Modal,
  Pressable,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  Alert,
  LogBox,
} from "react-native";
import VideoPlayer from "react-native-video-player";
import RNFetchBlob from 'rn-fetch-blob';
 import PhotoEditor from "react-native-photo-editor";
import RNFS from 'react-native-fs'
import { uploadImage } from '../components/OverlayComponent';
import Frame_list from '../components/Frames';
import ViewShot from 'react-native-view-shot';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { Frames } from '../vectors/frames/Frames';

const POSTER_WIDTH = SCREEN_WIDTH - 60;
const POSTER_RATIO = 1 / 1;
const POSTER_HEIGHT = POSTER_WIDTH / POSTER_RATIO


function PreviewScreen({ navigation, route }) {
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage_p, setSelectedImage_p] = useState(null);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [isLoading,setIsLoading] = useState(false)
  const { selectedImage, filteredData } = route.params;
  const scrollViewRef = useRef(null);
  const REMOTE_IMAGE_PATH = selectedImage?.data.url
  const LOCAL_IMAGE_PATH = `${RNFS.DocumentDirectoryPath}/photo.jpg`;
  const viewShotRef = useRef(null);

  console.log("PreviewScreen userData",userData)
  // async function processImage() {
  //   console.log("RemoteUrl",REMOTE_IMAGE_PATH)
  //   try {
  //     const url = await editAndSaveImage(REMOTE_IMAGE_PATH);
  //     if (url) {
  //       //    const preview_url =   await uploadImage(url)
  //       console.log('Resulting image URL:', REMOTE_IMAGE_PATH);
  //       // downloadImage(preview_url)
  //       // PhotoEditor.Edit({
  //       //   path: preview_url
  //       // });

  //     }
  //   } catch (error) {
  //     console.log('Error in processImage:', error);
  //   }
  // }

  // processImage();


  const getUserData = async () => {
    const data = await AsyncStorage.getItem('userData');

    if (data) {
      const parsedData = JSON.parse(data);

      console.log("Parsed_____________user_data", parsedData)
      setUserData(parsedData);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  
  const captureImage = async () => {
    if (viewShotRef.current) {
      try {
        const uri = await viewShotRef.current.capture();
        console.log('Captured image URI:', uri);
        const EditdedUri = await uploadImage(uri)
        await downloadImage(EditdedUri)
        // You can now use this URI as needed, e.g., save it or share it.
      } catch (error) {
        console.error('Error capturing image:', error);
      }
    }
  };



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
    setIsLoading(true)
    if (Platform.OS === 'ios') {

      downloadImage(REMOTE_IMAGE_PATH);
      setIsLoading(false)
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
            captureImage();
            setIsLoading(false)
          } else {
            // If permission denied then show alert
            alert('Storage Permission Not Granted');
            setIsLoading(false)
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
            captureImage();
            setIsLoading(false)
          } else {
            // If any permission is denied, show an alert
            alert('Permissions Not Granted');
            setIsLoading(false)
          }
        }
      } catch (err) {

        console.log(err);
        alert('Error requesting storage permission: ' + err.message);
        setIsLoading(false)
      }
    }
  };


  const openPhotoEditor = (img) => {
    try {
      PhotoEditor.Edit({
        path: img,
        onDone: () => console.log("done")
      });

    } catch (error) {
      console.error('Error opening the photo editor:', error);
      Alert.alert('Error', 'Failed to open the photo editor.');
    }
  };

  const handleSelectImage = (uri) => {
    console.log("selected______frame_____uri", uri)
    setSelectedFrame(uri);
  };



  const downloadImage = editedImage => {
    console.log(editedImage, "check______")
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
          console.log('Error creating directory:', err);
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
          console.log('Error downloading image:', err);
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

      console.log('Video is buffering...');
    } else {

      console.log('Buffering is complete.');
    }
  };
  LogBox.ignoreAllLogs()


  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
      
          <View style={styles.modalView}>
        
              
        
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Ok</Text>
            </Pressable>
          </View>
        </View>
      </Modal> */}

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


          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                   
            <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }} style={styles.preview_image}>
              {/* Background Image */}
              <View style={styles.backgroundImage}>
                {Frames.filter((item) => item.id === selectedFrame)[0]?.image(POSTER_WIDTH + 1, POSTER_HEIGHT + 1, {
                  name: userData?.userData?.name,
                  email: userData?.userData.email,
                  designation:  userData?.userData.designation,
                  mobileNumber: `+91-${userData?.userData.mobileNumber}`,
                  whatsappNumber: `+91-${userData?.userData.WhatsappNumber}`,
                  politicalImgUrl: userData?.userData?.politicalImgUrl,
                  imageUrl: userData?.userData?.imageUrl,
                  FacebookUrl: userData?.userData.FacebookUrl,
                  InstaUrl: userData?.userData.InstaUrl,
                  TwitterUrl: userData?.userData.TwitterUrl
                    
                })}
              </View>
              <Image
                source={{ uri: REMOTE_IMAGE_PATH }}
                style={styles.overlayImage}
              />
              <Image
                source={{ uri: userData?.userData?.politicalImgUrl }}
                style={styles.logo}
              />

              <Image
                source={{ uri: userData?.userData?.imageUrl }}
                style={styles.profile_picture}
              />
              {/* Overlay Image and Text */}
              {/* <View style={styles.overlayContainer}>
                  <View style={{ position: "absolute", top: 0, zIndex: -1 }}>
                  
                    <Text style={styles.userName}>{userData?.userData?.name}</Text>
                  </View>
                </View> */}
              {/* <View style={{
                    position: 'absolute', bottom: 0, zIndex: 9, right: 0, left: 0,
                    flexDirection: 'row', alignItems: 'flex-start',
                    justifyContent: 'space-around'
                  }}>          
                  <View style={styles.textContainer}>
                    <Text style={styles.phoneText}>
                      {`+91-${userData?.userData.mobileNumber}`}
                    </Text>
                    <Text style={styles.phoneText1}>
                      {`+91-${userData?.userData.WhatsappNumber}`}
                    </Text>
                    </View>
                    <View style={{ paddingRight: 5,  }}>
                      <Text style={styles.nameText}>{userData?.userData.email}</Text>
                    </View>
                </View> */}
            </ViewShot>
          </View>

        )}
        <Frame_list selectedImage={selectedImage} onSelectImage={handleSelectImage} image={REMOTE_IMAGE_PATH} />
        <View style={styles.btns_wrapper}>
          <TouchableOpacity onPress={checkPermission} style={styles.btns}>
            <Text style={styles.btns_text}>Download</Text>
            <Feather name="download" style={{ color: 'white' }} size={20} />
          </TouchableOpacity>
        </View>
      </View>


    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  top_container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "#Fff",
    // alignItems:'center'

  },

  // preview_image: {
  //   height: 380,
  //   width: "100%",
  //   marginBottom: 170,
  //   position:"relative",


  // },
  btns_wrapper: {
    flexDirection: 'row',
    padding: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',

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
  preview_image: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    position: 'relative',

  },
  backgroundImage: {

    position: 'absolute',
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    zIndex: 9,
    top: 0,

  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    justifyContent: 'flex-end',
  },
  overlayImage: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    resizeMode: "cover",

  },
  textContainer: {
    padding: 10,
    paddingLeft: 0
  },
  nameText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'black',

  },
  phoneText: {
    fontSize: 10,
    color: 'black',

  },
  phoneText1: {
    fontSize: 10,
    color: 'black',
  },
  logo: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 40, // Adjust the size as needed
    height: 40,
    borderRadius: 50
  },
  profile_picture: {
    position: 'absolute',
  bottom: 20,
  right: 2,
  width: 70,
  height: 70,
  borderRadius: 5,
 
  },
  userName: {
    position: 'absolute',
    bottom: 46,
    left: 15,
    fontSize: 16,
    color: "#000"
  }

});


export default PreviewScreen;