import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

function DatePicker({showDatePicker, selectedDate}) {
  return (
    <View style={{padding: 10, alignItems: 'center'}}>
      <TouchableOpacity
        onPress={showDatePicker}
        style={{
          backgroundColor: '#fff',
          width: '100%',
          alignItems: 'center',
          borderRadius: 50,
          padding: 5,
        }}>
        <View>
          <Text style={{color: '#000', padding: 10, fontSize: 16}}>
            {selectedDate ? selectedDate.toDateString() : 'Choose date'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default DatePicker;
