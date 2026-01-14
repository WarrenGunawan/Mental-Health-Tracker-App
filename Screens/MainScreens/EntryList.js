import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { LinearGradient } from 'expo-linear-gradient';

import AntDesign from '@expo/vector-icons/AntDesign';

import EntryListBox from '../../Components/EntryListBox';

const EntryList = () => {

    const navigation = useNavigation();


    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={{ fontSize: 20 }}>InnerHue </Text>
                <AntDesign name="aliwangwang" size={20} color="black" />
            </View>
            <LinearGradient colors={['rgba(0,0,0,0.35)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ height: 5, width: '100%' }} />

            <ScrollView style={styles.scrollContainer} 
                contentContainerStyle={{ alignItems: 'center' }}
                scrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                bounces={true}> 
                
                <Text style={[{ fontSize: 60 }]}>Entry List</Text>

                <View style={styles.entries}>
                    <EntryListBox/>
                    <EntryListBox/>
                    <EntryListBox/>
                </View>


                <View style={[{ flexDirection: 'row' }]}>
                    <TouchableOpacity style={styles.testButton} onPress={() => navigation.replace('avatarpage')}>
                        <Text style={styles.testText}>Go to Avatar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.testButton} onPress={() => navigation.replace('login')}>
                        <Text style={styles.testText}>Go to Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 35,
    },

    topContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        padding: 10,
        alignItems: 'center',
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