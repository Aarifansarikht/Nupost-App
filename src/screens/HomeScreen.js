import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet ,Text ,ActivityIndicator,RefreshControl,ScrollView,View, Alert} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getImageData } from '../redux/action/imageData';
import CategoriesList from '../components/CategoriesList';
import Bottom from '../components/Bottom';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { forceTouchHandlerName } from 'react-native-gesture-handler/lib/typescript/handlers/ForceTouchGestureHandler';
import { get_user } from '../utils/user';
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    updateDoc,
  } from '@firebase/firestore';
import {firestore} from '../firebase/firebase';
// import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';

function HomeScreen({ navigation,route }) {
    
    const dispatch = useDispatch();
    const imgdata = useSelector((state) => state.reducer);
    const [imagesData, setImagesData] = useState([])
    const [filteredData, setFilteredData] = useState(null);
    const [ctgData, setCtgData] = useState(null);
    const [videoData, setvideoData] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [videocategories,setVideoCategories] = useState(null)
    const [isLoading , setIsLoading] = useState(false)
    const [userData, setUserData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    


    useEffect(() => {
        fetchCategories();
        fetchImages();
        fetchVideos()
        fetchVideoCategories()
        getUserData()
    }, [refreshing])

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        
        setTimeout(() => {
          setRefreshing(false);
        }, 1000);
      }, []);
    
    const fetchCategories = async () => {
        setIsLoading(true)
        try {
            const categoriesCollection = collection(firestore, 'categories');
            const categoriesdocument = await getDocs(categoriesCollection);
            const categories = categoriesdocument.docs?.map((doc) => ({
                id: doc.id,
                data: doc.data(),
            }));
            // console.log("categories__________data",categories);
            setCtgData(categories)
            setIsLoading(false)
        } catch (error) {
            console.log('Error fetching categories:', error);
            setIsLoading(false)
        }
    };



    const fetchImages = async () => {
        setIsLoading(true)
        try {
            const imagesCollection = collection(firestore, 'images');
            const imagesdocument = await getDocs(imagesCollection);
            const imagesDataf = imagesdocument.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
            }));
      
            dispatch(getImageData(imagesDataf))
            setImagesData(imagesDataf)
            setFilteredData(imagesDataf)
            setIsLoading(false)
        }
        catch (error) {
            console.log('Error fetching images:', error);
            Alert.alert('Error',`${error}`)
            setIsLoading(false)
        }
    }

    const fetchVideos = async () => {
        setIsLoading(true)
        try {
            const videosCollection = collection(firestore, 'videos');
            const videosdocument = await getDocs(videosCollection);
            const videosData = videosdocument.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
            }));
         console.log(videosData,"video Data")
         setvideoData(videosData)
         setIsLoading(false)
            // dispatch(getImageData(imagesDataf))
            // setImagesData(imagesDataf)
            // setFilteredData(imagesDataf)
        }
        catch (error) {
            console.log('Error fetching videos:', error);
            setIsLoading(false)
        }

    }


    const fetchVideoCategories = async () => {
        setIsLoading(true)
        try {
            const categoriesCollection = collection(firestore, 'videocategories');
            const categoriesdocument = await getDocs(categoriesCollection);
            const categories = categoriesdocument.docs?.map((doc) => ({
                id: doc.id,
                data: doc.data(),
            }));
            console.log("videos categories__________data",categories);
            setVideoCategories(categories)
            setIsLoading(false)
        } catch (error) {
            console.log('Error fetching categories:', error);
            setIsLoading(false)
        }
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
            setUserData({userData:updatedData});
          }
        } catch (error) {
          console.log(error,"error")
        }
      };

console.log(ctgData,videocategories,"header Data")

    return (
        <SafeAreaView style={{ flex: 1 }}>
  <Header userData={userData} />
  <ScrollView
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
  >
    <CategoriesList
      ctgData={ctgData}
      filteredData={filteredData}
      navigation={navigation}
      videoData={videoData}
      videocategories={videocategories}
    />
  </ScrollView>
  {/* {!ctgData && !videocategories && <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
      
        zIndex: 1, // Ensure it's above the ScrollView
      }}
    >
      <Text style={{color:"black",fontWeight:"bold",fontSize:20}}>Server not respond!</Text>
    </View>} */}

  {isLoading && (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        zIndex: 1, 
      }}
    >
      <ActivityIndicator size="large" color={'black'} />
    </View>
  )}

  <Bottom />
</SafeAreaView>

        // <SafeAreaView style={{ flex: 1 }}>
        //     <Header   userData={userData}/>
        //     <ScrollView  refreshControl={
        //         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        //     }>
        //     {isLoading &&  <ActivityIndicator size="large" color={'black'} marginTop={10} style={{justifyContent:"center",flex:1}}/>}
        //     <CategoriesList ctgData={ctgData} filteredData={filteredData} navigation={navigation} videoData={videoData} videocategories={videocategories}/>
        //     </ScrollView>
        //     <Bottom/>
        // </SafeAreaView>
    );
}

const styles = StyleSheet.create({
text:{
    color:"#000",
    fontSize:24,
    textAlign:"center"
}


})

export default HomeScreen;