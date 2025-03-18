import React, { useState, useEffect } from 'react';
import DeteriorationForm from './DeteriorationForm';
import DeteriorationList from './DeteriorationList';
import EditDeteriorationForm from './EditDeteriorationForm';
import { Deterioration, BuildingData } from '../types';

interface DeteriorationTabProps {
  activeBuilding: string;
  buildingsData: BuildingData[];
  onBuildingsDataChange: (data: BuildingData[]) => void;
}

const DeteriorationTab: React.FC<DeteriorationTabProps> = ({ 
  activeBuilding, 
  buildingsData, 
  onBuildingsDataChange 
}) => {
  const [editingDeteиоration, setEditingDeteиоration] = useState<Deterioration | null>(null);
  
  // 現在の建物データを取得
  const currentBuildingData = buildingsData.find(b => b.buildingName === activeBuilding);
  
  // 現在の建物が存在しない場合のハンドリング
  if (!currentBuildingData) {
    return <div className="text-center py-4">建物データが見つかりません</div>;
  }
  
  const handleAddDeteиоration = (deterioration: Deterioration) => {
    const updatedBuildingsData = buildingsData.map(building => {
      if (building.buildingName === activeBuilding) {
        return {
          ...building,
          deteriorations: [...building.deteriorations, deterioration],
          nextId: building.nextId + 1
        };
      }
      return building;
    });
    
    onBuildingsDataChange(updatedBuildingsData);
  };
  
  const handleEditDeteиоration = (id: number) => {
    const deterioration = currentBuildingData.deteriorations.find(d => d.id === id);
    if (deterioration) {
      setEditingDeteиоration(deterioration);
    }
  };
  
  const handleSaveDeteиоration = (updatedDeteиоration: Deterioration) => {
    const updatedBuildingsData = buildingsData.map(building => {
      if (building.buildingName === activeBuilding) {
        return {
          ...building,
          deteriorations: building.deteriorations.map(d => 
            d.id === updatedDeteиоration.id ? updatedDeteиоration : d
          )
        };
      }
      return building;
    });
    
    onBuildingsDataChange(updatedBuildingsData);
    setEditingDeteиоration(null);
  };
  
  const handleDeleteDeteиоration = (id: number) => {
    if (confirm('この劣化情報を削除してもよろしいですか？')) {
      const updatedBuildingsData = buildingsData.map(building => {
        if (building.buildingName === activeBuilding) {
          return {
            ...building,
            deteriorations: building.deteriorations.filter(d => d.id !== id)
          };
        }
        return building;
      });
      
      onBuildingsDataChange(updatedBuildingsData);
    }
  };
  
  const handleCancelEdit = () => {
    setEditingDeteиоration(null);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">劣化情報入力：{activeBuilding}</h2>
      
      <DeteriorationForm
        nextId={currentBuildingData.nextId}
        onAdd={handleAddDeteиоration}
      />
      
      <h3 className="text-md font-medium mt-6 mb-2">登録済み劣化情報</h3>
      <DeteriorationList
        deteriorations={currentBuildingData.deteriorations}
        onEdit={handleEditDeteиоration}
        onDelete={handleDeleteDeteиоration}
      />
      
      {editingDeteиоration && (
        <EditDeteriorationForm
          deterioration={editingDeteиоration}
          onSave={handleSaveDeteиоration}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default DeteriorationTab; 