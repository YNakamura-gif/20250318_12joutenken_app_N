import React, { useState } from 'react';
import PredictiveInput from './PredictiveInput';
import { Deterioration } from '../types';

interface DeteriorationFormProps {
  nextId: number;
  onAdd: (deterioration: Deterioration) => void;
}

const DeteriorationForm: React.FC<DeteriorationFormProps> = ({ nextId, onAdd }) => {
  const [location, setLocation] = useState<string>('');
  const [deteriorationName, setDeteriorationName] = useState<string>('');
  const [photoNumber, setPhotoNumber] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location || !deteriorationName) {
      alert('場所と劣化名は必須項目です');
      return;
    }
    
    const newDeteriorationItem: Deterioration = {
      id: nextId,
      location,
      deteriorationName,
      photoNumber
    };
    
    onAdd(newDeteriorationItem);
    
    // フォームをリセット
    setLocation('');
    setDeteriorationName('');
    setPhotoNumber('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow-sm mb-4">
      <div className="grid grid-cols-12 gap-2 items-end">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">番号</label>
          <div className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md text-center">
            {nextId}
          </div>
        </div>
        
        <div className="col-span-4">
          <PredictiveInput
            label="場所"
            value={location}
            onChange={setLocation}
            type="locations"
            placeholder="場所を入力"
          />
        </div>
        
        <div className="col-span-4">
          <PredictiveInput
            label="劣化名"
            value={deteriorationName}
            onChange={setDeteriorationName}
            type="deteriorations"
            placeholder="劣化名を入力"
          />
        </div>
        
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">写真番号</label>
          <input
            type="text"
            value={photoNumber}
            onChange={(e) => setPhotoNumber(e.target.value)}
            placeholder="番号"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="col-span-1">
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-md w-full h-10 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
};

export default DeteriorationForm; 