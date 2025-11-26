import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/core";

import Entypo from '@expo/vector-icons/Entypo';

const AvatarPage = () => {

    const navigation = useNavigation();

    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'short' });
    let date = currentDate.getDate();

    const lastNum = date % 10;
    if(lastNum == 1) {
        date += "st";
    } else if(lastNum == 2) {
        date += "nd";
    } else if(lastNum == 3) {
        date += "rd";
    } else {
        date += "th";
    }

    const formattedDate = `${month} ${date}`;


    return (
        <View style={styles.container} > 
            <View style={styles.topContainer}>
                <TouchableOpacity>
                    <Text>Entry List</Text>
                </TouchableOpacity>

                <Text style={{ fontSize: 20 }}>{formattedDate}</Text>

                 <TouchableOpacity>
                    <Text>Options</Text>
                </TouchableOpacity>

            </View>

            <View style={{ color: 'black', width: '100%', borderWidth: 5 }}/>

            <View style={styles.avatarContainer}>
                <View style={{ flexDirection: 'row', columnGap: 2, marginLeft: -5 }}>
                    {[...Array(3)].map((_, i) => (
                        <Text key={i} style={{ fontSize: 70 }}>•</Text>
                    ))}
                </View>

                <Text style={[{ fontSize: 60, fontWeight: 'bold' }]}>Avatar</Text>

                <View style={{ flexDirection: 'row', columnGap: 2, marginRight: -5 }}>
                    {[...Array(3)].map((_, i) => (
                        <Text key={i} style={{ fontSize: 70 }}>•</Text>
                    ))}
                </View>
            </View>
            <Entypo name="github" size={300}/>

            <View style={{ flexDirection: 'row', columnGap: 2, width: '100%', justifyContent: 'center', marginTop: -20, marginBottom: -20  }}>
                {[...Array(30)].map((_, i) => (
                    <Text key={i} style={{ fontSize: 70 }}>•</Text>
                ))}
            </View>

                


            <View style={[{ flexDirection: 'col' }, styles.inputContainer]}>
                <TouchableOpacity style={styles.testButton} onPress={() => navigation.replace('entrylist')}>
                    <Text style={styles.testText}>Go to Entry List</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.testButton} onPress={() => navigation.replace('login')}>
                    <Text style={styles.testText}>Go to Login</Text>
                </TouchableOpacity>
            </View>        
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        paddingTop: 40,
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

    avatarContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: -10,
    },

    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        padding: 10,
        alignItems: 'center',
    },

    inputContainer: {
        flex: 1,
        padding: 50,
        borderWidth: 10,
        borderRadius: 30,
        borderColor: 'black',
        marginVertical: 20,
    },
})

export default AvatarPage;