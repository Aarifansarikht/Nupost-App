import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet ,Text} from 'react-native';
import { firestore } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useDispatch, useSelector } from 'react-redux';
import { getImageData } from '../redux/action/imageData';
import CategoriesList from '../components/CategoriesList';
import Bottom from '../components/Bottom';
import Header from '../components/Header';

function HomeScreen({ navigation,route }) {
    const dispatch = useDispatch();
    const imgdata = useSelector((state) => state.reducer);
    const [imagesData, setImagesData] = useState([])
    const [filteredData, setFilteredData] = useState(null);
    const [ctgData, setCtgData] = useState(null);
    const [videoData, setvideoData] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [videocategories,setVideoCategories] = useState(null)


    useEffect(() => {
        fetchCategories();
        fetchImages();
        fetchVideos()
        fetchVideoCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const categoriesCollection = collection(firestore, 'categories');
            const categoriesdocument = await getDocs(categoriesCollection);
            const categories = categoriesdocument.docs?.map((doc) => ({
                id: doc.id,
                data: doc.data(),
            }));
            // console.log("categories__________data",categories);
            setCtgData(categories)
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };



    const fetchImages = async () => {
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
        }
        catch (error) {
            console.error('Error fetching images:', error);
        }

    }

    const fetchVideos = async () => {
        try {
            const videosCollection = collection(firestore, 'videos');
            const videosdocument = await getDocs(videosCollection);
            const videosData = videosdocument.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
            }));
         console.log(videosData,"video Data")
         setvideoData(videosData)
            // dispatch(getImageData(imagesDataf))
            // setImagesData(imagesDataf)
            // setFilteredData(imagesDataf)
        }
        catch (error) {
            console.error('Error fetching images:', error);
        }

    }


    const fetchVideoCategories = async () => {
        try {
            const categoriesCollection = collection(firestore, 'videocategories');
            const categoriesdocument = await getDocs(categoriesCollection);
            const categories = categoriesdocument.docs?.map((doc) => ({
                id: doc.id,
                data: doc.data(),
            }));
            console.log("videos categories__________data",categories);
            setVideoCategories(categories)
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header/>
            <CategoriesList ctgData={ctgData} filteredData={filteredData} navigation={navigation} videoData={videoData} videocategories={videocategories}/>
            <Bottom/>
        </SafeAreaView>
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