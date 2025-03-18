export const getPredictions = async (
  type: 'locations' | 'deteriorations', 
  input: string
): Promise<string[]> => {
  if (!input) return [];

  try {
    // JSONデータを読み込む
    const data = await import(`../data/${type}.json`);
    
    // 入力文字の最初の文字（ひらがな）を抽出
    const firstChar = input.charAt(0);
    
    // その文字に対応する候補リストを取得
    const candidates = data[firstChar] || [];
    
    // 入力文字が複数文字の場合、候補をフィルタリング
    if (input.length > 1) {
      return candidates.filter(
        (candidate: string) => candidate.includes(input)
      );
    }
    
    return candidates;
  } catch (error) {
    console.error(`予測候補の取得に失敗しました: ${error}`);
    return [];
  }
}; 