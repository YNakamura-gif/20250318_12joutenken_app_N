import type { NextApiRequest, NextApiResponse } from 'next';
import { BasicInfo, BuildingData } from '../../types';
import { generateCSV } from '../../utils/csv';

type RequestData = {
  basicInfo: BasicInfo;
  buildingsData: BuildingData[];
  fileName: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  try {
    const { basicInfo, buildingsData, fileName } = req.body as RequestData;
    
    if (!basicInfo || !buildingsData || !fileName) {
      res.status(400).json({ message: 'Missing required data' });
      return;
    }
    
    // CSVデータを生成
    const csvContent = generateCSV(basicInfo, buildingsData);
    
    // HTTPヘッダーを設定
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // CSVデータを返す
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('CSVダウンロードエラー:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
} 