import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PresetFilter } from '../types';

interface FilterPresetsProps {
  activePreset: PresetFilter | null;
  onSelect: (preset: PresetFilter) => void;
}

const presets: PresetFilter[] = [
  { name: 'None', filter: 'none' },
  { name: 'B&W', filter: 'grayscale(100%)' },
  { name: 'Sepia', filter: 'sepia(100%)' },
  { name: 'Vintage', filter: 'sepia(50%) contrast(120%) brightness(90%)' },
  { name: 'Cool', filter: 'saturate(150%) hue-rotate(30deg)' },
  { name: 'Warm', filter: 'saturate(150%) hue-rotate(-30deg)' },
  { name: 'High Contrast', filter: 'contrast(150%) brightness(90%)' },
  { name: 'Dramatic', filter: 'contrast(150%) brightness(90%) saturate(150%)' }
];

const PREVIEW_IMAGE = "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=200&h=200&fit=crop&q=80";

export default function FilterPresets({ activePreset, onSelect }: FilterPresetsProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 200;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group">
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {presets.map((preset) => (
          <motion.button
            key={preset.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(preset)}
            className={`flex-shrink-0 focus:outline-none ${
              activePreset?.name === preset.name
                ? 'ring-2 ring-blue-500'
                : ''
            }`}
          >
            <div className="w-24 space-y-2">
              <div className="relative rounded-lg overflow-hidden aspect-square">
                <img
                  src={PREVIEW_IMAGE}
                  alt={preset.name}
                  className="w-full h-full object-cover"
                  style={{ filter: preset.filter }}
                />
                {activePreset?.name === preset.name && (
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-20" />
                )}
              </div>
              <p className={`text-xs text-center font-medium ${
                activePreset?.name === preset.name
                  ? 'text-blue-500'
                  : 'text-gray-300'
              }`}>
                {preset.name}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-6 h-6 text-white bg-gray-900 bg-opacity-50 rounded-full p-1" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-6 h-6 text-white bg-gray-900 bg-opacity-50 rounded-full p-1" />
      </button>
    </div>
  );
}