import React from 'react';
import { AlertCircle, Check, X } from 'lucide-react';

interface MedicineInfoProps {
  name: string;
  description: string;
  dosage: string;
  sideEffects: string;
  warnings: string;
  onSave?: () => void;
  onClose?: () => void;
  isSaved?: boolean;
}

const MedicineInfo: React.FC<MedicineInfoProps> = ({
  name,
  description,
  dosage,
  sideEffects,
  warnings,
  onSave,
  onClose,
  isSaved
}) => {
  return (
    <div className="bg-[#2d3139] rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white capitalize">{name}</h3>
        <div className="flex gap-2">
          {onSave && !isSaved && (
            <button
              onClick={onSave}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-400/10 transition-colors"
            >
              <Check className="h-4 w-4" />
              Save
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 p-1 rounded hover:bg-gray-700/50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-gray-300 font-medium mb-1">Description</h4>
          <p className="text-gray-400">{description}</p>
        </div>

        <div>
          <h4 className="text-gray-300 font-medium mb-1">Dosage</h4>
          <p className="text-gray-400">{dosage}</p>
        </div>

        <div>
          <h4 className="text-gray-300 font-medium mb-1">Side Effects</h4>
          <p className="text-gray-400">{sideEffects}</p>
        </div>

        <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertCircle className="h-4 w-4" />
            <h4 className="font-medium">Warnings</h4>
          </div>
          <p className="text-red-300">{warnings}</p>
        </div>
      </div>
    </div>
  );
};

export default MedicineInfo;