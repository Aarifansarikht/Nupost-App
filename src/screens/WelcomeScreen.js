import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

function WelcomeScreen({ navigation }) {

    return (
        <SafeAreaView style={styles.main_container}>
            <View style={styles.top_container}>
                <Image style={{ height: 200, width: 330 }} source={require('../assets/img/welcomeimg.png')}></Image>
            </View>
            <View style={styles.bottom_container}>
                <View style={styles.btns_wrapper}>
                    <TouchableOpacity onPress={() => navigation.navigate('LogIn')} style={styles.btns}>
                        <Text style={styles.btns_text}>LogIn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.btns}>
                        <Text style={styles.btns_text}>SignUp</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: 'white',
    },
    top_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottom_container: {
        flex: 2,
        backgroundColor: 'black',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    btns_wrapper: {
        flex: 1,
        padding: 18,
        justifyContent: 'center',
    },
    btns: {
        backgroundColor: 'white',
        marginBottom: 15,
        height: 60,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btns_text: {
        color: 'black',
        fontWeight: '700',
        fontSize: 18
    },

})

export default WelcomeScreen;