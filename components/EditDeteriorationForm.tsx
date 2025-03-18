import React, { useState, useEffect } from 'react';
import PredictiveInput from './PredictiveInput';
import { Deterioration } from '../types';

interface EditDeteriorationFormProps {
  deterioration: Deterioration;
  onSave: (updatedDeteриоration: Deterioration) => void;
  onCancel: () => void;
}

const EditDeteriorationForm: React.FC<EditDeteriorationFormProps> = ({
  deterioration,
  onSave,
  onCancel
}) => {
  const [location, setLocation] = useState<string>(deterioration.location);
  const [deteriorationName, setDeteriorationName] = useState<string>(deterioration.deteriorationName);
  const [photoNumber, setPhotoNumber] = useState<string>(deterioration.photoNumber);

  useEffect(() => {
    setLocation(deterioration.location);
    setDeteriorationName(deterioration.deteriorationName);
    setPhotoNumber(deterioration.photoNumber);
  }, [deterioration]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location || !deteriorationName) {
      alert('場所と劣化名は必須項目です');
      return;
    }
    
    const updatedDeteриоration: Deterioration = {
      ...deterioration,
      location,
      deteriorationName,
      photoNumber
    };
    
    onSave(updatedDeteриоration);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">劣化情報の編集</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">番号</label>
            <div className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md">
              {deterioration.id}
            </div>
          </div>
          
          <PredictiveInput
            label="場所"
            value={location}
            onChange={setLocation}
            type="locations"
            placeholder="場所を入力"
          />
          
          <PredictiveInput
            label="劣化名"
            value={deteriorationName}
            onChange={setDeteriorationName}
            type="deteriorations"
            placeholder="劣化名を入力"
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">写真番号</label>
            <input
              type="text"
              value={photoNumber}
              onChange={(e) => setPhotoNumber(e.target.value)}
              placeholder="番号"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDeteriorationForm; 