import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { firestore } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

function Logo_list({ onSelectImage,partyId}) {
  console.log("Getting Party id for logo List",partyId)
    const [LogoData,SetLogoData]= useState([]);
    const [selectedLogo ,SetSelectedLogo] = useState();

    const fetch_party_logo = async () => {
      try {
          const logo_name_Collection = collection(firestore, 'partylogo');
          const politicalPartylogo = await getDocs(logo_name_Collection);
          const data = politicalPartylogo.docs?.map((doc) => (doc.data()));
          console.log("partylogo__________data",data);

          const matchedUrls = data.filter(item => item.party_id === partyId).map(item =>({ url: item.url }));
          console.log(matchedUrls,"fiteredData")
          SetLogoData(matchedUrls)
      } catch (error) {
          console.error('Error fetching categories:', error);
      }
    };
    
    useEffect(()=>{
      fetch_party_logo()
    },[partyId])

    const handleCardPress = (uri) => {
      console.log(uri,"here is uri______")
      SetSelectedLogo(uri)
      onSelectImage(uri);
    };


    return (
        <View style={styles.container}>
          <Text style={{fontSize:16,color:"#000",textAlign:"center"}}>Choose Political logo</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {LogoData.map((item,index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(item?.url)}>  
              <View style={[styles.card, selectedLogo === item.url && styles.selectedCard]}>
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
        marginTop:10,
        marginRight: 10,
        padding: 10,
      },
      image: {
        width: 60,
        height: 60,
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
      selectedCard: {
        borderColor: 'blue', 
        borderWidth: 2,
        borderRadius:20
      }
    
})
export default Logo_list;