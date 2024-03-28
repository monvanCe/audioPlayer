export const convertFileToBase64 = async (uri: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error: any) => {
        reject('Error converting file to base64: ' + error.message);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = () => {
      reject('XHR error: Failed to load the file');
    };
    xhr.open('GET', uri);
    xhr.responseType = 'blob';
    xhr.send();
  });
};
