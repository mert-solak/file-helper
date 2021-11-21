export const convertBase64ToFile = (base64URL: string, filename: string): File => {
  const [dataInfo, data] = base64URL.split(',');

  const mimeType = dataInfo.match(/:(.*?);/)[1];
  const decodedData = atob(data);
  const decodedDataLength = decodedData.length;
  const uIntData = new Uint8Array(decodedDataLength);

  for (let index = 0; index < decodedDataLength; index += 1) {
    uIntData[index] = decodedData.charCodeAt(index);
  }

  return new File([uIntData], filename, { type: mimeType });
};
