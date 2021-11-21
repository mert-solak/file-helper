export type Base64Input = {
  base64Data: string;
  fileName: string;
  mimeType?: string;
};

export type Transformation = {
  base64URLParam: string;
  mimeTypeParam?: string;
};

export type TransformationOutput = [Uint8Array, string];

export type DownloadContent = Base64Input | File;
