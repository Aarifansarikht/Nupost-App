import React, { useState } from 'react'
import { Text, View ,TouchableOpacity,ScrollView,Image,StyleSheet,FlatList} from 'react-native'
import {useSelector} from 'react-redux';

const ViewallPost = ({navigation,route}) =>  {

  const {catId} = route.params;
  const imgdata = useSelector(state => state.reducer);
  console.log(imgdata,"imagedata")
  console.log(catId,"categoryId")


    const handleImagePress = image => {
      navigation.navigate('Preview', {
        selectedImage: image,
        // filteredData: filteredData,
      });
    };

    return (
      <View style={{backgroundColor: '#0031',flex:1}}>
  <FlatList
    data={imgdata.filter(imageitem => imageitem.data.ctgIds.includes(catId))}
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

