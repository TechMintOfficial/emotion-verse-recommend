import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

export interface EmotionResult {
  emotion: string;
  confidence: number;
  timestamp: number;
}

export interface EmotionScore {
  label: string;
  score: number;
}

class EmotionService {
  private classifier: any = null;
  private isLoading = false;

  async initialize() {
    if (this.classifier || this.isLoading) return;
    
    this.isLoading = true;
    try {
      console.log('Loading emotion detection model...');
      this.classifier = await pipeline(
        'image-classification',
        'onnx-community/emotion-ferplus-8',
        { device: 'webgpu' }
      );
      console.log('Emotion detection model loaded successfully');
    } catch (error) {
      console.error('Error loading emotion detection model:', error);
      // Fallback to CPU if WebGPU fails
      this.classifier = await pipeline(
        'image-classification',
        'onnx-community/emotion-ferplus-8'
      );
    } finally {
      this.isLoading = false;
    }
  }

  async detectEmotion(imageElement: HTMLImageElement | HTMLCanvasElement): Promise<EmotionResult | null> {
    if (!this.classifier) {
      await this.initialize();
    }

    try {
      const results: EmotionScore[] = await this.classifier(imageElement);
      
      if (results && results.length > 0) {
        const topEmotion = results[0];
        return {
          emotion: this.mapEmotionLabel(topEmotion.label),
          confidence: topEmotion.score,
          timestamp: Date.now()
        };
      }
    } catch (error) {
      console.error('Error detecting emotion:', error);
    }

    return null;
  }

  private mapEmotionLabel(label: string): string {
    // Map model labels to our standard emotion names
    const emotionMap: { [key: string]: string } = {
      'happiness': 'happy',
      'joy': 'happy',
      'sadness': 'sad',
      'anger': 'angry',
      'surprise': 'surprised',
      'fear': 'fear',
      'disgust': 'disgusted',
      'neutral': 'neutral',
      'contempt': 'disgusted'
    };

    const lowercaseLabel = label.toLowerCase();
    return emotionMap[lowercaseLabel] || lowercaseLabel;
  }

  getEmotionColor(emotion: string): string {
    const colorMap: { [key: string]: string } = {
      'happy': 'hsl(var(--happy))',
      'sad': 'hsl(var(--sad))',
      'angry': 'hsl(var(--angry))',
      'surprised': 'hsl(var(--surprised))',
      'fear': 'hsl(var(--fear))',
      'disgusted': 'hsl(var(--disgusted))',
      'neutral': 'hsl(var(--neutral))'
    };

    return colorMap[emotion] || 'hsl(var(--neutral))';
  }

  getEmotionIcon(emotion: string): string {
    const iconMap: { [key: string]: string } = {
      'happy': '😊',
      'sad': '😢',
      'angry': '😠',
      'surprised': '😲',
      'fear': '😨',
      'disgusted': '🤢',
      'neutral': '😐'
    };

    return iconMap[emotion] || '😐';
  }
}

export const emotionService = new EmotionService();