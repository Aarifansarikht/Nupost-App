import React, { useState , useEffect } from 'react';
  import { StyleSheet, Text, View ,Image} from 'react-native';
  import { Dropdown } from 'react-native-element-dropdown';
  import { firestore } from "../firebase/firebase";
  import { collection, getDocs } from "firebase/firestore";


  const DropdownComponent = ({ onPartySelect ,politicalParty }) => {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [dropDownData,SetDropDownData]= useState([]);
      
    const fetch_party_name = async () => {
      try {
          const party_name_Collection = collection(firestore, 'politicalpartys');
          const politicalPartydocument = await getDocs(party_name_Collection);
          const data = politicalPartydocument.docs?.map((doc) => ({
              id: doc.id,
              label: doc.data().party_name,
          }));
          // console.warn("partyname__________data",data);
          SetDropDownData(data)
      
      } catch (error) {
          console.error('Error fetching categories:', error);
      }
    };
    
    useEffect(()=>{
      fetch_party_name()
    },[])
    
    // console.log(data,"dropdown_______-data")
    return (
      <View style={styles.container}>
    
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'gray' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={dropDownData}
          search
          maxHeight={200}
          textStyle={{ color: 'black' }}
          labelField="label"
          valueField="value"
          placeholder={politicalParty ? `Selected Party ${politicalParty}` : 'Select Political Party'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
            onPartySelect(item.label);
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