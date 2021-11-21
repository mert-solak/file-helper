import { createWebWorker } from '@mertsolak/web-worker-helper';

import { base64Helper } from './helpers';
import { conversionConfig } from './configs';
import { conversionDefinitions } from './definitions';

/**
 * It downloads files that is in base64 format,
 * if base64Data string does not include mimeType,
 * mimeType has to be provided
 * @param param0 @type Base64Input
 */
const downloadBase64 = ({ base64Data, fileName, mimeType }: conversionDefinitions.Base64Input) => {
  const aElement = document.createElement('a');

  if (base64Helper.isObjectURL(base64Data)) {
    aElement.href = base64Data;
  } else {
    aElement.href = base64Helper.constructBase64Url({ base64Data, mimeType });
  }

  aElement.download = fileName;
  aElement.click();
};

/**
 * It creates ObjectURL and downloads the file
 * @param file @type File
 */
const downloadFile = (file: File) => {
  const objectURL = URL.createObjectURL(file);

  downloadBase64({ base64Data: objectURL, fileName: file.name });
};

/**
 * It converts base64 format to File format
 * base64Data has to be in correct format
 * mimeType will overwrite already included
 * in base64Data if provided
 * It uses webWorker if data is bigger
 * then the number specified in config file
 * @param param0 @type Base64Input
 * @returns Promise<File>
 */
export const convertBase64ToFile = ({
  base64Data,
  fileName,
  mimeType,
}: conversionDefinitions.Base64Input): Promise<File> =>
  new Promise((resolve, reject) => {
    /**
     * It transforms base64Data to Unit8Array
     * and returns it with mimeType
     * @param param0 @type Transformation
     * @returns TransformationOutput
     */
    const transformation = ({
      base64URLParam,
      mimeTypeParam,
    }: conversionDefinitions.Transformation): conversionDefinitions.TransformationOutput => {
      const [dataInfo, data] = base64URLParam.split(',');
      let exactMimeType = mimeTypeParam;

      if (!exactMimeType) {
        exactMimeType = dataInfo.match(/^data:(.*?);/)?.[1];
      }

      if (!exactMimeType) {
        reject(Error('Mime type could not found '));
      }

      const decodedData = atob(data);
      const decodedDataLength = decodedData.length;
      const uIntData = new Uint8Array(decodedDataLength);

      for (let index = 0; index < decodedDataLength; index += 1) {
        uIntData[index] = decodedData.charCodeAt(index);
      }

      return [uIntData, exactMimeType];
    };

    /**
     * It gets transformation data from webWorker
     * @param param0 @type TransformationOutput
     */
    const getWorkerResult = ([uIntData, exactMimeType]: conversionDefinitions.TransformationOutput) => {
      resolve(new File([uIntData], fileName, { type: exactMimeType }));
    };

    try {
      if (Worker && base64Data.length >= conversionConfig.base64ToFileConfig.webWorkerBreakpointLength) {
        createWebWorker(
          {
            base64URLParam: base64Data,
            mimeTypeParam: mimeType,
          },
          transformation,
          getWorkerResult,
        );
      } else {
        const [uIntData, exactMimeType] = transformation({
          base64URLParam: base64Data,
          mimeTypeParam: mimeType,
        });
        resolve(new File([uIntData], fileName, { type: exactMimeType }));
      }
    } catch (error) {
      reject(error);
    }
  });

/**
 * It converts File format to Base64 Format
 * @param file @type File
 * @returns Promise<string>
 */
export const convertFileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result.toString());
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });

/**
 * It downloads the file in File or Base64 format
 * @param downloadContent @type DownloadContent
 * @returns null
 */
export const download = (downloadContent: conversionDefinitions.DownloadContent) => {
  if (downloadContent instanceof File) {
    downloadFile(downloadContent);
    return;
  }

  downloadBase64(downloadContent);
};
