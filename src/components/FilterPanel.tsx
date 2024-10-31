import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import {
  Sliders,
  Download,
  Palette,
  RotateCcw,
  Contrast,
  SunMedium,
  ImageIcon,
  Crop,
  Maximize
} from 'lucide-react';
import { FilterSettings, PresetFilter, ImageDimensions } from '../types';
import FilterPresets from './FilterPresets';

interface FilterPanelProps {
  image: string | null;
  filters: FilterSettings;
  setFilters: React.Dispatch<React.SetStateAction<FilterSettings>>;
  activePreset: PresetFilter | null;
  setActivePreset: React.Dispatch<React.SetStateAction<PresetFilter | null>>;
  onReset: () => void;
  dimensions: ImageDimensions;
  setDimensions: (dimensions: ImageDimensions) => void;
  originalDimensions: ImageDimensions;
  isCropping: boolean;
  toggleCropping: () => void;
}

export default function FilterPanel({
  image,
  filters,
  setFilters,
  activePreset,
  setActivePreset,
  onReset,
  dimensions,
  setDimensions,
  originalDimensions,
  isCropping,
  toggleCropping
}: FilterPanelProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

  const handleFilterChange = (name: keyof FilterSettings, value: number) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setActivePreset(null);
  };

  const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
    if (maintainAspectRatio) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      if (dimension === 'width') {
        setDimensions({
          width: value,
          height: Math.round(value / aspectRatio)
        });
      } else {
        setDimensions({
          width: Math.round(value * aspectRatio),
          height: value
        });
      }
    } else {
      setDimensions(prev => ({
        ...prev,
        [dimension]: value
      }));
    }
  };

  const handleDownload = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      if (ctx) {
        if (activePreset) {
          ctx.filter = activePreset.filter;
        } else {
          ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px)`;
        }
        ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
        const link = document.createElement('a');
        link.download = 'edited-image.png';
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      }
    };
    img.src = image;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-800 rounded-xl p-6"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Sliders className="w-5 h-5" />
            Adjustments
          </h2>
          <button
            onClick={onReset}
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="space-y-6">
          {image && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Maximize className="w-4 h-4" />
                Image Size
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400">Width (px)</label>
                  <input
                    type="number"
                    value={dimensions.width}
                    onChange={(e) => handleDimensionChange('width', Number(e.target.value))}
                    className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Height (px)</label>
                  <input
                    type="number"
                    value={dimensions.height}
                    onChange={(e) => handleDimensionChange('height', Number(e.target.value))}
                    className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={maintainAspectRatio}
                  onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                  className="rounded text-blue-500"
                />
                <label className="text-sm text-gray-400">Maintain aspect ratio</label>
              </div>
              <button
                onClick={toggleCropping}
                className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  isCropping
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <Crop className="w-4 h-4" />
                {isCropping ? 'Finish Cropping' : 'Crop Image'}
              </button>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Preset Filters
            </h3>
            <FilterPresets
              activePreset={activePreset}
              onSelect={setActivePreset}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm mb-2">
                <SunMedium className="w-4 h-4" />
                Brightness
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={filters.brightness}
                onChange={(e) => handleFilterChange('brightness', Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm mb-2">
                <Contrast className="w-4 h-4" />
                Contrast
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={filters.contrast}
                onChange={(e) => handleFilterChange('contrast', Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm mb-2">
                <Palette className="w-4 h-4" />
                Saturation
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={filters.saturation}
                onChange={(e) => handleFilterChange('saturation', Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm mb-2">Blur</label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={filters.blur}
                onChange={(e) => handleFilterChange('blur', Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="flex items-center gap-2 text-sm"
              >
                <div
                  className="w-6 h-6 rounded-full border-2 border-white"
                  style={{ backgroundColor: filters.backgroundColor }}
                />
                Background Color
              </button>
              
              <AnimatePresence>
                {showColorPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute z-10 mt-2"
                  >
                    <HexColorPicker
                      color={filters.backgroundColor}
                      onChange={(color) => setFilters(prev => ({ ...prev, backgroundColor: color }))}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {image && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownload}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mt-6 flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Edited Image
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );