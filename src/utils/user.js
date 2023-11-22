import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    updateDoc,
  } from '@firebase/firestore';
import {firestore} from '../firebase/firebase';

export const get_user = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        const parsedData = JSON.parse(data);
        
        const email = parsedData?.userData?.email;
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc?.data();
        const user = { userData };
        console.log("user_data", user)
        return user;  
      }
    } catch (error) {
      console.log(error,"error")
    }
  };