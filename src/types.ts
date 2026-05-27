export interface SurveyItemDef {
  id: string;
  moduleId: string;
  title: string;
  purpose: string;
  isMandatory: boolean;
}

export interface SurveyModuleDef {
  id: string;
  title: string;
  items: SurveyItemDef[];
}

export interface CapturedPhoto {
  id: string;
  dataUrl: string; // base64
  timestamp: number;
}

export interface SurveyItemData {
  itemId: string;
  photos: CapturedPhoto[];
  notes: string;
}

export interface Survey {
  id: string;
  projectName: string;
  dateCreated: number;
  dateUpdated: number;
  status: 'DRAFT' | 'COMPLETED' | 'SYNCED';
  itemsData: Record<string, SurveyItemData>;
}
