import React, {useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View ,TouchableOpacity,ScrollView,Image,StyleSheet,FlatList} from 'react-native'
import {useSelector} from 'react-redux';
import { getUserData } from '../redux/action/imageData';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from '@firebase/firestore';
import {firestore} from '../firebase/firebase';
const ViewallPost = ({navigation,route}) =>  {

  const {catId} = route.params;
  const imgdata = useSelector(state => state.reducer);
  const [userData, setUserData] = useState(null);


    const handleImagePress = image => {
      navigation.navigate('Preview', {
        selectedImage: image,
        // filteredData: filteredData,
      });
    };

    const getUserData = async () => {
      try {
        const data = await AsyncStorage.getItem('userData');
        if (data) {
          const parsedData = JSON.parse(data);
          const email = parsedData?.userData?.email;
          const usersRef = collection(firestore, 'users');
          const q = query(usersRef, where('email', '==', email));
          const querySnapshot = await getDocs(q);
          const userDoc = querySnapshot.docs[0];
          const updatedData = userDoc?.data();
          // console.log({userData:updatedData},"userData from firebase")
          setUserData({userData:updatedData});
        }
      } catch (error) {
        console.log(error,"error")
      }
    };

    useEffect(()=>{
    getUserData()
    },[])

    const filterDatabyDate = (catId) =>{
      const currentDate = new Date(); 
      console.log(currentDate,"date")
      // Define the conditions based on userType
      let filteredImages = [];
      if (userData?.userData?.userType === 'free') {
        // Show all images until today's date
        console.log('userType is free')
        filteredImages = imgdata.filter(
          imageitem =>
            new Date(imageitem.data.date) <= currentDate &&
            imageitem.data.ctgIds.includes(catId) 
        );
      } else if (userData?.userData?.userType === 'basic') {
        const endDateBasic = new Date(currentDate);
        endDateBasic.setDate(currentDate.getDate() + 3);
        console.log(endDateBasic,"date of basic")
        filteredImages = imgdata.filter(
          imageitem =>
            new Date(imageitem.data.date) <= endDateBasic 
            &&
            imageitem.data.ctgIds.includes(catId)
        );
      } else if (userData?.userData?.userType === 'premium') {
        // Show all images
        console.log(userData?.userData?.userType,"userType")
        filteredImages = imgdata.filter(
          imageitem =>
            imageitem.data.ctgIds.includes(catId)
        );
      }
      console.log(filteredImages,"filteredImages")
      return filteredImages
}
      


    return (
      <View style={{backgroundColor: '#0031',flex:1}}>
        <FlatList
          data={filterDatabyDate(catId)}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => handleImagePress(item)}>
              <Image
                style={{ height: 160, width: '50%', aspectRatio: 0.93, borderRadius: 10, margin: 5 }}
                source={{ uri: item.data.url }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
        />
{/* </View> */}

          {/* <ScrollView >
            <View style={styles.imageitems}>
              {
              
                imgdata
                  .filter(
                    imageitem =>
                      imageitem.data.ctgIds.includes(catId),
                  )

                  .map((filteredItem, index) => 
                  (
                    <TouchableOpacity
                      key={index}s
                      onPress={() => handleImagePress(filteredItem)}>
                      <Image
                        style={{height: 160, width: 145, borderRadius: 10}}
                        source={{uri: filteredItem.data.url}}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  )
                  )}
            </View>
          </ScrollView> */}
      </View>
    )
  
}

const styles = StyleSheet.create({
  category_name: {
    padding: 6,
    flexDirection:"row",
    justifyContent:'space-between',
  },
  category_text: {
    color: 'black',
    fontSize: 18,
    fontWeight: '700',
  },
  imageitems: {
    gap: 10,
    padding: 6,
  },
  viewAll_text:{
    paddingLeft:5,
    color:"#000",
    textDecorationLine:"underline",
    fontSize:18
  }
});



export default ViewallPost

