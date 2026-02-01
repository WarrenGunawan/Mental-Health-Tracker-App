import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';



function EntryListBox({ entry }) {
    const { width } = useWindowDimensions();

    const { dateKey, shortDate, mood, notes, updatedAt } = entry;

    let color = '';
    if(mood == 1) {
        color = '#36CEDC';
    } else if(mood == 2) {
        color = '#8FE968';
    } else if(mood == 3) {
        color = '#FFEA56';
    } else if(mood == 3) {
        color = '#FFB750';
    } else {
        color = '#FE797B';
    }



    return (
        <View style={{ flexDirection: 'col'}}> 
            <View>
                <Text style={styles.date}>{shortDate}</Text>
            </View>

            <View style={[ styles.container, { width: (width / 2) - 15, height: 120 }]}>

                <View style={styles.boxContent}>
                    <View style={[styles.circle, { backgroundColor: color }]}/>

                    <View style={styles.textContainer}>
                        <Text style={{ margin: 10 }}>{notes}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

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
        backgroundColor: 'white',

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
        height: '100%',
        borderRadius: 10,
        borderWidth: 3,
        borderColor: 'rgba(0,0,0,0.2)',
    },
});


export default EntryListBox