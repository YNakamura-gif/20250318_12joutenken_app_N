export interface BasicInfo {
  surveyDate: string;
  siteName: string;
  buildingName: string;
}

export interface Deterioration {
  id: number;
  location: string;
  deteriorationName: string;
  photoNumber: string;
}

export interface BuildingData {
  buildingName: string;
  deteriorations: Deterioration[];
  nextId: number;
} 