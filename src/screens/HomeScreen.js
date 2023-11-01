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
    const [selectedImage, setSelectedImage] = useState(null);



    useEffect(() => {
        fetchCategories();
        fetchImages();
 
        console.log(route.params,"route")
    }, [route.params])

    const fetchCategories = async () => {
        try {
            const categoriesCollection = collection(firestore, 'categories');
            const categoriesdocument = await getDocs(categoriesCollection);
            const categories = categoriesdocument.docs?.map((doc) => ({
                id: doc.id,
                data: doc.data(),
            }));
            console.log("categories__________data",categories);
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

console.log(ctgData,"filter_data",filteredData)

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CategoriesList ctgData={ctgData} filteredData={filteredData} navigation={navigation} />
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