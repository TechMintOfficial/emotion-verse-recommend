import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApiKeysInputProps {
  className?: string;
}

export const ApiKeysInput: React.FC<ApiKeysInputProps> = ({ className }) => {
  const [showKeys, setShowKeys] = useState(false);
  const [keys, setKeys] = useState({
    faceplus_api_key: '',
    faceplus_api_secret: '',
    spotify_client_id: '',
    spotify_client_secret: '',
    xai_api_key: ''
  });

  const [savedKeys, setSavedKeys] = useState({
    faceplus_api_key: false,
    faceplus_api_secret: false,
    spotify_client_id: false,
    spotify_client_secret: false,
    xai_api_key: false
  });

  useEffect(() => {
    // Load existing keys from localStorage
    const loadedKeys = {
      faceplus_api_key: localStorage.getItem('faceplus_api_key') || '',
      faceplus_api_secret: localStorage.getItem('faceplus_api_secret') || '',
      spotify_client_id: localStorage.getItem('spotify_client_id') || '',
      spotify_client_secret: localStorage.getItem('spotify_client_secret') || '',
      xai_api_key: localStorage.getItem('xai_api_key') || ''
    };
    
    setKeys(loadedKeys);
    
    setSavedKeys({
      faceplus_api_key: !!loadedKeys.faceplus_api_key,
      faceplus_api_secret: !!loadedKeys.faceplus_api_secret,
      spotify_client_id: !!loadedKeys.spotify_client_id,
      spotify_client_secret: !!loadedKeys.spotify_client_secret,
      xai_api_key: !!loadedKeys.xai_api_key
    });

    // Set default values if they don't exist
    if (!loadedKeys.faceplus_api_key) {
      localStorage.setItem('faceplus_api_key', '4g8PQLQyaqfoyXWA2eLZNCrbN1x2H1Lj');
      setKeys(prev => ({ ...prev, faceplus_api_key: '4g8PQLQyaqfoyXWA2eLZNCrbN1x2H1Lj' }));
      setSavedKeys(prev => ({ ...prev, faceplus_api_key: true }));
    }
    if (!loadedKeys.faceplus_api_secret) {
      localStorage.setItem('faceplus_api_secret', 'm1oJpwyz3NHz1lE3ysCJGycHCOi7W9b-');
      setKeys(prev => ({ ...prev, faceplus_api_secret: 'm1oJpwyz3NHz1lE3ysCJGycHCOi7W9b-' }));
      setSavedKeys(prev => ({ ...prev, faceplus_api_secret: true }));
    }
    if (!loadedKeys.spotify_client_id) {
      localStorage.setItem('spotify_client_id', 'a4235ed83870475eafc28ade71588033');
      setKeys(prev => ({ ...prev, spotify_client_id: 'a4235ed83870475eafc28ade71588033' }));
      setSavedKeys(prev => ({ ...prev, spotify_client_id: true }));
    }
    if (!loadedKeys.spotify_client_secret) {
      localStorage.setItem('spotify_client_secret', 'ee4c3ed19adc4c25bc1c0193c8f93e6e');
      setKeys(prev => ({ ...prev, spotify_client_secret: 'ee4c3ed19adc4c25bc1c0193c8f93e6e' }));
      setSavedKeys(prev => ({ ...prev, spotify_client_secret: true }));
    }
    if (!loadedKeys.xai_api_key) {
      localStorage.setItem('xai_api_key', 'xai-x43wY12jqDq6ZmhfqGpC2wXHmM6PKGk7mvGyDfQ487U5vUsnxF0ntHIVDSUdcagUXHiDl1sULamPcx9x');
      setKeys(prev => ({ ...prev, xai_api_key: 'xai-x43wY12jqDq6ZmhfqGpC2wXHmM6PKGk7mvGyDfQ487U5vUsnxF0ntHIVDSUdcagUXHiDl1sULamPcx9x' }));
      setSavedKeys(prev => ({ ...prev, xai_api_key: true }));
    }
  }, []);

  const handleKeyChange = (keyName: string, value: string) => {
    setKeys(prev => ({ ...prev, [keyName]: value }));
  };

  const saveKey = (keyName: string) => {
    localStorage.setItem(keyName, keys[keyName as keyof typeof keys]);
    setSavedKeys(prev => ({ ...prev, [keyName]: true }));
  };

  const clearKey = (keyName: string) => {
    localStorage.removeItem(keyName);
    setKeys(prev => ({ ...prev, [keyName]: '' }));
    setSavedKeys(prev => ({ ...prev, [keyName]: false }));
  };

  const maskKey = (key: string) => {
    if (!key || key.length < 8) return key;
    return `${key.substring(0, 4)}${'*'.repeat(key.length - 8)}${key.substring(key.length - 4)}`;
  };

  const apiFields = [
    {
      key: 'faceplus_api_key',
      label: 'Face++ API Key',
      description: 'For facial emotion detection',
      service: 'Face++'
    },
    {
      key: 'faceplus_api_secret',
      label: 'Face++ API Secret',
      description: 'For facial emotion detection',
      service: 'Face++'
    },
    {
      key: 'spotify_client_id',
      label: 'Spotify Client ID',
      description: 'For music recommendations',
      service: 'Spotify'
    },
    {
      key: 'spotify_client_secret',
      label: 'Spotify Client Secret',
      description: 'For music recommendations',
      service: 'Spotify'
    },
    {
      key: 'xai_api_key',
      label: 'XAI API Key',
      description: 'For emotional chatbot (Grok)',
      service: 'XAI/Grok'
    }
  ];

  const allKeysConfigured = Object.values(savedKeys).every(Boolean);

  return (
    <Card className={cn("bg-card/50 backdrop-blur-sm border-border/50", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <Key className="w-5 h-5" />
          <div>
            <div className="gradient-text">API Configuration</div>
            <div className="text-sm font-normal text-muted-foreground">
              Configure your API keys for full functionality
            </div>
          </div>
          {allKeysConfigured && (
            <Badge variant="secondary" className="ml-auto">
              <CheckCircle className="w-3 h-3 mr-1" />
              Ready
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowKeys(!showKeys)}
          >
            {showKeys ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
            {showKeys ? 'Hide' : 'Show'} Keys
          </Button>
          
          {!allKeysConfigured && (
            <div className="flex items-center gap-1 text-amber-600 text-xs">
              <AlertCircle className="w-3 h-3" />
              Some APIs not configured
            </div>
          )}
        </div>

        <div className="space-y-4">
          {apiFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={field.key} className="text-sm font-medium">
                  {field.label}
                  <Badge variant="outline" className="ml-2 text-xs">
                    {field.service}
                  </Badge>
                </Label>
                
                <div className="flex items-center gap-2">
                  {savedKeys[field.key as keyof typeof savedKeys] ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  )}
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">{field.description}</p>
              
              <div className="flex gap-2">
                <Input
                  id={field.key}
                  type={showKeys ? "text" : "password"}
                  value={showKeys ? keys[field.key as keyof typeof keys] : maskKey(keys[field.key as keyof typeof keys])}
                  onChange={(e) => handleKeyChange(field.key, e.target.value)}
                  placeholder={`Enter your ${field.service} ${field.key.includes('secret') ? 'secret' : 'key'}...`}
                  className="flex-1"
                />
                
                <Button
                  size="sm"
                  variant={savedKeys[field.key as keyof typeof savedKeys] ? "secondary" : "default"}
                  onClick={() => savedKeys[field.key as keyof typeof savedKeys] ? clearKey(field.key) : saveKey(field.key)}
                  disabled={!keys[field.key as keyof typeof keys]}
                >
                  {savedKeys[field.key as keyof typeof savedKeys] ? 'Clear' : 'Save'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-muted/50">
          <h4 className="text-sm font-medium mb-2">Configuration Status</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span>Face++ (Emotion Detection)</span>
              <span className={savedKeys.faceplus_api_key && savedKeys.faceplus_api_secret ? 'text-green-600' : 'text-amber-600'}>
                {savedKeys.faceplus_api_key && savedKeys.faceplus_api_secret ? '✓ Configured' : '⚠ Missing'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Spotify (Music Recommendations)</span>
              <span className={savedKeys.spotify_client_id && savedKeys.spotify_client_secret ? 'text-green-600' : 'text-amber-600'}>
                {savedKeys.spotify_client_id && savedKeys.spotify_client_secret ? '✓ Configured' : '⚠ Missing'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>XAI/Grok (Chatbot)</span>
              <span className={savedKeys.xai_api_key ? 'text-green-600' : 'text-amber-600'}>
                {savedKeys.xai_api_key ? '✓ Configured' : '⚠ Missing'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>TMDB (Movies) & Google Books</span>
              <span className="text-green-600">✓ No key required</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};