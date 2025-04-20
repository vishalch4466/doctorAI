import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const getOpenAIResponse = async (input: string, specialty: string): Promise<string> => {
  try {
    if (!openai.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log(`Requesting OpenAI response for ${specialty} query:`, input);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a medical AI assistant specializing in ${specialty}. 
          Provide accurate, professional medical information while always:
          - Being clear and concise
          - Using professional medical terminology when appropriate
          - Including relevant warnings and precautions
          - Reminding users to seek professional medical advice for serious concerns
          - Emphasizing that this is AI assistance and not a replacement for professional medical consultation
          - Organizing information in clear sections when appropriate
          - Providing actionable recommendations when safe to do so`
        },
        {
          role: "user",
          content: input
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response received from OpenAI');
    }

    console.log('Successfully received OpenAI response');
    return response;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return `I apologize, but I'm currently unable to provide detailed information. Please:

1. Try using our built-in medical knowledge base
2. Provide more specific symptoms or concerns
3. Consider consulting a healthcare professional for accurate diagnosis and treatment

Remember: This is an AI assistant and not a replacement for professional medical advice.`;
  }
}

export const analyzeImage = async (imageBase64: string): Promise<string> => {
  try {
    if (!openai.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Requesting OpenAI image analysis...');

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a medical AI assistant specializing in pharmacy and medicine identification. 
          When analyzing medicine images:
          1. Identify the medicine name if visible
          2. Describe physical characteristics (color, shape, markings)
          3. Provide known information about the medicine
          4. Include important warnings and precautions
          5. Emphasize consulting a healthcare provider
          
          Format the response in clear sections:
          - Description
          - Usage
          - Warnings
          - Important Notes`
        },
        {
          role: "user",
          content: `Please analyze this medicine image and provide detailed information about what you observe: ${imageBase64}`
        }
      ],
      max_tokens: 800,
      temperature: 0.5,
    });

    const analysisResult = response.choices[0]?.message?.content;
    if (!analysisResult) {
      throw new Error('No analysis received from OpenAI');
    }

    console.log('Successfully received image analysis');
    return analysisResult;
  } catch (error) {
    console.error('OpenAI image analysis error:', error);
    return `I apologize, but I'm currently unable to analyze this image. Please:

1. Ensure the image is clear and well-lit
2. Try uploading a different image
3. Provide additional context about the medicine
4. Consider consulting a healthcare professional for accurate identification

IMPORTANT: Never take medication without proper identification and professional medical advice.`;
  }
}