import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, CameraOff, RotateCcw } from 'lucide-react';
import { emotionService, type EmotionResult } from '@/services/emotionService';
import { cn } from '@/lib/utils';

interface EmotionDetectorProps {
  onEmotionDetected: (emotion: EmotionResult) => void;
  className?: string;
}

export const EmotionDetector: React.FC<EmotionDetectorProps> = ({
  onEmotionDetected,
  className
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsActive(true);
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
      console.error('Error accessing camera:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsActive(false);
    setCurrentEmotion(null);
  }, [stream]);

  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.videoWidth === 0) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // Check if face is present (basic detection)
      const faceDetected = emotionService.detectFaceInImage(canvas);
      
      if (faceDetected) {
        // Detect emotion from the captured frame
        const emotion = await emotionService.detectEmotion(canvas);
        
        if (emotion && emotion.confidence > 0.5) {
          console.log('Emotion detected:', emotion);
          setCurrentEmotion(emotion);
          onEmotionDetected(emotion);
        }
      } else {
        console.log('No face detected in frame');
      }
    } catch (err) {
      console.error('Error detecting emotion:', err);
    }
  }, [isActive, onEmotionDetected]);

  // Initialize emotion service
  useEffect(() => {
    emotionService.initialize().catch(console.error);
  }, []);

  // Capture frames periodically when active
  useEffect(() => {
    if (!isActive) return;

    // Initial capture after 2 seconds
    const initialTimeout = setTimeout(captureFrame, 2000);
    
    // Then capture every 3 seconds
    const interval = setInterval(captureFrame, 3000);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isActive, captureFrame]);

  const getEmotionDisplay = () => {
    if (!currentEmotion) return null;

    const emotionColor = emotionService.getEmotionColor(currentEmotion.emotion);
    const emotionIcon = emotionService.getEmotionIcon(currentEmotion.emotion);

    return (
      <div className="flex items-center gap-3 p-4 rounded-lg border" 
           style={{ borderColor: emotionColor, backgroundColor: `${emotionColor}15` }}>
        <div className="text-3xl">{emotionIcon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium capitalize">{currentEmotion.emotion}</span>
            <Badge variant="secondary">
              {Math.round(currentEmotion.confidence * 100)}%
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Detected {new Date(currentEmotion.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className={cn("p-6 bg-card/50 backdrop-blur-sm border-border/50", className)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Emotion Detection</h3>
          <div className="flex gap-2">
            {!isActive ? (
              <Button 
                onClick={startCamera} 
                disabled={isLoading}
                size="sm"
                className="emotion-glow"
              >
                <Camera className="w-4 h-4 mr-2" />
                {isLoading ? 'Starting...' : 'Start Camera'}
              </Button>
            ) : (
              <>
                <Button 
                  onClick={captureFrame} 
                  variant="outline" 
                  size="sm"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Analyze Now
                </Button>
                <Button 
                  onClick={stopCamera} 
                  variant="destructive" 
                  size="sm"
                >
                  <CameraOff className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={cn(
              "w-full rounded-lg bg-muted",
              isActive ? "block" : "hidden"
            )}
            style={{ maxHeight: '300px' }}
          />
          
          <canvas
            ref={canvasRef}
            className="hidden"
          />

          {!isActive && !error && (
            <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
              <div className="text-center text-muted-foreground">
                <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Click "Start Camera" to begin emotion detection</p>
              </div>
            </div>
          )}

          {isActive && (
            <div className="absolute top-2 right-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live
              </div>
            </div>
          )}
        </div>

        {currentEmotion && getEmotionDisplay()}
      </div>
    </Card>
  );
};