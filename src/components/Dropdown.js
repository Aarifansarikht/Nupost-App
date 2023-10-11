import React, { useState  } from 'react';
  import { StyleSheet, Text, View ,Image} from 'react-native';
  import { Dropdown } from 'react-native-element-dropdown';
  import CustomIconImage from '../assets/img/drop.png'; 
  import { firestore } from "..//firebase/firebase";
  import { collection, getDocs } from "firebase/firestore";
import { useFocusEffect } from '@react-navigation/native';
import { getUserData } from '../redux/action/imageData';


  const fetchCategories = async () => {
    try {
        const political_parties_name = collection(firestore, 'party_name');
        console.log(political_parties_name,"name")
        const categoriesdocument = await getDocs(political_parties_name);
        console.log(categoriesdocument,"docs..........")
        // const data = categoriesdocument.data
        const categories = categoriesdocument.docs?.map((doc) => ({
            id: doc.id,
            data: doc.data(),
        }));
    console.log(categories,"check map dropdown data,")
        // setCtgData(categories)
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

fetchCategories();


  const data = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
  ];

  const DropdownComponent = () => {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);


    return (
      <View style={styles.container}>
    
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'gray' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search
          maxHeight={200}
          textStyle={{ color: 'black' }}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select Political Party' : '...'}
        
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
          }}
          renderItem={(item, index, isSelected) => (
            <View
              key={item.value}
              style={{
                backgroundColor: isSelected ? 'lightgray' : 'white',
                padding: 10,
              }}
            >
              <Text style={{ color: 'black' }}>{item.label}</Text>
            </View>
          )}
        //   renderLeftIcon={() => (
        //     <Image 
        //       style={styles.icon}
        //       source={CustomIconImage} 
        //     />
        //   )}
        />
      </View>
    );
  };

  export default DropdownComponent;

  const styles = StyleSheet.create({

    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        color: 'black'
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      backgroundColor: 'black',
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 16,
      color:"black"
    },
    selectedTextStyle: {
      fontSize: 16,
      color:"black"
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
      color:"black"
    },
    icon: {
        marginRight: 5,
        width: 20,
        height: 20,
      },
  });