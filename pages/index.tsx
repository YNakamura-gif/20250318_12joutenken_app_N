import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import InfoTab from '../components/InfoTab';
import DeteriorationTab from '../components/DeteriorationTab';
import { BasicInfo, BuildingData } from '../types';
import { saveBasicInfo, getBasicInfo, saveBuildingsData, getBuildingsData } from '../utils/storage';
import { generateCSV, downloadCSV } from '../utils/csv';

export default function Home() {
  // 基本情報の状態
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    surveyDate: new Date().toISOString().substring(0, 10),
    siteName: '',
    buildingName: ''
  });
  
  // 建物データの状態
  const [buildingsData, setBuildingsData] = useState<BuildingData[]>([]);
  
  // アクティブな建物
  const [activeBuilding, setActiveBuilding] = useState<string>('');
  
  // 新規建物名の入力状態
  const [newBuildingName, setNewBuildingName] = useState<string>('');
  
  // タブの状態（0: 基本情報、1: 劣化情報）
  const [activeTab, setActiveTab] = useState<number>(0);
  
  // 初期データのロード
  useEffect(() => {
    const loadedBasicInfo = getBasicInfo();
    if (loadedBasicInfo) {
      setBasicInfo(loadedBasicInfo);
      
      // 建物名があれば、それをアクティブ建物として設定
      if (loadedBasicInfo.buildingName) {
        setActiveBuilding(loadedBasicInfo.buildingName);
      }
    }
    
    const loadedBuildingsData = getBuildingsData();
    if (loadedBuildingsData && loadedBuildingsData.length > 0) {
      setBuildingsData(loadedBuildingsData);
      
      // アクティブな建物が設定されていない場合、最初の建物をアクティブにする
      if (!activeBuilding && loadedBuildingsData.length > 0) {
        setActiveBuilding(loadedBuildingsData[0].buildingName);
      }
    }
  }, []);
  
  // 基本情報が変更されたときの処理
  useEffect(() => {
    saveBasicInfo(basicInfo);
    
    // 建物名が変更され、その建物がまだ登録されていない場合、新しい建物を追加
    if (basicInfo.buildingName && !buildingsData.some(b => b.buildingName === basicInfo.buildingName)) {
      const newBuildingData: BuildingData = {
        buildingName: basicInfo.buildingName,
        deteriorations: [],
        nextId: 1
      };
      
      const updatedBuildingsData = [...buildingsData, newBuildingData];
      setBuildingsData(updatedBuildingsData);
      saveBuildingsData(updatedBuildingsData);
      setActiveBuilding(basicInfo.buildingName);
    }
  }, [basicInfo]);
  
  // 建物データが変更されたときの処理
  useEffect(() => {
    saveBuildingsData(buildingsData);
  }, [buildingsData]);
  
  // 建物の追加処理
  const handleAddBuilding = () => {
    if (!newBuildingName.trim()) {
      alert('建物名を入力してください');
      return;
    }
    
    if (buildingsData.some(b => b.buildingName === newBuildingName)) {
      alert('同じ名前の建物が既に存在します');
      return;
    }
    
    const newBuildingData: BuildingData = {
      buildingName: newBuildingName,
      deteriorations: [],
      nextId: 1
    };
    
    const updatedBuildingsData = [...buildingsData, newBuildingData];
    setBuildingsData(updatedBuildingsData);
    saveBuildingsData(updatedBuildingsData);
    setActiveBuilding(newBuildingName);
    setNewBuildingName('');
    setActiveTab(1); // 劣化情報タブに切り替え
  };
  
  // 建物の切り替え処理
  const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveBuilding(e.target.value);
  };
  
  // CSV出力処理
  const handleExportCSV = () => {
    if (buildingsData.length === 0) {
      alert('データがありません');
      return;
    }
    
    const csvContent = generateCSV(basicInfo, buildingsData);
    const fileName = `${basicInfo.siteName}_${basicInfo.surveyDate.replace(/-/g, '')}.csv`;
    downloadCSV(csvContent, fileName);
  };

  return (
    <Layout>
      <Head>
        <title>12条点検劣化調査アプリ</title>
      </Head>

      <div className="mb-4">
        <div className="grid grid-cols-2 bg-gray-200 rounded-md overflow-hidden">
          <button
            className={`py-2 ${activeTab === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab(0)}
          >
            基本情報
          </button>
          <button
            className={`py-2 ${activeTab === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab(1)}
            disabled={!activeBuilding}
          >
            劣化情報
          </button>
        </div>
      </div>

      {activeTab === 0 ? (
        // 基本情報タブ
        <div>
          <InfoTab basicInfo={basicInfo} onBasicInfoChange={setBasicInfo} />
          
          <div className="mt-6 bg-white p-4 rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-4">建物追加</h2>
            <div className="flex items-end space-x-2">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-1">建物名</label>
                <input
                  type="text"
                  value={newBuildingName}
                  onChange={(e) => setNewBuildingName(e.target.value)}
                  placeholder="例：A棟、B棟など"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleAddBuilding}
                className="bg-blue-600 text-white p-2 rounded-md h-10 px-4"
              >
                追加
              </button>
            </div>
          </div>
        </div>
      ) : (
        // 劣化情報タブ
        <div>
          {buildingsData.length > 0 ? (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">建物選択</label>
              <select
                value={activeBuilding}
                onChange={handleBuildingChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {buildingsData.map((building) => (
                  <option key={building.buildingName} value={building.buildingName}>
                    {building.buildingName}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              建物が登録されていません。基本情報タブで建物を追加してください。
            </div>
          )}
          
          {activeBuilding && (
            <DeteriorationTab
              activeBuilding={activeBuilding}
              buildingsData={buildingsData}
              onBuildingsDataChange={setBuildingsData}
            />
          )}
        </div>
      )}
      
      <div className="mt-8">
        <button
          onClick={handleExportCSV}
          className="bg-green-600 text-white p-3 rounded-md w-full font-medium"
          disabled={buildingsData.length === 0}
        >
          CSVファイルでダウンロード
        </button>
      </div>
    </Layout>
  );
} 