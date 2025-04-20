import React, { useEffect, useState } from 'react';
import { getSavedMedicines } from '../lib/medicine';
import MedicineInfo from './MedicineInfo';
import type { MedicineInfo as MedicineInfoType } from '../lib/medicine';

const SavedMedicines = () => {
  const [medicines, setMedicines] = useState<MedicineInfoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSavedMedicines();
        setMedicines(data);
      } catch (err) {
        console.error('Error loading medicines:', err);
        setError('Failed to load saved medicines');
      } finally {
        setLoading(false);
      }
    };

    loadMedicines();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 text-sm">
        {error}
      </div>
    );
  }

  if (medicines.length === 0) {
    return (
      <div className="text-gray-400 text-center p-4 text-sm">
        No saved medicines found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {medicines.map((medicine, index) => (
        <MedicineInfo
          key={`${medicine.name}-${index}`}
          {...medicine}
          isSaved={true}
        />
      ))}
    </div>
  );
};

export default SavedMedicines;