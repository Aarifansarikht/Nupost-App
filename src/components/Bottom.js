import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setVideoFalse ,setVideoTrue } from '../redux/reducer/isVideo';

const Bottom = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const navigation = useNavigation();
 
  const dispatch = useDispatch();

  const handleTabPress = (tabName) => {
    if(tabName === 'Video'){
      setActiveTab(tabName)
      navigation.navigate('Home')
      dispatch(setVideoTrue());
    }else if(tabName === 'Home')
    {
      setActiveTab(tabName);
      dispatch(setVideoFalse()); 
    }
    else{
      setActiveTab(tabName)
      navigation.navigate(tabName)
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'Home' ? styles.activeTab : null]}
        onPress={() => handleTabPress('Home')}
      >
        {/* <Text style={styles.tabText}>Home</Text> */}
        <Ionicons
                        name="home"
                        size={20}
                        style={{ color: 'black' }}
                    />
                          <Text style={styles.tabText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'Video' ? styles.activeTab : null]}
        onPress={() => handleTabPress('Video') }
      >
        <Ionicons
                        name="videocam-outline"
                        size={20}
                        style={{ color: 'black' }}
                    />
        <Text style={styles.tabText}>Video</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={[styles.tab, activeTab === 'Downloads' ? styles.activeTab : null]}
      >
        <Text style={styles.tabText}>Downloads</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#333',
    height: 60,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  activeTab: {
    backgroundColor: '#ccc',
  },
  tabText: {
    color: '#000',
  },
});

export default Bottom;
