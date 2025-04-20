import * as tf from '@tensorflow/tfjs';
import { load } from '@tensorflow-models/universal-sentence-encoder';
import { getOpenAIResponse } from '../lib/openai';

export abstract class BaseModel {
  protected encoder: any = null;
  protected model: tf.LayersModel | null = null;
  protected isLoading = false;
  protected isInitialized = false;
  protected specialty: string;
  private initializationPromise: Promise<void> | null = null;
  private retryAttempts = 0;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 2000; // 2 seconds

  constructor(specialty: string) {
    this.specialty = specialty;
  }

  async loadModel() {
    if (this.isInitialized) {
      return;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.isLoading = true;
    this.initializationPromise = this.initializeModel();

    try {
      await this.initializationPromise;
    } finally {
      this.isLoading = false;
      this.initializationPromise = null;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async initializeModel() {
    try {
      // Initialize TensorFlow.js backend with retries
      while (this.retryAttempts < this.MAX_RETRIES) {
        try {
          await tf.ready();
          console.log('TensorFlow.js initialized successfully');
          break;
        } catch (error) {
          this.retryAttempts++;
          if (this.retryAttempts >= this.MAX_RETRIES) {
            throw new Error('Failed to initialize TensorFlow.js after multiple attempts');
          }
          console.log(`TensorFlow.js initialization attempt ${this.retryAttempts} failed, retrying...`);
          await this.delay(this.RETRY_DELAY);
        }
      }

      // Load Universal Sentence Encoder with retries
      while (this.retryAttempts < this.MAX_RETRIES) {
        try {
          console.log('Loading Universal Sentence Encoder...');
          this.encoder = await load();
          console.log('Universal Sentence Encoder loaded successfully');
          break;
        } catch (error) {
          this.retryAttempts++;
          if (this.retryAttempts >= this.MAX_RETRIES) {
            throw new Error('Failed to load Universal Sentence Encoder after multiple attempts');
          }
          console.log(`Universal Sentence Encoder loading attempt ${this.retryAttempts} failed, retrying...`);
          await this.delay(this.RETRY_DELAY);
        }
      }

      // Train model with retries
      while (this.retryAttempts < this.MAX_RETRIES) {
        try {
          console.log('Training model...');
          await this.trainModel();
          console.log('Model training completed successfully');
          break;
        } catch (error) {
          this.retryAttempts++;
          if (this.retryAttempts >= this.MAX_RETRIES) {
            throw new Error('Failed to train model after multiple attempts');
          }
          console.log(`Model training attempt ${this.retryAttempts} failed, retrying...`);
          await this.delay(this.RETRY_DELAY);
        }
      }

      this.isInitialized = true;
      this.retryAttempts = 0;
    } catch (error) {
      console.error('Model initialization error:', error);
      await this.cleanup();
      throw error;
    }
  }

  protected abstract trainModel(): Promise<void>;
  protected abstract getModelPrediction(input: string, probabilities: Float32Array): Promise<string>;
  
  async predictCondition(input: string): Promise<string> {
    if (!this.isInitialized) {
      try {
        await this.loadModel();
      } catch (error) {
        console.error('Failed to initialize model during prediction:', error);
        return this.getOpenAIResponse(input);
      }
    }

    if (!this.encoder || !this.model) {
      return this.getOpenAIResponse(input);
    }

    try {
      const cleanedInput = input.toLowerCase().trim();
      
      // First get the embedding outside of tidy
      const embedding = await this.encoder.embed([cleanedInput]);
      
      // Then use tidy for the prediction
      const prediction = tf.tidy(() => {
        return this.model!.predict(embedding) as tf.Tensor;
      });

      // Get the data and dispose of tensors
      const probabilities = await prediction.data();
      prediction.dispose();
      embedding.dispose();

      const maxProb = Math.max(...probabilities);
      console.log(`Model confidence: ${maxProb.toFixed(2)}`);

      // If model confidence is low, use OpenAI
      if (maxProb < 0.5) {
        return this.getOpenAIResponse(input);
      }

      // Use the model's prediction
      return await this.getModelPrediction(cleanedInput, probabilities);
    } catch (error) {
      console.error('Prediction error:', error);
      // Ensure we clean up any tensors in case of error
      tf.disposeVariables();
      return this.getOpenAIResponse(input);
    }
  }

  private async getOpenAIResponse(input: string): Promise<string> {
    try {
      console.log('Using OpenAI for response');
      const response = await getOpenAIResponse(input, this.specialty);
      return response;
    } catch (error) {
      console.error('OpenAI error:', error);
      return `I apologize, but I'm having trouble processing your request. Please:

1. Rephrase your question with more specific details
2. Break down complex questions into simpler ones
3. Check your internet connection
4. Try again in a few moments

If the problem persists, please contact support.`;
    }
  }

  protected async cleanup() {
    try {
      // Dispose of TensorFlow.js resources
      if (this.model) {
        this.model.dispose();
        this.model = null;
      }

      // Clear any cached tensors
      tf.disposeVariables();
      
      // Reset all state
      this.encoder = null;
      this.isInitialized = false;
      this.isLoading = false;
      this.initializationPromise = null;
      this.retryAttempts = 0;

      // Force garbage collection if available
      if (window.gc) {
        window.gc();
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}