import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {firestore} from '../firebase/firebase';
import {collection, getDocs} from 'firebase/firestore';

const DropdownComponent = ({onPartySelect, politicalParty}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [dropDownData, SetDropDownData] = useState([]);

  const fetch_party_name = async () => {
    try {
      const party_name_Collection = collection(firestore, 'politicalpartys');
      const politicalPartydocument = await getDocs(party_name_Collection);
      const data = politicalPartydocument.docs?.map(doc => ({
        id: doc.id,
        label: doc.data().party_name,
      }));
      console.log('partyname__________data', data);
      SetDropDownData(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetch_party_name();
  }, []);

  console.log(politicalParty, value, 'dropdown_______data');
  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && {borderColor: 'gray'}]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={dropDownData}
        search
        maxHeight={200}
        textStyle={{color: '#fff'}}
        labelField="label"
        valueField="value"
        placeholder={'Select Political Party & Logo'}
        searchPlaceholder="Search..."
        value={politicalParty ? politicalParty : value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          console.log('Dropdown_Item', item);
          setValue(item.value);
          setIsFocus(false);
          onPartySelect(item.label, item.id);
        }}
        renderItem={(item, index, isSelected) => (
          <View
            key={item.value}
            style={{
              backgroundColor: isSelected ? 'lightgray' : 'white',
              padding: 10,
            }}>
            <Text style={{color: 'black'}}>{item.label}</Text>
          </View>
        )}
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
    color: '#fff',
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: '#fff',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#fff',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#fff',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: '#fff',
  },
  icon: {
    marginRight: 5,
    width: 20,
    height: 20,
  },
});
