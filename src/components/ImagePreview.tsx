import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { FilterSettings, PresetFilter, ImageDimensions } from '../types';

interface ImagePreviewProps {
  image: string | null;
  filters: FilterSettings;
  activePreset: PresetFilter | null;
  dropzoneProps: {
    getRootProps: () => any;
    getInputProps: () => any;
    isDragActive: boolean;
  };
  isCropping: boolean;
  setImage: (image: string | null) => void;
  dimensions: ImageDimensions;
  setDimensions: (dimensions: ImageDimensions) => void;
  toggleCropping: () => void;
}

export default function ImagePreview({
  image,
  filters,
  activePreset,
  dropzoneProps,
  isCropping,
  setImage,
  dimensions
}: ImagePreviewProps) {
  const { getRootProps, getInputProps, isDragActive } = dropzoneProps;
  const [crop, setCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const getFilterStyle = () => {
    if (activePreset) {
      return activePreset.filter;
    }
    return `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px)`;
  };

  const onCropComplete = (crop: Crop) => {
    if (!imgRef.current || !crop.width || !crop.height) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(
        imgRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImage(reader.result as string);
          };
          reader.readAsDataURL(blob);
        }
      });
    }
  };

  return (
    <motion.div
      className="bg-gray-800 rounded-xl p-6 h-[500px] flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: filters.backgroundColor }}
    >
      {!image ? (
        <div
          {...getRootProps()}
          className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gray-500 transition-colors"
        >
          <input {...getInputProps()} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-6"
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-400">
              {isDragActive ? "Drop your image here" : "Drag & drop an image or click to select"}
            </p>
          </motion.div>
        </div>
      ) : isCropping ? (
        <ReactCrop
          crop={crop}
          onChange={c => setCrop(c)}
          onComplete={onCropComplete}
          aspect={undefined}
        >
          <img
            ref={imgRef}
            src={image}
            alt="Crop preview"
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              width: dimensions.width,
              height: dimensions.height
            }}
          />
        </ReactCrop>
      ) : (
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          src={image}
          alt="Uploaded image"
          className="max-h-full max-w-full object-contain rounded-lg"
          style={{
            filter: getFilterStyle(),
            width: dimensions.width,
            height: dimensions.height
          }}
        />
      )}
    </motion.div>
  );