import React, { useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { CapturedPhoto } from '../types';

interface PhotoUploaderProps {
  photos: CapturedPhoto[];
  onAddPhoto: (photo: CapturedPhoto) => void;
  onRemovePhoto: (photoId: string) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ photos, onAddPhoto, onRemovePhoto }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            onAddPhoto({
              id: Math.random().toString(36).substring(7),
              dataUrl: event.target.result as string,
              timestamp: Date.now(),
            });
          }
        };
        reader.readAsDataURL(file);
      });
      // reset input
      e.target.value = '';
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-3 mb-4">
        {/* Hidden inputs */}
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          className="hidden" 
          ref={cameraInputRef}
          onChange={handleFileChange}
        />
        <input 
          type="file" 
          accept="image/*" 
          multiple 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        
        <button 
          onClick={() => cameraInputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
        >
          <Camera size={20} />
          <span>Cámara</span>
        </button>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-lg font-medium transition-colors border border-slate-300"
        >
          <Upload size={20} />
          <span>Galería</span>
        </button>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map(photo => (
            <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
              <img src={photo.dataUrl} alt="Captured" className="w-full h-full object-cover" />
              <button 
                onClick={() => onRemovePhoto(photo.id)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
