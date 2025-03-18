import { BasicInfo, BuildingData } from '../types';

export const generateCSV = (basicInfo: BasicInfo, buildingsData: BuildingData[]): string => {
  // ヘッダー行
  const headers = ['調査日', '現場名', '建物名', '番号', '場所', '劣化名', '写真番号'];
  const csvContent = [headers.join(',')];

  // データ行
  buildingsData.forEach((building) => {
    building.deteriorations.forEach((deterioration) => {
      const row = [
        basicInfo.surveyDate,
        basicInfo.siteName,
        building.buildingName,
        deterioration.id.toString(),
        deterioration.location,
        deterioration.deteriorationName,
        deterioration.photoNumber
      ];
      
      // カンマを含む項目はダブルクォートで囲む
      const formattedRow = row.map(item => {
        if (item.includes(',')) {
          return `"${item}"`;
        }
        return item;
      });
      
      csvContent.push(formattedRow.join(','));
    });
  });

  return csvContent.join('\n');
};

export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // ファイルをダウンロードするための一時的なURLを作成
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  
  // リンクをクリックして、ダウンロードを開始
  document.body.appendChild(link);
  link.click();
  
  // クリーンアップ
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}; 