
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View,Text } from 'react-native';

import { useSelector } from 'react-redux';
import GalleryCard from './GalleryCard';
function SearchBar({navigation}) {
    const imgdata = useSelector((state) => state.reducer)
    const [searchText, setSearchText] = useState('');
    const [filteredImages, setFilteredImages] = useState(imgdata);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImagePress = (image) => {
        setSelectedImage(image);
        navigation.navigate('Preview', { selectedImage: image, filteredImages: filteredImages });
    };
    const handleSearch = (text) => {
        setSearchText(text);

        // Filter the images based on the search text
        const filtered = imgdata.filter((imageUrl) =>
            imageUrl?.data.url.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredImages(filtered);
    };


    return (
        
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flex: 1, padding: 6}}>
                <TextInput autoFocus placeholder="Search for images..." placeholderTextColor={'black'} onChangeText={handleSearch} style={{color:'black',padding: 16, fontSize: 16, borderRadius: 5, backgroundColor: 'white',borderWidth:1,borderColor:'black' }} />

            </View>
            <View style={{ flex: 7, padding: 8 }}>
                <ScrollView showsVerticalScrollIndicator={false} >

                    <View style={styles.gallery}>
                        {

                            filteredImages === null || filteredImages === null ? <View style={{ flex: 1, justifyContent: 'center', height: 500 }}><ActivityIndicator size="small" color="black" /></View> :
                                filteredImages?.map((item, index) =>
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => handleImagePress(item) }
                                    >
                                        <GalleryCard item={item} />
                                    </TouchableOpacity>
                                )
                        }
                    </View>
                </ScrollView>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    gallery: {
        flex: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 16
    },
})

export default SearchBar;