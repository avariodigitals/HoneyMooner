import React from 'react';
import { IKContext, IKUpload } from 'imagekitio-react';

const publicKey = 'public_ZvsQ/Q2eZv45QUJYbHzTMM+SrOc=';
const urlEndpoint = 'https://ik.imagekit.io/360t0n1jd9'; // Derived from your provided asset URLs
const authenticationEndpoint = 'http://localhost:3001/auth'; // You will need a backend for this in production

export interface ImageKitError {
  message: string;
  help?: string;
  [key: string]: string | number | boolean | undefined | null;
}

export interface ImageKitUploadResponse {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height: number;
  width: number;
  size: number;
  fileType: string;
  filePath: string;
}

interface ImageKitUploadProps {
  onSuccess: (url: string) => void;
  onError: (error: ImageKitError) => void;
  folder?: string;
}

export const ImageKitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <IKContext 
      publicKey={publicKey} 
      urlEndpoint={urlEndpoint} 
      authenticationEndpoint={authenticationEndpoint}
    >
      {children}
    </IKContext>
  );
};

export const ImageUpload: React.FC<ImageKitUploadProps> = ({ onSuccess, onError, folder = '/packages' }) => {
  return (
    <IKUpload
      fileName="package-image.jpg"
      tags={["package", "travel"]}
      useUniqueFileName={true}
      folder={folder}
      onSuccess={(res: ImageKitUploadResponse) => onSuccess(res.url)}
      onError={onError}
      className="hidden"
      id="ik-upload"
    />
  );
};
