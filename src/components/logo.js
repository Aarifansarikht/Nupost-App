import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { firestore } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

function Logo_list() {
    const [LogoData,SetLogoData]= useState([]);
      
    const fetch_party_name = async () => {
      try {
          const logo_name_Collection = collection(firestore, 'partylogo');
          const politicalPartylogo = await getDocs(logo_name_Collection);
          const data = politicalPartylogo.docs?.map((doc) => (doc.data()));
          console.log("partylogo__________data",data);
          SetLogoData(data)
      
      } catch (error) {
          console.error('Error fetching categories:', error);
      }
    };
    
    useEffect(()=>{
      fetch_party_name()
    },[])

    return (
        <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {LogoData.map((item,index) => (
            //onPress={() => handleCardPress(uri)}
            <TouchableOpacity key={index} >  
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

        // <ScrollView style={{ backgroundColor: '#0031' }}>
        //     {LogoData?.map((item,index) =>
        //         <View key={index} >
        //             <View style={styles.imageitems}>
        //             <ScrollView horizontal={true}>
        //                 <View style={styles.imageitems}>
        //                                     <TouchableOpacity key={index} onPress={() => handleImagePress(filteredItem)}>
        //                                         <Image
        //                                             style={{ height: 160, width: 145, borderRadius: 10 }}
        //                                             source={{ uri: item?.url }}
        //                                             resizeMode="cover"
        //                                             />
        //                                     </TouchableOpacity>
        //                 </View>
        //             </ScrollView>
        //         </View>
        //                      </View>
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
export default Logo_list;