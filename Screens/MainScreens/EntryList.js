import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/core";
import { LinearGradient } from 'expo-linear-gradient';

import EntryListBox from '../../Components/EntryListBox';

import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import TopBar from "../../Components/TopBar";



const EntryList = () => {




    return (
        <SafeAreaView style={styles.container}>
            <TopBar />
            
            <LinearGradient colors={['#FFFFFF', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.04 }} style={{ height: 5, width: '100%' }} />

            <ScrollView style={styles.scrollContainer} 
                contentContainerStyle={{ alignItems: 'center' }}
                scrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                bounces={true}> 
                
                <Text style={[{ fontSize: 60, fontWeight: 'bold', marginTop: 0 }]}>Entry List</Text>
                
                <View style={[{ backgroundColor: 'rgba(0,0,0,0.5)', height: 3, width: 350, borderRadius: 3, marginTop: 10, marginBottom: 10 }]}/>

                <View style={styles.entries}>
                    <EntryListBox/>
                    <EntryListBox/>
                    <EntryListBox/>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
    },

    scrollContainer: {
        flex: 1,
    },

    testButton: {
        backgroundColor: 'black',
        margin: 10,
        padding: 5,
    },

    testText: {
        color: 'white',
        fontSize: 30,
    },

    entries: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20,
    },
})

export default EntryList;