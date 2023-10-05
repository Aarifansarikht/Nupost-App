import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
function MyDownloadScreen(props) {
  const [downloadedImages, setDownloadedImages] = useState([]);

  useEffect(() => {
    const fetchDownloadedImages = async () => {
      try {
        const downloadDirectory = RNFetchBlob.fs.dirs.PictureDir;
        const nupostImagesDirectory = `${downloadDirectory}/Nupost_Images`; // Update this path

        const imageFiles = await RNFetchBlob.fs.ls(nupostImagesDirectory);

        setDownloadedImages(imageFiles);
      } catch (error) {
        console.error('Error fetching downloaded images:', error);
      }
    };

    fetchDownloadedImages();
  }, []);


  const openImageInViewer = async (imageName) => {
    try {
      const downloadDirectory = RNFetchBlob.fs.dirs.PictureDir;
      const imagePath = `${downloadDirectory}/Nupost_Images/${imageName}`;

      if (await RNFS.exists(imagePath)) {
        await Share.open({
          url: `file://${imagePath}`,
          type: 'image/jpeg', // Change the type to match your image format
        });
      } else {
        console.error('Image not found:', imageName);
      }
    } catch (error) {
      console.error('Error opening image:', error);
    }
  };

  return (
    <View>
      <Text style={{ color: 'black',padding:20,textAlign:'center',fontSize:18,fontWeight:500 }}>My Downloads</Text>
      <FlatList
         ItemSeparatorComponent={() => <View style={{height: 10}} />}
        numColumns={2}
        data={downloadedImages}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={()=>openImageInViewer(item)}>

            <Image
              source={{ uri: 'file://' + RNFetchBlob.fs.dirs.PictureDir + '/Nupost_Images/' + item }}
              style={{ width: 165, height: 180,borderRadius:10 ,marginLeft:10}}
            />
          </TouchableOpacity>
          
        )}
      />
    </View>
  );
}

export default MyDownloadScreen;