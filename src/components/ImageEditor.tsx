import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Image } from 'lucide-react';
import ImagePreview from './ImagePreview';
import FilterPanel from './FilterPanel';
import { FilterSettings, PresetFilter, ImageDimensions } from '../types';

export default function ImageEditor() {
  const [image, setImage] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<ImageDimensions>({ width: 0, height: 0 });
  const [dimensions, setDimensions] = useState<ImageDimensions>({ width: 0, height: 0 });
  const [filters, setFilters] = useState<FilterSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    backgroundColor: '#ffffff'
  });
  const [activePreset, setActivePreset] = useState<PresetFilter | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
          setDimensions({ width: img.width, height: img.height });
        };
        img.src = reader.result as string;
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      backgroundColor: '#ffffff'
    });
    setActivePreset(null);
  };

  const toggleCropping = () => {
    setIsCropping(!isCropping);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <Image className="w-8 h-8" />
            Sleek Image Editor
          </h1>
          <p className="text-gray-400">Transform your images with powerful editing tools</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ImagePreview
              image={image}
              filters={filters}
              activePreset={activePreset}
              dropzoneProps={{ getRootProps, getInputProps, isDragActive }}
              isCropping={isCropping}
              setImage={setImage}
              dimensions={dimensions}
              setDimensions={setDimensions}
              toggleCropping={toggleCropping}
            />
          </div>

          <FilterPanel
            image={image}
            filters={filters}
            setFilters={setFilters}
            activePreset={activePreset}
            setActivePreset={setActivePreset}
            onReset={resetFilters}
            dimensions={dimensions}
            setDimensions={setDimensions}
            originalDimensions={originalDimensions}
            isCropping={isCropping}
            toggleCropping={toggleCropping}
          />
        </div>
      </div>
    </div>
  );
}