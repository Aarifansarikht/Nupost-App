import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


function Categories(props) {
    const {ctgName} = props.item.data;
    const {id} = props.item;
    return (
        <TouchableOpacity onPress={()=>props.filterItem(id)}>
        <View style={styles.category}>
            <View style={{ backgroundColor: props.selectedCategory==id?'#E8EBEE':'white',borderWidth:props.selectedCategory==id?0:1,borderRadius:15 , justifyContent: 'center', alignItems: 'center', padding:10, marginLeft: 10}}>
            <Text style={{ color: 'black', textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{ctgName}</Text>
            </View>
        </View>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    category: {
        backgroundColor: 'white',
        justifyContent: 'center',
        flexDirection: 'column',
        marginRight: 2
    },
})
export default Categories;