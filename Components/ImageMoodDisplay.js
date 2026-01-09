import { Image } from 'react-native';

import moodImages from '../assets/moodImages';

function ImageMoodDisplay({ selectedValue }) {

    const moodMap = {
        1: 'happiest',
        2: 'happy',
        3: 'neutral',
        4: 'sad',
        5: 'saddest',
        6: 'thinking'
    };

    let moodId = moodMap[selectedValue];

    if(selectedValue === null) {
        moodId = moodMap[6];
    }

    const imageSource = moodImages.find(
    m => m.id === moodId
    )?.image;

    if (!imageSource) return null;

    return <Image source={imageSource} style={{ width: 250, height: 250, borderRadius: 15, marginBottom: 20 }} />;
}


export default ImageMoodDisplay;