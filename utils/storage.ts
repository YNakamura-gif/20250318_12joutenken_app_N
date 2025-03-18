import { BasicInfo, BuildingData } from '../types';

const BASIC_INFO_KEY = '12joutenken_basic_info';
const BUILDINGS_DATA_KEY = '12joutenken_buildings_data';

export const saveBasicInfo = (info: BasicInfo): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(BASIC_INFO_KEY, JSON.stringify(info));
  }
};

export const getBasicInfo = (): BasicInfo | null => {
  if (typeof window !== 'undefined') {
    const savedInfo = localStorage.getItem(BASIC_INFO_KEY);
    return savedInfo ? JSON.parse(savedInfo) : null;
  }
  return null;
};

export const saveBuildingsData = (data: BuildingData[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(BUILDINGS_DATA_KEY, JSON.stringify(data));
  }
};

export const getBuildingsData = (): BuildingData[] => {
  if (typeof window !== 'undefined') {
    const savedData = localStorage.getItem(BUILDINGS_DATA_KEY);
    return savedData ? JSON.parse(savedData) : [];
  }
  return [];
};

export const clearAllData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(BASIC_INFO_KEY);
    localStorage.removeItem(BUILDINGS_DATA_KEY);
  }
}; 