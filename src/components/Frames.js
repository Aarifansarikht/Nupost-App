import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { firestore } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

function Frame_list({ selectedFrame, onSelectImage }) {
    const [framesData,SetFrameData]= useState([]);
    // const [selectedFrame, setSelectedFrame] = useState(null);
    const fetch_frames = async () => {
      try {
          const logo_name_Collection = collection(firestore, 'frameimages');
          const politicalPartylogo = await getDocs(logo_name_Collection);
          const data = politicalPartylogo.docs?.map((doc) => (doc.data()));
          console.log("frames__________data",data);
          SetFrameData(data)
      
      } catch (error) {
          console.error('Error fetching categories:', error);
      }
    };
    
    useEffect(()=>{
        fetch_frames()
    },[])

    const handleCardPress = (uri) => {
      console.log(uri,"here is uri______")
      onSelectImage(uri);
    };
  
    return (
        <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {framesData.map((item,index) => (
            //
            <TouchableOpacity key={index} onPress={() => handleCardPress(item?.url)}>  
              <View style={styles.card}>
                <Image source={{ uri: item?.url }} style={styles.image} />
                {/* <Text style={styles.cardText}>Card {index + 1}</Text> */}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
  
        {/* {selectedImage && (
          <Text style={styles.selectedImageText}>
            Selected Image URI: {selectedImage}
          </Text>
        )} */}
      </View>

     
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
    },
    container: {
        flex: 1,
        padding: 20,
      },
      scrollContainer: {
        flexDirection: 'row',
      },
      card: {
        marginRight: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
      },
      image: {
        width: 150,
        height: 150,
        borderRadius: 5,
      },
      cardText: {
        marginTop: 10,
        textAlign: 'center',
      },
      selectedImageText: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center',
      },
    
})
export default Frame_list;