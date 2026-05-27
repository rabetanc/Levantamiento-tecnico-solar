import React from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { SurveyItemDef, SurveyItemData, CapturedPhoto } from '../types';
import { PhotoUploader } from './PhotoUploader';
import { motion, AnimatePresence } from 'motion/react';

interface SurveyItemCardProps {
  itemDef: SurveyItemDef;
  itemData?: SurveyItemData;
  isOpen: boolean;
  onToggle: () => void;
  onUpdateData: (data: SurveyItemData) => void;
}

export const SurveyItemCard: React.FC<SurveyItemCardProps> = ({ 
  itemDef, 
  itemData, 
  isOpen, 
  onToggle, 
  onUpdateData 
}) => {
  const currentData: SurveyItemData = itemData || {
    itemId: itemDef.id,
    photos: [],
    notes: ''
  };

  const isCompleted = currentData.photos.length > 0 || (!itemDef.isMandatory && currentData.notes.length > 0);

  const handleAddPhoto = (photo: CapturedPhoto) => {
    onUpdateData({
      ...currentData,
      photos: [...currentData.photos, photo]
    });
  };

  const handleRemovePhoto = (photoId: string) => {
    onUpdateData({
      ...currentData,
      photos: currentData.photos.filter(p => p.id !== photoId)
    });
  };

  const handleNotesChange = (notes: string) => {
    onUpdateData({ ...currentData, notes });
  };

  return (
    <div className={`mb-4 rounded-xl border ${isCompleted ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200 bg-white'} shadow-sm overflow-hidden transition-colors`}>
      {/* Header */}
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            {isCompleted ? (
              <CheckCircle2 className="text-blue-500" size={24} />
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center text-xs font-semibold text-slate-500">
                {itemDef.id.split('.')[1]}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg flex items-center gap-2">
              {itemDef.title}
              {itemDef.isMandatory && <span className="text-xs font-bold text-red-500 px-1.5 py-0.5 bg-red-50 rounded bg-opacity-50 border border-red-100">Requerido</span>}
            </h3>
            {!isOpen && (
              <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">{itemDef.purpose}</p>
            )}
            {!isOpen && currentData.photos.length > 0 && (
              <p className="text-xs font-medium text-blue-600 mt-1">{currentData.photos.length} foto(s) capturada(s)</p>
            )}
          </div>
        </div>
        <div className="text-slate-400">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-slate-100">
              
              <div className="flex items-start gap-2 bg-blue-50 text-blue-800 p-3 rounded-lg mb-5 mt-2">
                <AlertCircle className="shrink-0 mt-0.5 text-blue-600" size={18} />
                <p className="text-sm leading-relaxed">{itemDef.purpose}</p>
              </div>

              <div className="mb-5">
                <h4 className="text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Evidencia Fotográfica</h4>
                <PhotoUploader 
                  photos={currentData.photos}
                  onAddPhoto={handleAddPhoto}
                  onRemovePhoto={handleRemovePhoto}
                />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Notas de Campo (Opcional)</h4>
                <textarea 
                  value={currentData.notes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="Observaciones sobre estado, riesgos, distancias adicionales..."
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 bg-white"
                  rows={3}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
