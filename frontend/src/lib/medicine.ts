import { supabase } from './supabase';
import { getOpenAIResponse } from './openai';

export interface MedicineInfo {
  name: string;
  description: string;
  dosage: string;
  sideEffects: string;
  warnings: string;
}

export const fetchMedicineInfo = async (imageName: string): Promise<MedicineInfo> => {
  try {
    // Clean up the medicine name from the image filename
    const cleanName = imageName
      .toLowerCase()
      .replace(/\.(jpg|jpeg|png|gif)$/i, '')
      .replace(/[^a-z0-9]/g, ' ')
      .trim();

    // Use OpenAI to get medicine information
    const prompt = `Provide detailed information about the medicine "${cleanName}" in the following format:
    1. Brief description (what it is and what it's used for)
    2. Common dosage information
    3. Common side effects
    4. Important warnings and precautions

    Keep each section concise but informative. Include the most important information that a patient should know.
    If the medicine name is unclear or seems incorrect, provide general guidance about consulting a healthcare provider.`;

    const aiResponse = await getOpenAIResponse(prompt, 'Pharmacy');
    
    // Parse the AI response into sections
    const sections = aiResponse.split('\n\n');
    
    return {
      name: cleanName,
      description: sections[0]?.replace(/^1\.\s*/, '') || 'Please consult a healthcare provider for accurate information about this medication.',
      dosage: sections[1]?.replace(/^2\.\s*/, '') || 'Dosage information must be provided by a healthcare professional.',
      sideEffects: sections[2]?.replace(/^3\.\s*/, '') || 'Consult your healthcare provider for information about potential side effects.',
      warnings: sections[3]?.replace(/^4\.\s*/, '') || 'For your safety, please consult a healthcare provider before taking any medication.'
    };
  } catch (error) {
    console.error('Error fetching medicine info:', error);
    throw new Error('Failed to fetch medicine information. Please try again.');
  }
};

export const saveMedicineInfo = async (medicineInfo: MedicineInfo): Promise<void> => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      throw new Error('Authentication error. Please sign in again.');
    }
    
    if (!session?.user) {
      throw new Error('Please sign in to save medicine information.');
    }

    // Validate medicine info
    if (!medicineInfo.name || !medicineInfo.description) {
      throw new Error('Invalid medicine information.');
    }

    // Insert medicine info
    const { error: insertError } = await supabase
      .from('medicines')
      .insert({
        user_id: session.user.id,
        name: medicineInfo.name,
        description: medicineInfo.description,
        dosage: medicineInfo.dosage,
        side_effects: medicineInfo.sideEffects,
        warnings: medicineInfo.warnings
      });

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error('Failed to save medicine information. Please try again.');
    }
  } catch (error) {
    console.error('Error saving medicine info:', error);
    throw error instanceof Error ? error : new Error('An unexpected error occurred.');
  }
};

export const getSavedMedicines = async (): Promise<MedicineInfo[]> => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      throw new Error('Authentication error. Please sign in again.');
    }
    
    if (!session?.user) {
      return [];
    }

    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error);
      throw new Error('Failed to fetch saved medicines.');
    }

    return data?.map(item => ({
      name: item.name,
      description: item.description,
      dosage: item.dosage,
      sideEffects: item.side_effects,
      warnings: item.warnings
    })) ?? [];
  } catch (error) {
    console.error('Error fetching saved medicines:', error);
    throw error instanceof Error ? error : new Error('An unexpected error occurred.');
  }
};