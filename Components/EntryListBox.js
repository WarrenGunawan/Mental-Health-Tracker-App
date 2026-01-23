import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';


function EntryListBox({}) {
    const { width, height, scale, fontScale } = useWindowDimensions();

    const testDate = 'May 13th';
    const testText = 'I have never been able to do this before.';


    return (
        <View style={{ flexDirection: 'col'}}> 
            <View>
                <Text style={styles.date}>{testDate}</Text>
            </View>

            <View style={[ styles.container, { width: (width / 2) - 15, height: 120 }]}>

                <View style={styles.boxContent}>
                    <View style={styles.circle}/>

                    <View style={styles.textContainer}>
                        <Text style={{ margin: 10 }}>{testText}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const testColor = '#0aefff';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 10,
        marginLeft: 10,
        backgroundColor: '#DDDDDD',
        borderRadius: 15,

    },

    date: {
        color: '#666666',
        marginLeft: 20,
    },

    boxContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },

    textContainer: {
        backgroundColor: '#BBBBBB',

        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

        marginVertical: 5,
        marginLeft: 10,
        height: '100%',

        borderRadius: 10,

    },

    circle: {
        width: 30,
        height: 30,
        borderRadius: 5,
        borderWidth: 3,
        borderColor: 'rgba(0,0,0,0.2)',
        backgroundColor: testColor,
    },
});


export default EntryListBox