import React, { useRef, useState } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { CapturedPhoto } from '../types';

interface PhotoUploaderProps {
  photos: CapturedPhoto[];
  onAddPhotos: (photos: CapturedPhoto[]) => void;
  onRemovePhoto: (photoId: string) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ photos, onAddPhotos, onRemovePhoto }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Compress image using Canvas API to preserve mobile performance
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7)); // 70% quality JPEG
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsProcessing(true);
      const newPhotos: CapturedPhoto[] = [];
      const files = Array.from(e.target.files);
      
      for (const file of files) {
        const dataUrl = await compressImage(file);
        newPhotos.push({
          id: Math.random().toString(36).substring(7),
          dataUrl,
          timestamp: Date.now(),
        });
      }
      
      onAddPhotos(newPhotos);
      e.target.value = '';
      setIsProcessing(false);
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
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Camera size={20} />}
          <span>Cámara</span>
        </button>
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-lg font-medium transition-colors border border-slate-300 disabled:opacity-50"
        >
          {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
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
