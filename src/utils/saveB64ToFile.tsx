import RNFS from 'react-native-fs';

export const saveBase64ToFile = async (
  base64Data: string,
  filename: string,
) => {
  try {
    const filePath = `${RNFS.DocumentDirectoryPath}/${filename}`;
    await RNFS.writeFile(filePath, base64Data, 'base64');

    return filePath;
  } catch (error) {
    console.error('Dosya kaydedilirken hata oluştu:', error);
  }
};
