import React from 'react';
import { BasicInfo } from '../types';

interface InfoTabProps {
  basicInfo: BasicInfo;
  onBasicInfoChange: (info: BasicInfo) => void;
}

const InfoTab: React.FC<InfoTabProps> = ({ basicInfo, onBasicInfoChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onBasicInfoChange({
      ...basicInfo,
      [name]: value
    });
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <h2 className="text-lg font-semibold mb-4">基本情報</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">調査日</label>
        <input
          type="date"
          name="surveyDate"
          value={basicInfo.surveyDate}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">現場名</label>
        <input
          type="text"
          name="siteName"
          value={basicInfo.siteName}
          onChange={handleChange}
          placeholder="現場名を入力"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">建物名</label>
        <input
          type="text"
          name="buildingName"
          value={basicInfo.buildingName}
          onChange={handleChange}
          placeholder="建物名を入力"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default InfoTab; 