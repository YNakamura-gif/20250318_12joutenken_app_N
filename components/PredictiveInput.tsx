import React, { useState, useEffect, useRef } from 'react';
import { getPredictions } from '../utils/prediction';

interface PredictiveInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type: 'locations' | 'deteriorations';
  placeholder?: string;
}

const PredictiveInput: React.FC<PredictiveInputProps> = ({
  label,
  value,
  onChange,
  type,
  placeholder = ''
}) => {
  const [predictions, setPredictions] = useState<string[]>([]);
  const [showPredictions, setShowPredictions] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (value) {
        const result = await getPredictions(type, value);
        setPredictions(result);
        setShowPredictions(result.length > 0);
      } else {
        setPredictions([]);
        setShowPredictions(false);
      }
    };

    fetchPredictions();
  }, [value, type]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handlePredictionClick = (prediction: string) => {
    onChange(prediction);
    setPredictions([]);
    setShowPredictions(false);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    if (predictions.length > 0) {
      setShowPredictions(true);
    }
  };

  const handleInputBlur = () => {
    // 少し遅延させてクリックが先に発生するようにする
    setTimeout(() => {
      setShowPredictions(false);
    }, 200);
  };

  return (
    <div className="mb-3 relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      {showPredictions && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {predictions.map((prediction, index) => (
            <li
              key={index}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handlePredictionClick(prediction)}
            >
              {prediction}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PredictiveInput; 