import * as tf from '@tensorflow/tfjs';
import { BaseModel } from './baseModel';
import { geneticsConditions } from './conditions/geneticsConditions';

export class GeneticsModel extends BaseModel {
  constructor() {
    super('Genetics');
  }

  protected async trainModel() {
    if (!this.encoder) throw new Error('Encoder not loaded');

    try {
      const allSymptoms = Object.values(geneticsConditions).flatMap(condition => condition.symptoms);
      const labels = Object.values(geneticsConditions).flatMap((condition, index) => 
        Array(condition.symptoms.length).fill(index)
      );

      const embeddings = await this.encoder.embed(allSymptoms);
      const xs = embeddings;
      const ys = tf.oneHot(labels, Object.keys(geneticsConditions).length);

      this.model = tf.sequential({
        layers: [
          tf.layers.dense({
            units: 128,
            activation: 'relu',
            inputShape: [512],
            kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
          }),
          tf.layers.dropout({ rate: 0.3 }),
          tf.layers.dense({
            units: 64,
            activation: 'relu',
            kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
          }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({
            units: 32,
            activation: 'relu',
            kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
          }),
          tf.layers.dense({
            units: Object.keys(geneticsConditions).length,
            activation: 'softmax'
          })
        ]
      });

      this.model.compile({
        optimizer: tf.train.adam(0.0005),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
      });

      await this.model.fit(xs, ys, {
        epochs: 100,
        batchSize: 32,
        validationSplit: 0.2,
        shuffle: true,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            if (logs && (epoch + 1) % 10 === 0) {
              console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
            }
          }
        }
      });
    } catch (error) {
      console.error('Error training genetics model:', error);
      throw error;
    }
  }

  protected async getModelPrediction(input: string, probabilities: Float32Array): Promise<string> {
    const cleanedInput = input.toLowerCase().trim();
      
    // Check for keywords related to other specialties
    const dermatologyKeywords = ['skin', 'hair', 'nail', 'rash', 'acne', 'dermatitis'];
    const cardiologyKeywords = ['heart', 'chest pain', 'palpitations', 'blood pressure'];
    const neurologyKeywords = ['headache', 'migraine', 'nerve', 'brain', 'seizure'];
    const ophthalmologyKeywords = ['eye', 'vision', 'sight', 'blindness'];
    const dentalKeywords = ['tooth', 'teeth', 'gum', 'dental', 'mouth'];
    const orthopedicsKeywords = ['bone', 'joint', 'muscle', 'fracture', 'sprain'];

    // Check if the input contains keywords from other specialties
    if (dermatologyKeywords.some(keyword => cleanedInput.includes(keyword)) && !cleanedInput.includes('genetic')) {
      return "I notice you're asking about skin, hair, or nail conditions. Please consult our Dermatology specialist for these concerns.";
    }
    if (cardiologyKeywords.some(keyword => cleanedInput.includes(keyword)) && !cleanedInput.includes('genetic')) {
      return "Your question appears to be about heart health. Please consult our Cardiology specialist for these concerns.";
    }
    if (neurologyKeywords.some(keyword => cleanedInput.includes(keyword)) && !cleanedInput.includes('genetic')) {
      return "Your question seems to be about neurological conditions. Please consult our Neurology specialist for these concerns.";
    }
    if (ophthalmologyKeywords.some(keyword => cleanedInput.includes(keyword)) && !cleanedInput.includes('genetic')) {
      return "I notice you're asking about eye or vision-related issues. Please consult our Ophthalmology specialist for these concerns.";
    }
    if (dentalKeywords.some(keyword => cleanedInput.includes(keyword)) && !cleanedInput.includes('genetic')) {
      return "Your question appears to be about dental health. Please consult our Dental specialist for these concerns.";
    }
    if (orthopedicsKeywords.some(keyword => cleanedInput.includes(keyword)) && !cleanedInput.includes('genetic')) {
      return "Your question appears to be about musculoskeletal issues. Please consult our Orthopedics specialist for these concerns.";
    }

    const maxProbIndex = probabilities.indexOf(Math.max(...probabilities));
    const conditions = Object.values(geneticsConditions);
    return conditions[maxProbIndex].response;
  }
}