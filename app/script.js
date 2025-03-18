// DOM要素の参照を取得
document.addEventListener('DOMContentLoaded', () => {
  // フッターの年を更新
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // タブ切り替え要素
  const infoTabBtn = document.getElementById('infoTabBtn');
  const detailTabBtn = document.getElementById('detailTabBtn');
  const infoTab = document.getElementById('infoTab');
  const detailTab = document.getElementById('detailTab');

  // 基本情報入力フォーム
  const surveyDateInput = document.getElementById('surveyDate');
  const siteNameInput = document.getElementById('siteName');
  const buildingNameInput = document.getElementById('buildingName');
  const newBuildingNameInput = document.getElementById('newBuildingName');
  const addBuildingBtn = document.getElementById('addBuildingBtn');

  // 劣化情報入力フォーム
  const buildingSelect = document.getElementById('buildingSelect');
  const activeBuildingName = document.getElementById('activeBuildingName');
  const deteriorationForm = document.getElementById('deteriorationForm');
  const nextIdDisplay = document.getElementById('nextIdDisplay');
  const locationInput = document.getElementById('locationInput');
  const deteriorationNameInput = document.getElementById('deteriorationNameInput');
  const photoNumberInput = document.getElementById('photoNumberInput');
  const locationPredictions = document.getElementById('locationPredictions');
  const deteriorationPredictions = document.getElementById('deteriorationPredictions');
  const deteriorationTableBody = document.getElementById('deteriorationTableBody');

  // 編集モーダル
  const editModal = document.getElementById('editModal');
  const editForm = document.getElementById('editForm');
  const editIdDisplay = document.getElementById('editIdDisplay');
  const editLocationInput = document.getElementById('editLocationInput');
  const editDeteriorationNameInput = document.getElementById('editDeteriorationNameInput');
  const editPhotoNumberInput = document.getElementById('editPhotoNumberInput');
  const editLocationPredictions = document.getElementById('editLocationPredictions');
  const editDeteriorationPredictions = document.getElementById('editDeteriorationPredictions');
  const cancelEditBtn = document.getElementById('cancelEditBtn');

  // CSVエクスポートボタン
  const exportCsvBtn = document.getElementById('exportCsvBtn');

  // アプリケーションのデータと状態
  let basicInfo = {
    surveyDate: new Date().toISOString().slice(0, 10),
    siteName: '',
    buildingName: ''
  };

  let buildingsData = [];
  let activeBuilding = '';
  let editingDeteriorationId = null;

  // 初期データのロード
  initializeApp();

  // タブ切り替え
  infoTabBtn.addEventListener('click', () => {
    infoTab.classList.remove('hidden');
    detailTab.classList.add('hidden');
    infoTabBtn.classList.add('bg-blue-600', 'text-white');
    infoTabBtn.classList.remove('bg-gray-200', 'text-gray-700');
    detailTabBtn.classList.add('bg-gray-200', 'text-gray-700');
    detailTabBtn.classList.remove('bg-blue-600', 'text-white');
  });

  detailTabBtn.addEventListener('click', () => {
    if (buildingsData.length === 0) {
      alert('建物を追加してください');
      return;
    }
    infoTab.classList.add('hidden');
    detailTab.classList.remove('hidden');
    infoTabBtn.classList.add('bg-gray-200', 'text-gray-700');
    infoTabBtn.classList.remove('bg-blue-600', 'text-white');
    detailTabBtn.classList.add('bg-blue-600', 'text-white');
    detailTabBtn.classList.remove('bg-gray-200', 'text-gray-700');
  });

  // 基本情報入力のイベントハンドラ
  surveyDateInput.addEventListener('change', updateBasicInfo);
  siteNameInput.addEventListener('input', updateBasicInfo);
  buildingNameInput.addEventListener('input', updateBasicInfo);

  // 建物追加ボタン
  addBuildingBtn.addEventListener('click', addBuilding);

  // 建物選択変更時
  buildingSelect.addEventListener('change', handleBuildingChange);

  // 劣化情報フォーム送信
  deteriorationForm.addEventListener('submit', handleDeteriorationSubmit);

  // 編集フォーム送信
  editForm.addEventListener('submit', handleEditSubmit);

  // 編集キャンセル
  cancelEditBtn.addEventListener('click', () => {
    editModal.classList.add('hidden');
  });

  // CSVエクスポート
  exportCsvBtn.addEventListener('click', exportToCsv);

  // 予測変換の設定
  setupPredictions(locationInput, locationPredictions, 'locations');
  setupPredictions(deteriorationNameInput, deteriorationPredictions, 'deteriorations');
  setupPredictions(editLocationInput, editLocationPredictions, 'locations');
  setupPredictions(editDeteriorationNameInput, editDeteriorationPredictions, 'deteriorations');

  // 基本情報の更新
  function updateBasicInfo() {
    basicInfo = {
      surveyDate: surveyDateInput.value,
      siteName: siteNameInput.value,
      buildingName: buildingNameInput.value
    };
    
    saveToLocalStorage();

    // 建物名が入力され、その建物がまだ登録されていない場合、新しい建物を追加
    if (basicInfo.buildingName && !buildingsData.some(b => b.buildingName === basicInfo.buildingName)) {
      const newBuildingData = {
        buildingName: basicInfo.buildingName,
        deteriorations: [],
        nextId: 1
      };
      
      buildingsData.push(newBuildingData);
      saveToLocalStorage();
      updateBuildingSelect();
      setActiveBuilding(basicInfo.buildingName);
    }
  }

  // 建物を追加
  function addBuilding() {
    const buildingName = newBuildingNameInput.value.trim();
    
    if (!buildingName) {
      alert('建物名を入力してください');
      return;
    }
    
    if (buildingsData.some(b => b.buildingName === buildingName)) {
      alert('同じ名前の建物が既に存在します');
      return;
    }
    
    const newBuildingData = {
      buildingName: buildingName,
      deteriorations: [],
      nextId: 1
    };
    
    buildingsData.push(newBuildingData);
    saveToLocalStorage();
    updateBuildingSelect();
    setActiveBuilding(buildingName);
    newBuildingNameInput.value = '';
    
    // 劣化情報タブに切り替え
    infoTab.classList.add('hidden');
    detailTab.classList.remove('hidden');
    infoTabBtn.classList.add('bg-gray-200', 'text-gray-700');
    infoTabBtn.classList.remove('bg-blue-600', 'text-white');
    detailTabBtn.classList.add('bg-blue-600', 'text-white');
    detailTabBtn.classList.remove('bg-gray-200', 'text-gray-700');
  }

  // 建物選択変更時の処理
  function handleBuildingChange() {
    const selectedBuilding = buildingSelect.value;
    setActiveBuilding(selectedBuilding);
  }

  // アクティブな建物を設定
  function setActiveBuilding(buildingName) {
    activeBuilding = buildingName;
    activeBuildingName.textContent = buildingName;
    
    // 建物選択ドロップダウンを更新
    buildingSelect.value = buildingName;
    
    // 次のID表示を更新
    const buildingData = getBuildingData();
    if (buildingData) {
      nextIdDisplay.textContent = buildingData.nextId;
    }
    
    // 劣化情報テーブルを更新
    updateDeteriorationTable();
  }

  // 劣化情報フォーム送信時の処理
  function handleDeteriorationSubmit(e) {
    e.preventDefault();
    
    const location = locationInput.value.trim();
    const deteriorationName = deteriorationNameInput.value.trim();
    const photoNumber = photoNumberInput.value.trim();
    
    if (!location || !deteriorationName) {
      alert('場所と劣化名は必須項目です');
      return;
    }
    
    const buildingData = getBuildingData();
    if (!buildingData) return;
    
    const newDeteriorationItem = {
      id: buildingData.nextId,
      location,
      deteriorationName,
      photoNumber
    };
    
    buildingData.deteriorations.push(newDeteriorationItem);
    buildingData.nextId++;
    
    // データを保存
    saveToLocalStorage();
    
    // UIを更新
    nextIdDisplay.textContent = buildingData.nextId;
    updateDeteriorationTable();
    
    // フォームをリセット
    locationInput.value = '';
    deteriorationNameInput.value = '';
    photoNumberInput.value = '';
  }

  // 劣化情報の編集
  function editDeteиоration(id) {
    const buildingData = getBuildingData();
    if (!buildingData) return;
    
    const deterioration = buildingData.deteriorations.find(d => d.id === id);
    if (!deterioration) return;
    
    editingDeteriorationId = id;
    editIdDisplay.textContent = deterioration.id;
    editLocationInput.value = deterioration.location;
    editDeteriorationNameInput.value = deterioration.deteriorationName;
    editPhotoNumberInput.value = deterioration.photoNumber;
    
    editModal.classList.remove('hidden');
  }

  // 編集フォーム送信時の処理
  function handleEditSubmit(e) {
    e.preventDefault();
    
    const location = editLocationInput.value.trim();
    const deteriorationName = editDeteriorationNameInput.value.trim();
    const photoNumber = editPhotoNumberInput.value.trim();
    
    if (!location || !deteriorationName) {
      alert('場所と劣化名は必須項目です');
      return;
    }
    
    const buildingData = getBuildingData();
    if (!buildingData) return;
    
    // 編集対象のデータを更新
    const deteriorationIndex = buildingData.deteriorations.findIndex(d => d.id === editingDeteriorationId);
    if (deteriorationIndex === -1) return;
    
    buildingData.deteriorations[deteriorationIndex] = {
      id: editingDeteriorationId,
      location,
      deteriorationName,
      photoNumber
    };
    
    // データを保存
    saveToLocalStorage();
    
    // UIを更新
    updateDeteriorationTable();
    
    // モーダルを閉じる
    editModal.classList.add('hidden');
    editingDeteriorationId = null;
  }

  // 劣化情報の削除
  function deleteDeteиоration(id) {
    if (!confirm('この劣化情報を削除してもよろしいですか？')) return;
    
    const buildingData = getBuildingData();
    if (!buildingData) return;
    
    // 削除対象を除外
    buildingData.deteriorations = buildingData.deteriorations.filter(d => d.id !== id);
    
    // データを保存
    saveToLocalStorage();
    
    // UIを更新
    updateDeteriorationTable();
  }

  // 劣化情報テーブルの更新
  function updateDeteriorationTable() {
    deteriorationTableBody.innerHTML = '';
    
    const buildingData = getBuildingData();
    if (!buildingData) return;
    
    if (buildingData.deteriorations.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = `
        <td colspan="5" class="px-3 py-4 text-center text-gray-500">
          劣化情報が登録されていません
        </td>
      `;
      deteriorationTableBody.appendChild(emptyRow);
      return;
    }
    
    buildingData.deteriorations.forEach(deterioration => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-50';
      row.innerHTML = `
        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">${deterioration.id}</td>
        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">${deterioration.location}</td>
        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">${deterioration.deteriorationName}</td>
        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">${deterioration.photoNumber}</td>
        <td class="px-3 py-2 whitespace-nowrap text-sm text-right">
          <button
            data-id="${deterioration.id}"
            class="edit-btn text-indigo-600 hover:text-indigo-900 mr-3"
          >
            編集
          </button>
          <button
            data-id="${deterioration.id}"
            class="delete-btn text-red-600 hover:text-red-900"
          >
            削除
          </button>
        </td>
      `;
      deteriorationTableBody.appendChild(row);
    });
    
    // 編集・削除ボタンのイベントリスナーを設定
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        editDeteиоration(id);
      });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        deleteDeteиоration(id);
      });
    });
  }

  // 建物選択ドロップダウンの更新
  function updateBuildingSelect() {
    buildingSelect.innerHTML = '';
    
    buildingsData.forEach(building => {
      const option = document.createElement('option');
      option.value = building.buildingName;
      option.textContent = building.buildingName;
      buildingSelect.appendChild(option);
    });
  }

  // CSV出力
  function exportToCsv() {
    if (buildingsData.length === 0 || !basicInfo.surveyDate || !basicInfo.siteName) {
      alert('データが不足しています。基本情報と劣化情報を入力してください。');
      return;
    }
    
    // ヘッダー行
    const headers = ['調査日', '現場名', '建物名', '番号', '場所', '劣化名', '写真番号'];
    const csvRows = [headers.join(',')];
    
    // データ行
    buildingsData.forEach(building => {
      building.deteriorations.forEach(deterioration => {
        const row = [
          basicInfo.surveyDate,
          basicInfo.siteName,
          building.buildingName,
          deterioration.id,
          deterioration.location,
          deterioration.deteriorationName,
          deterioration.photoNumber
        ];
        
        // カンマを含む項目はダブルクォートで囲む
        const formattedRow = row.map(item => {
          const str = String(item);
          if (str.includes(',')) {
            return `"${str}"`;
          }
          return str;
        });
        
        csvRows.push(formattedRow.join(','));
      });
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // ファイル名を設定
    const fileName = `${basicInfo.siteName}_${basicInfo.surveyDate.replace(/-/g, '')}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 予測変換機能のセットアップ
  function setupPredictions(inputElement, predictionsElement, type) {
    // 入力時の処理
    inputElement.addEventListener('input', () => {
      const value = inputElement.value.trim();
      if (!value) {
        predictionsElement.innerHTML = '';
        predictionsElement.classList.add('hidden');
        return;
      }
      
      // 予測候補を表示
      showPredictions(value, predictionsElement, type);
    });
    
    // フォーカス時の処理
    inputElement.addEventListener('focus', () => {
      const value = inputElement.value.trim();
      if (value) {
        showPredictions(value, predictionsElement, type);
      }
    });
    
    // フォーカスを失った時の処理
    inputElement.addEventListener('blur', () => {
      // 少し遅延させてクリックが先に発生するようにする
      setTimeout(() => {
        predictionsElement.classList.add('hidden');
      }, 200);
    });
  }

  // 予測候補を表示
  function showPredictions(input, predictionsElement, type) {
    // 予測候補リストをクリア
    predictionsElement.innerHTML = '';
    
    if (!input) return;
    
    // データのソースを選択
    const data = type === 'locations' ? locationsData : deteriorationsData;
    
    // 入力文字の最初の文字（ひらがな）を抽出
    const firstChar = input.charAt(0);
    
    // その文字に対応する候補リストを取得
    const candidates = data[firstChar] || [];
    
    // 入力文字が複数文字の場合、候補をフィルタリング
    let filteredCandidates = candidates;
    if (input.length > 1) {
      filteredCandidates = candidates.filter(candidate => candidate.includes(input));
    }
    
    // 候補がある場合、表示
    if (filteredCandidates.length > 0) {
      filteredCandidates.forEach(candidate => {
        const item = document.createElement('li');
        item.className = 'prediction-item';
        item.textContent = candidate;
        item.addEventListener('click', () => {
          if (type === 'locations') {
            if (predictionsElement.id === 'locationPredictions') {
              locationInput.value = candidate;
            } else {
              editLocationInput.value = candidate;
            }
          } else {
            if (predictionsElement.id === 'deteriorationPredictions') {
              deteriorationNameInput.value = candidate;
            } else {
              editDeteriorationNameInput.value = candidate;
            }
          }
          predictionsElement.classList.add('hidden');
        });
        predictionsElement.appendChild(item);
      });
      
      predictionsElement.classList.remove('hidden');
    } else {
      predictionsElement.classList.add('hidden');
    }
  }

  // アクティブな建物のデータを取得
  function getBuildingData() {
    return buildingsData.find(b => b.buildingName === activeBuilding);
  }

  // アプリの初期化
  function initializeApp() {
    // ローカルストレージからデータをロード
    const savedBasicInfo = localStorage.getItem('12joutenken_basic_info');
    const savedBuildingsData = localStorage.getItem('12joutenken_buildings_data');
    
    if (savedBasicInfo) {
      basicInfo = JSON.parse(savedBasicInfo);
      surveyDateInput.value = basicInfo.surveyDate;
      siteNameInput.value = basicInfo.siteName;
      buildingNameInput.value = basicInfo.buildingName;
    } else {
      // デフォルト値を設定
      surveyDateInput.value = basicInfo.surveyDate;
    }
    
    if (savedBuildingsData) {
      buildingsData = JSON.parse(savedBuildingsData);
      updateBuildingSelect();
      
      // アクティブな建物を設定
      if (buildingsData.length > 0) {
        if (basicInfo.buildingName && buildingsData.some(b => b.buildingName === basicInfo.buildingName)) {
          setActiveBuilding(basicInfo.buildingName);
        } else {
          setActiveBuilding(buildingsData[0].buildingName);
        }
      } else {
        // 建物がない場合は劣化情報タブを無効化
        detailTabBtn.disabled = true;
      }
    }
  }

  // ローカルストレージにデータを保存
  function saveToLocalStorage() {
    localStorage.setItem('12joutenken_basic_info', JSON.stringify(basicInfo));
    localStorage.setItem('12joutenken_buildings_data', JSON.stringify(buildingsData));
  }
}); 