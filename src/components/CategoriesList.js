import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import VideoPlayer from "react-native-video-player";
import { UseSelector } from 'react-redux/es/hooks/useSelector';
import { useSelector } from 'react-redux';
function CategoriesList({ ctgData, filteredData, navigation ,route}) {
    const imgdata = useSelector((state) => state.reducer)
    const [indicator, setIndicator] = useState(false);
    const handleLoadStart = () => {
        setIndicator(true);
    };
  
    const [selectedImage, setSelectedImage] = useState(null);
    const isVideo = useSelector((state) => state.isVideo.isVideo);
    console.log(isVideo,"CategoriesList isVideo")
    // console.warn("img_______data",imgdata);
    const handleImagePress = (image) => {
        setSelectedImage(image);
        navigation.navigate('Preview', { selectedImage: image, filteredData: filteredData });
    };

    const videoData = imgdata.filter((imageitem) =>
    isVideo && imageitem.data && /\.(mp4|mov|avi|mkv)$/i.test(imageitem.data?.url)
  );

    return (   <ScrollView style={{ backgroundColor: '#0031' }}>
    {ctgData?.length === 0 && (
      <Text style={{ color: '#000', textAlign: 'center', fontSize: 16, margin: 30 }}>Data Not Found</Text>
    )}
   
    {ctgData?.map((ctgitem, index) => (
      <View key={index}>
        <View style={styles.category_name}>
          <Text style={styles.category_text}>{ctgitem.data?.ctgName}</Text>
        </View>
        {isVideo && videoData?.length === 0 && (
      <Text style={{ color: '#000', textAlign: 'center', fontSize: 16, margin: 30 }}>Data Not Found</Text>
    )}
        <ScrollView horizontal={true}>
          <View style={styles.imageitems}>
            {isVideo && imgdata.some((imageitem) =>
              imageitem.data &&
              /\.(mp4|mov|avi|mkv)$/i.test(imageitem.data?.url) &&
              imageitem.data.ctgIds.includes(ctgitem.id)
            ) ? (
              imgdata
                .filter((imageitem) =>
                  imageitem.data &&
                  /\.(mp4|mov|avi|mkv)$/i.test(imageitem.data?.url) &&
                  imageitem.data.ctgIds.includes(ctgitem.id)
                )
                .map((filteredItem, index) => (
                  <View key={index} style={{ height: 160, width: 145, borderRadius: 10 }}>
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
                  </View>
                )) ) :  ""}
            
             
          {!isVideo &&  imgdata
                .filter((imageitem) =>
                  !/^(mp4|mov|avi|mkv)$/i.test(imageitem.data?.url) &&
                  imageitem.data.ctgIds.includes(ctgitem.id)
                )
                .map((filteredItem, index) => (
                  <TouchableOpacity key={index} onPress={() => handleImagePress(filteredItem)}>
                    <Image
                      style={{ height: 160, width: 145, borderRadius: 10 }}
                      source={{ uri: filteredItem.data.url }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))
            }
            
          </View>
        </ScrollView>
      </View>
    ))}
  </ScrollView>
       
        // <ScrollView style={{ backgroundColor: '#0031' }}>
        //     {ctgData?.length == 0 && <Text style={{color:"#000",textAlign:"center",fontSize:16,margin:30}}>Data Not Found</Text>}
        //     {ctgData?.map((ctgitem,index) =>
        //         <View key={index} >
        //             <View style={styles.category_name}>
        //                 <Text style={styles.category_text}>{ctgitem.data?.ctgName}</Text>
        //             </View>
        //             <ScrollView horizontal={true}>
        //                 <View style={styles.imageitems}>


        //                     {imgdata
        //                         .filter((imageitem) => imageitem.data && imageitem.data.ctgIds && imageitem.data.ctgIds.includes(ctgitem.id))
        //                         .map((filteredItem, index) =>

        //                             <View style={{ height: 160, width: 145, borderRadius: 10 }}>

                                        
        //                                 {filteredItem?.data && filteredItem.data.url && /\.(mp4|mov|avi|mkv)$/i.test(filteredItem?.data?.url) ? (
        //                                     <View style={styles.videoContainer}>
        //                                         <VideoPlayer
        //                                             style={{ height: 160, width: 145, borderRadius: 10 }}
        //                                             video={{ uri: filteredItem.data.url }}
        //                                             autoPlay={true}
        //                                             controlsTimeout={1000}
        //                                             defaultMuted={true}
        //                                             repeat={true}
        //                                             onLoadStart={handleLoadStart}
        //                                             hideSeekBar={true}
        //                                             onLoad={() => setIndicator(false)}
        //                                         />
        //                                         {indicator ? <ActivityIndicator size='small' color='white' style={styles.activityIndicator} /> : null}
        //                                     </View>
        //                                 ) :  (
        //                                     <TouchableOpacity key={index} onPress={() => handleImagePress(filteredItem)}>
        //                                         <Image
        //                                             style={{ height: 160, width: 145, borderRadius: 10 }}
        //                                             source={{ uri: filteredItem.data.url }}
        //                                             resizeMode="cover"
        //                                         />
        //                                     </TouchableOpacity>
        //                                 )}
        //                             </View>
        //                         )}
                                
        //                 </View>
        //             </ScrollView>
        //         </View>
        //     )}
        // </ScrollView>
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