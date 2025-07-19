import React, { useState } from 'react';
import { EmotionDetector } from '@/components/EmotionDetector';
import { ContentSuggestions } from '@/components/ContentSuggestions';
import { EmotionalChatbot } from '@/components/EmotionalChatbot';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Heart, Sparkles } from 'lucide-react';
import { type EmotionResult } from '@/services/emotionService';

const Index = () => {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionResult | null>(null);

  const handleEmotionDetected = (emotion: EmotionResult) => {
    setCurrentEmotion(emotion);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 py-8 relative">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-primary/10 backdrop-blur-sm">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                EmotiSense
              </h1>
              <div className="p-3 rounded-full bg-primary/10 backdrop-blur-sm">
                <Heart className="w-8 h-8 text-primary" />
              </div>
            </div>
            
            <p className="text-xl text-muted-foreground mb-2">
              AI-Powered Emotion Detection & Content Recommendations
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Discover movies, songs, and books tailored to your current mood • English & Tamil Content
            </p>
            
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Real-time Analysis
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                Emotion-aware Chat
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Brain className="w-3 h-3" />
                Smart Recommendations
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Emotion Detection */}
          <div className="lg:col-span-1">
            <EmotionDetector 
              onEmotionDetected={handleEmotionDetected}
              className="h-fit"
            />
          </div>

          {/* Middle Column - Content Suggestions */}
          <div className="lg:col-span-1">
            <ContentSuggestions 
              emotion={currentEmotion}
              className="h-fit"
            />
          </div>

          {/* Right Column - Chatbot */}
          <div className="lg:col-span-1">
            <EmotionalChatbot 
              emotion={currentEmotion}
              className="h-fit"
            />
          </div>
        </div>

        {/* Additional Info */}
        <Card className="mt-8 p-6 bg-card/30 backdrop-blur-sm border-border/30">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-3 gradient-text">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground">1. Detect Emotion</p>
                  <p>AI analyzes your facial expressions in real-time</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground">2. Get Suggestions</p>
                  <p>Receive personalized content recommendations</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground">3. Chat & Explore</p>
                  <p>Interact with emotion-aware chatbot</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
