import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';


function EntryListBox({}) {
    const { width, height, scale, fontScale } = useWindowDimensions();

    const testDate = 'May 13th';
    const testText = 'I have ';


    return (
        <View style={{ flexDirection: 'col'}}> 
            <View>
                <Text style={styles.date}>{testDate}</Text>
            </View>

            <View style={[ styles.container, { width: (width / 2) - 10, height: 70 }]}>

                <View style={styles.boxContent}>
                    <View style={styles.circle}/>
                    <Text>{testText}</Text>
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
        margin: 5,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 15,
    },

    date: {
        color: 'rgba(0,0,0,0.5)',
    },

    boxContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },

    circle: {
        width: 20,
        height: 20,
        borderRadius: 5,
        backgroundColor: testColor,
    },
});


export default EntryListBox