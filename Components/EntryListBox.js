import { View, Text, StyleSheet } from 'react-native';



function EntryListBox({ entry }) {
    const { dateKey, shortDate, mood, notes, updatedAt } = entry;

    let color = '';
    if(mood == 1) {
        color = '#36CEDC';
    } else if(mood == 2) {
        color = '#8FE968';
    } else if(mood == 3) {
        color = '#FFEA56';
    } else if(mood == 4) {
        color = '#FFB750';
    } else {
        color = '#FE797B';
    }



    return (
        <View style={[ styles.container ]}>
            <View style={{ flexDirection: 'col'}}> 
                <View>
                    <Text style={styles.date}>{shortDate}</Text>
                </View>

                <View style={[ styles.entryContainer ]}>

                    <View style={styles.boxContent}>
                        <View style={[styles.circle, { backgroundColor: color }]}/>

                        <View style={styles.textContainer}>
                            <Text style={{ margin: 10 }} ellipsizeMode="tail">{notes}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },

    entryContainer: {
        flexDirection: 'row',
        marginVertical: 10,

        backgroundColor: '#DDDDDD',
        borderRadius: 15,

        width: '90%',
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

        marginLeft: 10,

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