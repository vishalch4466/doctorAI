import * as tf from '@tensorflow/tfjs';
import { BaseModel } from './baseModel';
import { generalConditions } from './conditions/generalConditions';

export class GeneralModel extends BaseModel {
  protected async trainModel() {
    if (!this.encoder) throw new Error('Encoder not loaded');

    try {
      const allSymptoms = Object.values(generalConditions).flatMap(condition => condition.symptoms);
      const labels = Object.values(generalConditions).flatMap((condition, index) => 
        Array(condition.symptoms.length).fill(index)
      );

      const embeddings = await this.encoder.embed(allSymptoms);
      const xs = embeddings;
      const ys = tf.oneHot(labels, Object.keys(generalConditions).length);

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
            units: Object.keys(generalConditions).length,
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
      console.error('Error training general model:', error);
      throw error;
    }
  }

  async predictCondition(input: string): Promise<string> {
    if (!this.encoder || !this.model || !this.isInitialized) {
      throw new Error('Model not initialized');
    }

    try {
      const cleanedInput = input.toLowerCase().trim();
      
      const embedding = await this.encoder.embed([cleanedInput]);
      const prediction = this.model.predict(embedding) as tf.Tensor;
      const probabilities = await prediction.data();
      const maxProbIndex = probabilities.indexOf(Math.max(...probabilities));
      const conditions = Object.values(generalConditions);
      
      if (probabilities[maxProbIndex] < 0.5) {
        return `I apologize, but I'm not confident about providing advice for your specific concern. Please:

1. Try rephrasing your question with more specific details about:
   - Type of symptoms
   - Duration of symptoms
   - Severity
   - Associated symptoms

2. Consider consulting a specialist if your symptoms are specific to:
   - Heart (Cardiology)
   - Skin (Dermatology)
   - Brain/Nerves (Neurology)
   - Eyes (Ophthalmology)
   - Bones/Joints (Orthopedics)
   - Teeth/Gums (Dental)
   - Genetic conditions (Genetics)

For severe or concerning symptoms, please seek immediate medical attention!`;
      }
      
      return conditions[maxProbIndex].response;
    } catch (error) {
      console.error('Error making general prediction:', error);
      throw error;
    }
  }
}