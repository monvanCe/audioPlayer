import {Button, StyleSheet, View} from 'react-native';
import {audioInput} from './src/utils/audioInput';
import {convertFileToBase64} from './src/utils/fileToBase64';
import {useState} from 'react';
import AudioPlayer from './src/components/AudioPlayer';
import {saveBase64ToFile} from './src/utils/saveB64ToFile';

export default function App() {
  const [audio, setAudio] = useState('');

  const handleClick = async () => {
    //document picker ses seçiyo
    const audioUri = await audioInput();
    if (!audioUri) {
      return null;
    }

    //dosyayı base64'e dönüştürüyo
    const base64data = await convertFileToBase64(audioUri);

    //dosyayı uygulama verisine yazıyo
    const newUri = await saveBase64ToFile(base64data, 'audio.mp3');

    //url'yi formatlıyoruz yoksa tamamlanmıyo
    const formattedUri = 'file:/' + '/' + newUri;

    //formatlanmış url'yi Track Player'a iletiyoruz
    newUri && setAudio(formattedUri);
  };

  /*{audio && (
    <View style={{height: 50, width: '75%'}}>
      <AudioPlayer audioPath={audio} />
    </View>
  )}*/

  return (
    <View style={styles.container}>
      <Button title="Click to select audio" onPress={handleClick} />
      {audio && (
        <View style={{height: 50, width: '75%'}}>
          <AudioPlayer audioPath={audio} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
