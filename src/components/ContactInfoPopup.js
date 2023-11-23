import React, { useState } from 'react';
import { View, Text, Modal, Button, StyleSheet ,TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
const ContactInfoPopup = ({ visible, onClose }) => {


  const contactInformation = {
    mobile: '+1234567890',
    email: 'example@example.com',
    whatsapp: '+1234567890',
    twitter: '@example_twitter',
  };


  return (
    <View style={styles.container}>
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalCenteredView}>
      <View style={styles.modalView}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Feather name="x" style={{ color: 'black' }} size={24} />
        </TouchableOpacity>
        <Text style={styles.modalText}>
          Contact Information
        </Text>
        <Text style={{color:"#000",alignSelf:"flex-start"}}><Feather name='mail' style={{ color: 'black', padding: 5 }} size={20} /> Email: {contactInformation.email}</Text>
            <Text style={{color:"#000",alignSelf:"flex-start"}}><Feather name='phone' style={{ color: 'black', padding: 5 }} size={20} /> Mobile: {contactInformation.mobile}</Text>
            <Text style={{color:"#000",alignSelf:"flex-start"}}><Feather name='smartphone' style={{ color: 'black', padding: 5 }} size={20} /> WhatsApp: {contactInformation.whatsapp}</Text>
      </View>
    </View>
  </Modal>
</View>

  );
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative', // Ensures relative positioning for the closeButton
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 999, // Ensure the close button is above other content
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color:"#000"
  },
});

export default ContactInfoPopup;
