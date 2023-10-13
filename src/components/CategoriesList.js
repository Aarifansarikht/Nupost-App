import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import VideoPlayer from "react-native-video-player";

import { useSelector } from 'react-redux';
function CategoriesList({ ctgData, filteredData, navigation }) {
    const imgdata = useSelector((state) => state.reducer)
    const [indicator, setIndicator] = useState(false);
    const handleLoadStart = () => {
        setIndicator(true);
    };
    const [selectedImage, setSelectedImage] = useState(null);

    console.warn("img_______data",imgdata);
    const handleImagePress = (image) => {
        setSelectedImage(image);
        navigation.navigate('Preview', { selectedImage: image, filteredData: filteredData });
    };

    return (
        <ScrollView style={{ backgroundColor: '#0031' }}>
            {ctgData?.map((ctgitem,index) =>
                <View key={index} >
                    <View style={styles.category_name}>
                        <Text style={styles.category_text}>{ctgitem.data?.ctgName}</Text>
                    </View>
                    <ScrollView horizontal={true}>
                        <View style={styles.imageitems}>

                            {imgdata
                                .filter((imageitem) => imageitem.data && imageitem.data.ctgIds && imageitem.data.ctgIds.includes(ctgitem.id))
                                .map((filteredItem, index) =>
                                    <View style={{ height: 160, width: 145, borderRadius: 10 }}>
                                        {filteredItem.data && filteredItem.data.url && /\.(mp4|mov|avi|mkv)$/i.test(filteredItem.data.url) ? (
                                            <View style={styles.videoContainer}>
                                                <VideoPlayer
                                                    style={{ height: 160, width: 145, borderRadius: 10 }}
                                                    video={{ uri: filteredItem.data.url }}
                                                    autoPlay={true}
                                                    controlsTimeout={1000}
                                                    defaultMuted={true}
                                                    repeat={true}
                                                    onLoadStart={handleLoadStart}
                                                    hideSeekBar={true}
                                                    onLoad={() => setIndicator(false)}
                                                />
                                                {indicator ? <ActivityIndicator size='small' color='white' style={styles.activityIndicator} /> : null}
                                            </View>
                                        ) : (
                                            <TouchableOpacity key={index} onPress={() => handleImagePress(filteredItem)}>
                                                <Image
                                                    style={{ height: 160, width: 145, borderRadius: 10 }}
                                                    source={{ uri: filteredItem.data.url }}
                                                    resizeMode="cover"
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                )}
                        </View>
                    </ScrollView>
                </View>
            )}
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    category_name: {
        padding: 6
    },
    category_text: {
        color: 'black',
        fontSize: 18,
        fontWeight: '700'
    },
    imageitems: {
        flexDirection: 'row',
        gap: 10,
        padding: 6
    }
})
export default CategoriesList;