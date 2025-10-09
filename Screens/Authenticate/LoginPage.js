import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/core";

const LoginPage = () => {

    const navigation = useNavigation();


    return (
        <View style={styles.container} > 
            <Text style={[{ fontSize: 60 }]}>Login Page</Text>

            <View style={[{ flexDirection: 'row' }]}>
                <TouchableOpacity style={styles.testButton} onPress={() => navigation.replace('signup')}>
                    <Text style={styles.testText}>Go to Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.testButton} onPress={() => navigation.replace('avatarpage')}>
                    <Text style={styles.testText}>Go to Avatar</Text>
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

export default LoginPage;