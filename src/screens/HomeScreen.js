import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import GalleryCard from '../components/GalleryCard';
import Categories from '../components/Categories';
import { firestore } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useDispatch,useSelector } from 'react-redux';
import { getImageData } from '../redux/action/imageData';
function HomeScreen({ navigation }) {
    const dispatch = useDispatch();
    const imgdata = useSelector((state)=>state.reducer)
    const [imagesData, setImagesData] = useState(null)
    const [filteredData, setFilteredData] = useState(null);
    const [ctgData, setCtgData] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null);


    const handleImagePress = (image) => {
        setSelectedImage(image);
        navigation.navigate('Preview', { selectedImage: image, filteredData: filteredData });
    };

    useEffect(() => {
        fetchCategories();
        fetchImages();
    }, [])
    
    const fetchCategories = async () => {
        try {
            const categoriesCollection = collection(firestore, 'categories');
            const categoriesdocument = await getDocs(categoriesCollection);
            const categories = categoriesdocument.docs.map((doc) => ({
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


    const [selectedCategory, setSelectedCategory] = useState(null);
    const filterItem = (categItem) => {
        setSelectedCategory(categItem);
        const updatedItems = imagesData?.filter((curItem) => {
            return curItem?.data.ctgIds === categItem;
        });
        setFilteredData(updatedItems);
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>


            <View style={styles.home_top_container}>
                <View style={styles.top_heading}>
                    <Text style={styles.containers_heading}>Categories</Text>
                </View>
                <View style={styles.category_list}>
                    <ScrollView horizontal>
                        {

                            ctgData === null ? <View style={{ flex: 1, justifyContent: 'center',width:350 }}><ActivityIndicator  size="small" color="black" /></View> :
                                ctgData?.map((item, index) =>
                                    <Categories key={index} item={item} filterItem={filterItem} selectedCategory={selectedCategory} />
                                )
                        }
                    </ScrollView>
                </View>
            </View>
            <View style={styles.home_bottom_container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.bottom_heading}>
                        <Text style={styles.containers_heading}>All Photos</Text>
                    </View>
                    <View style={styles.gallery}>
                        {

                            filteredData === null || imagesData === null ? <View style={{ flex: 1, justifyContent: 'center',height:500 }}><ActivityIndicator size="small" color="black" /></View> :
                                filteredData?.map((item, index) =>
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => handleImagePress(item)}
                                    >
                                        <GalleryCard item={item} />
                                    </TouchableOpacity>
                                )
                        }
                    </View>
                </ScrollView>

            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    home_top_container: {
        flex: 1,
        backgroundColor: 'white',

    },
    top_heading: {
        flex: 1,
        padding: 10,

    },
    top_heading_text: {
        color: 'black',
        fontSize: 18,
        fontWeight: 700
    },
    category_list: {
        flex: 2,
        flexDirection: 'row',

    },
    containers_heading: {
        color: 'black',
        fontSize: 18,
        fontWeight: '700'
    }
    ,
    home_bottom_container: {
        flex: 5,
        backgroundColor: 'white',
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    bottom_heading: {
        flex: 1,
        justifyContent: 'center',
    },
    gallery: {
        flex: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 20
    },


})

export default HomeScreen;