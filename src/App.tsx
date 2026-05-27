/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SURVEY_MODULES } from './data';
import { Survey, SurveyItemData } from './types';
import { SurveyItemCard } from './components/SurveyItemCard';
import { Save, CloudOff, Sun, FileCheck2, User, Building, MapPin } from 'lucide-react';

const STORAGE_KEY = 'paisolar_current_survey';

export default function App() {
  const [survey, setSurvey] = useState<Survey>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved survey', e);
      }
    }
    return {
      id: Math.random().toString(36).substring(7),
      projectName: '',
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
      status: 'DRAFT',
      itemsData: {},
    };
  });

  const [openItemId, setOpenItemId] = useState<string | null>('1.1');
  const [isSaved, setIsSaved] = useState(true);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(survey));
    setIsSaved(true);
    const timer = setTimeout(() => setIsSaved(false), 2000); // just visual feedback
    return () => clearTimeout(timer);
  }, [survey]);

  const updateItemData = (data: SurveyItemData) => {
    setSurvey(prev => ({
      ...prev,
      dateUpdated: Date.now(),
      itemsData: {
        ...prev.itemsData,
        [data.itemId]: data
      }
    }));
  };

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSurvey(prev => ({ ...prev, projectName: e.target.value, dateUpdated: Date.now() }));
  };

  const calculateProgress = () => {
    let totalMandatory = 0;
    let completedMandatory = 0;
    
    SURVEY_MODULES.forEach(mod => {
      mod.items.forEach(item => {
        if (item.isMandatory) {
          totalMandatory++;
          const data = survey.itemsData[item.id];
          if (data && data.photos.length > 0) {
            completedMandatory++;
          }
        }
      });
    });

    return { total: totalMandatory, completed: completedMandatory, percentage: Math.round((completedMandatory / totalMandatory) * 100) };
  };

  const progress = calculateProgress();

  const handleExport = () => {
    if (progress.completed < progress.total) {
      try {
        const confirmPrint = window.confirm(`Faltan ${progress.total - progress.completed} campos obligatorios por completar. ¿Deseas descargar el PDF de todas formas?`);
        if (!confirmPrint) return;
      } catch (e) {
        // Fallback si el iframe bloquea modales
        console.warn('Confirm dialog blocked, proceeding to export anyway.');
      }
    }
    
    // Generar PDF imprimiendo (ideal para móviles y navegadores que tienen "Save as PDF")
    setSurvey(prev => ({ ...prev, status: 'SYNCED' }));
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <>
    {/* Main Application - Hidden during print */}
    <div className="min-h-screen bg-slate-50 font-sans pb-24 text-slate-900 print:hidden">
      {/* Header */}
      <header className="bg-[#002f6c] text-white sticky top-0 z-10 shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="text-yellow-400 fill-yellow-400" size={28} />
            <div>
              <h1 className="font-bold text-lg leading-tight">Levantamiento<br/>Técnico Solar</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-blue-100 bg-blue-900/50 px-2 py-1 rounded">
              <CloudOff size={14} />
              <span>Offline Ready</span>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-[#001a40] h-1.5 w-full">
          <div 
            className="bg-yellow-400 h-full transition-all duration-500 ease-out" 
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 pt-6 space-y-6">
        
        {/* Project Info Card */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileCheck2 className="text-blue-600" size={20} />
              Datos del Proyecto
            </h2>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${survey.status === 'SYNCED' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
              {survey.status}
            </span>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1"><Building size={14}/> Nombre Cliente / Proyecto</label>
              <input 
                type="text" 
                value={survey.projectName}
                onChange={handleProjectNameChange}
                placeholder="Ej: Finca La Esperanza - 15kWp"
                className="w-full border-b-2 border-slate-200 bg-slate-50 rounded-t px-3 py-2 text-slate-800 focus:border-blue-600 focus:bg-blue-50/30 outline-none transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Survey Modules */}
        <div className="space-y-8">
          {SURVEY_MODULES.map((module) => (
            <section key={module.id}>
              <h2 className="text-base font-bold text-slate-800 mb-4 px-1 border-l-4 border-blue-500 pl-3">
                {module.title}
              </h2>
              <div className="space-y-3">
                {module.items.map(item => (
                  <SurveyItemCard 
                    key={item.id}
                    itemDef={item}
                    itemData={survey.itemsData[item.id]}
                    isOpen={openItemId === item.id}
                    onToggle={() => setOpenItemId(openItemId === item.id ? null : item.id)}
                    onUpdateData={updateItemData}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
        
      </main>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800">Progreso: {progress.percentage}%</p>
            <p className="text-xs text-slate-500">{progress.completed} de {progress.total} obligatorios</p>
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-sm transition-all bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
          >
            <Save size={20} />
            Descargar PDF
          </button>
        </div>
      </div>
    </div>

    {/* Print Report - Only visible during printing */}
    <div className="hidden print:block font-sans text-slate-900 bg-white p-8">
      <div className="mb-6 border-b-2 border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-[#002f6c]">Levantamiento Técnico Solar</h1>
        <h2 className="text-xl font-semibold mt-2">Proyecto: {survey.projectName || 'Sin nombre'}</h2>
        <p className="text-sm text-slate-500 mt-1">Fecha: {new Date(survey.dateUpdated).toLocaleString()}</p>
        <p className="text-sm font-semibold mt-2">
          Progreso General: {progress.completed} de {progress.total} campos requeridos completados
        </p>
      </div>

      <div className="space-y-8">
        {SURVEY_MODULES.map(module => (
          <div key={module.id} className="mb-8">
            <h3 className="text-xl font-bold border-b border-blue-500 text-blue-900 mb-4 pb-1">{module.title}</h3>
            {module.items.map(item => {
              const data = survey.itemsData[item.id];
              const isFilled = data && (data.photos.length > 0 || data.notes);
              
              if (!isFilled) {
                return (
                  <div key={item.id} className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between opacity-50">
                    <h4 className="text-md font-bold text-slate-500">{item.id} {item.title}</h4>
                    <span className="text-xs text-red-500 border border-red-500 px-2 py-1 rounded">No completado</span>
                  </div>
                );
              }

              return (
                <div key={item.id} className="mb-6 pb-4 border-b border-slate-100 break-inside-avoid">
                  <h4 className="text-md font-bold mb-2 text-slate-800">{item.id} {item.title}</h4>
                  
                  {data.notes && (
                    <div className="mb-3 bg-slate-50 p-3 border border-slate-200 rounded-lg">
                      <p className="text-sm text-slate-700 font-medium">Notas:</p>
                      <p className="text-sm text-slate-800 whitespace-pre-wrap">{data.notes}</p>
                    </div>
                  )}
                  
                  {data.photos.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {data.photos.map((photo, idx) => (
                        <div key={photo.id} className="aspect-square bg-slate-100 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
                          <img src={photo.dataUrl} className="w-full h-full object-cover" alt={`Evidencia ${idx + 1}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
