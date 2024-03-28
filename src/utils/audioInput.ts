import DocumentPicker from 'react-native-document-picker';

export const audioInput = async () => {
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.audio],
    });
    // Seçilen dosyanın verileri alınıyor
    const {uri} = res[0];

    return uri;
  } catch (error) {
    if (DocumentPicker.isCancel(error)) {
      // Kullanıcı seçim işlemi iptal etti
      console.log('Seçim işlemi iptal edildi');
    } else {
      // Başka bir hata meydana geldi
      console.error('Bir hata oluştu:', error);
    }
  }
};
