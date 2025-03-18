import React from 'react';
import { Deterioration } from '../types';

interface DeteriorationListProps {
  deteriorations: Deterioration[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const DeteriorationList: React.FC<DeteriorationListProps> = ({ deteriorations, onEdit, onDelete }) => {
  if (deteriorations.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        劣化情報が登録されていません
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">番号</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">場所</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">劣化名</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">写真番号</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {deteriorations.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.location}</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.deteriorationName}</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.photoNumber}</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                <button
                  onClick={() => onEdit(item.id)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  編集
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeteriorationList; 