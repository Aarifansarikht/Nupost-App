import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Swiper from 'react-native-swiper';
import Entypo from 'react-native-vector-icons/Entypo';
function SubscriptionModal({modalVisible, setModalVisible}) {
  //   const [modalVisible, setModalVisible] = useState(modalVisible);
  const subscriptionPlans = [
    {
      name: 'Basic',
      points: [
        'All festival posts',
        'Daily posts ',
        'New incident posts ',
        'Select 10 defaults frame (can change any time)',
        'Can download 7 post without watermark  per day',
        'No downloads limit with watermark ',
        '3 days post in advance',
        'Profile setup',
      ],
      price: '599/- 1 Year',
    },
    {
      name: 'Premium',
      points: [
        'All festival posts ',
        'Daily posts ',
        'New incident posts ',
        'All defaults frame ',
        ,
        'No limit for downloading without watermark',
        'All post in advance',
        '5 custom frames ',
        'Profile setup',
      ],
      price: '699/- 1 Year',
    },
    {
      name: 'Free',
      points: [
        'All festival posts ',
        'Daily posts ',
        'New incident posts ',
        'Select 5 defaults frame',
        '7 downloads per day',
        'No post in advance',
      ],
      price: '0/- 1 Year',
    },
  ];
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 5,
            width: '100%',
            backgroundColor: '#000',
          }}>
          <Text style={{fontSize: 20, fontWeight: 700, color: '#fff'}}>
            Nupost By Sawariya
          </Text>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Entypo name="cross" size={35} color="#fff" />
          </TouchableOpacity>
        </View>
        <Swiper style={styles.wrapper} showsButtons={false}>
          {subscriptionPlans.map((plan, index) => (
            <View key={index} style={styles.slide}>
              <View style={styles.planContainer}>
                <Text style={styles.planName}>{plan.name}</Text>
                {plan.points.map((point, pointIndex) => (
                  <Text
                    key={pointIndex}
                    style={styles.pointText}>{`- ${point}`}</Text>
                ))}
                <View
                  style={{
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: 10,
                    width: '100%',
                  }}>
                  <TouchableOpacity
                    style={{
                      borderColor: '#000',
                      borderWidth: 2,
                      borderRadius: 10,
                      width: '80%',
                      padding: 10,
                      backgroundColor: '#000',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: '#fff',
                        textAlign: 'center',
                      }}>
                      &#8377; {plan.price}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </Swiper>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  SubscriptionPlan: {
    backgroundColor: '#000',
    padding: 20,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    backgroundColor: 'red',
  },
  planContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    top: 60,
    height: '90%',
    width: '80%',
    left: 40,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
    padding: 10,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#555',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  pointText: {
    fontSize: 13,
    marginLeft: 15,
    color: '#000',
    lineHeight: 36,
    textAlign: 'left',
  },
});

export default SubscriptionModal;
