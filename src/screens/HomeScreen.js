import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { firestore } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useDispatch, useSelector } from 'react-redux';
import { getImageData } from '../redux/action/imageData';
import CategoriesList from '../components/CategoriesList';
function HomeScreen({ navigation }) {
    const dispatch = useDispatch();
    const imgdata = useSelector((state) => state.reducer)
    const [imagesData, setImagesData] = useState(null)
    const [filteredData, setFilteredData] = useState(null);
    const [ctgData, setCtgData] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchCategories();
        fetchImages();
    }, [])

    const fetchCategories = async () => {
        try {
            const categoriesCollection = collection(firestore, 'categories');
            const categoriesdocument = await getDocs(categoriesCollection);
            const categories = categoriesdocument.docs?.map((doc) => ({
                id: doc.id,
                data: doc.data(),
            }));

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




    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CategoriesList ctgData={ctgData} filteredData={filteredData} navigation={navigation} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({



})

export default HomeScreen;