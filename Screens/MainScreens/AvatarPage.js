import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/core";

const AvatarPage = () => {

    const navigation = useNavigation();


    return (
        <View style={styles.container} > 
            <Text style={[{ fontSize: 60 }]}>Avatar</Text>


            <View style={[{ flexDirection: 'row' }]}>
                <TouchableOpacity style={styles.testButton} onPress={() => navigation.replace('dailyentry')}>
                    <Text style={styles.testText}>Go to Daily Entry</Text>
                </TouchableOpacity>

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
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
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
})

export default AvatarPage;