import { conversionDefinitions } from '../definitions';

/**
 * it converts base64 url to required format by adding missing parts
 * if base64Data string does not include mimeType,
 * mimeType has to be provided
 * @param param0 @type Omit<Base64Input, 'fileName'>
 * @returns string
 */
export const constructBase64Url = ({
  base64Data,
  mimeType,
}: Omit<conversionDefinitions.Base64Input, 'fileName'>): string => {
  let constructedUrl = '';

  const hasDataTag = /^data:/;
  const hasDataAndMimeType = /^data:.+;/;
  const hasAll = /^data:.+;base64,/;

  if (hasAll.test(base64Data)) {
    constructedUrl = base64Data;
  } else if (hasDataAndMimeType.test(base64Data)) {
    const splitBySemicolon = base64Data.split(';');
    constructedUrl = `${splitBySemicolon[0]};base64,${splitBySemicolon[1]}`;
  } else if (hasDataTag.test(base64Data)) {
    if (!mimeType) {
      throw Error('Mime type could not found ');
    }

    constructedUrl = base64Data.replace('data:', '');

    constructedUrl = `data:${mimeType};base64,${constructedUrl}`;
  } else {
    if (!mimeType) {
      throw Error('Mime type could not found ');
    }

    constructedUrl = `data:${mimeType};base64,${base64Data}`;
  }

  return constructedUrl;
};

/**
 * It checks if base64 data is ObjectURL or not
 * @param base64Data @type string
 * @returns
 */
export const isObjectURL = (base64Data: string): boolean => /^blob/.test(base64Data);
