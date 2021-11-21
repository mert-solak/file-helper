## File Helper

Package for file management/conversion/download in javascript/typescript

![npm](https://img.shields.io/npm/v/@mertsolak/file-helper)
![license](https://img.shields.io/npm/l/@mertsolak/file-helper)
![size](https://img.shields.io/bundlephobia/min/@mertsolak/file-helper)
![issue](https://img.shields.io/github/issues/mert-solak/file-helper)

## Installation

Use node package manager to install @mertsolak/file-helper.

```bash
npm i @mertsolak/file-helper
```

## Basic Usage

```typescript
import { convertBase64ToFile, convertFileToBase64, download } from '@mertsolak/file-helper';

// if base64Data does not include mimeType,
// mimeType has to be provided
const imageInFileFormat = await convertBase64ToFile({
  base64Data: 'data:image/jpeg;base64,...',
  fileName: 'image.jpg',
});
const imageInBase64Format = await convertFileToBase64(imageInFileFormat);

// it can download both format
download(imageInFileFormat);
download(imageInBase64Format);
```
