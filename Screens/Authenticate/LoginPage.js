import { StyleSheet, Text, TouchableOpacity, View, TextInput, KeyboardAvoidingView } from "react-native";
import { useNavigation } from "@react-navigation/core";

const LoginPage = () => {

    const navigation = useNavigation();


    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'> 
            <Text style={[{ fontSize: 60 }]}>Login Page</Text>

            <TextInput style={styles.input} placeholder='Email' autoCorrect={false}></TextInput>
            <TextInput style={styles.input} placeholder='Password' autoCorrect={false}></TextInput>

            <View style={[{ flexDirection: 'row' }]}>
                <TouchableOpacity style={styles.testButton} onPress={() => navigation.replace('signup')}>
                    <Text style={styles.testText}>Go to Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.testButton} onPress={() => navigation.replace('avatarpage')}>
                    <Text style={styles.testText}>Go to Avatar</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
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

    input: {
        padding: 5,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: 'green',
        margin: 5,
    }
})

export default LoginPage;