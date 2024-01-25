import React from 'react';
import {TouchableOpacity} from 'react-native';
import {StyleSheet, Text} from 'react-native';
import {Modal, View} from 'react-native';

function WaitModal({closeWaitModal, openWaitModal}) {
  console.log('hello');
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={openWaitModal}
      onRequestClose={closeWaitModal}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            backgroundColor: '#000',
            padding: 20,
            borderRadius: 10,
            width: '80%',
            borderWidth: 2,
            borderColor: '#000',
          }}>
          <View style={{alignItems: 'center'}}>
            <Text style={{color: '#fff'}}>Wait for Upcoming date!</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity onPress={closeWaitModal} style={{marginTop: 20}}>
              <View style={styles.bottomButton}>
                <Text style={styles.buttonText}>OK</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    borderRadius: 10,
  },
  btns_wrapper: {
    flexDirection: 'row',
    padding: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  btns: {
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
  },
  btns_text: {
    fontSize: 16,
    color: 'white',
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: 'black',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
  },
  bottomButton: {
    borderWidth: 2,
    borderColor: '#fff',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
  },
});
export default WaitModal;
