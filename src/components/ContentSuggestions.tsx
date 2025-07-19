import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Film, Music, BookOpen, Star, Calendar, Globe } from 'lucide-react';
import { contentDatabase, type ContentItem } from '@/data/contentDatabase';
import { emotionService, type EmotionResult } from '@/services/emotionService';
import { cn } from '@/lib/utils';

interface ContentSuggestionsProps {
  emotion: EmotionResult | null;
  className?: string;
}

export const ContentSuggestions: React.FC<ContentSuggestionsProps> = ({
  emotion,
  className
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'english' | 'tamil'>('all');

  const getContentForEmotion = (contentType: 'movies' | 'songs' | 'books'): ContentItem[] => {
    if (!emotion) return [];
    
    const emotionContent = contentDatabase[contentType][emotion.emotion] || [];
    
    if (selectedLanguage === 'all') {
      return emotionContent;
    }
    
    return emotionContent.filter(item => 
      item.language === selectedLanguage || item.language === 'both'
    );
  };

  const renderContentItem = (item: ContentItem, type: 'movies' | 'songs' | 'books') => {
    const emotionColor = emotion ? emotionService.getEmotionColor(emotion.emotion) : 'hsl(var(--primary))';
    
    return (
      <Card 
        key={item.id} 
        className="group hover:scale-105 transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/50"
        style={{
          background: `linear-gradient(135deg, hsl(var(--card)), ${emotionColor}10)`
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">
              {item.title}
              {item.titleTamil && (
                <div className="text-xs text-muted-foreground mt-1">
                  {item.titleTamil}
                </div>
              )}
            </h4>
            {item.language === 'tamil' && (
              <Badge variant="outline" className="text-xs ml-2">தமிழ்</Badge>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {item.description}
            {item.descriptionTamil && selectedLanguage === 'tamil' && (
              <span className="block mt-1">{item.descriptionTamil}</span>
            )}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {item.genre}
              </Badge>
              {item.year && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {item.year}
                </div>
              )}
            </div>
            {item.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {item.rating}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!emotion) {
    return (
      <Card className={cn("p-6 bg-card/50 backdrop-blur-sm border-border/50", className)}>
        <div className="text-center text-muted-foreground">
          <Film className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Start emotion detection to get personalized content suggestions</p>
        </div>
      </Card>
    );
  }

  const emotionColor = emotionService.getEmotionColor(emotion.emotion);
  const emotionIcon = emotionService.getEmotionIcon(emotion.emotion);

  return (
    <Card className={cn("bg-card/50 backdrop-blur-sm border-border/50", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="text-2xl">{emotionIcon}</div>
            <div>
              <div className="gradient-text">Content for You</div>
              <div className="text-sm font-normal text-muted-foreground">
                Based on your {emotion.emotion} mood
              </div>
            </div>
          </CardTitle>
          
          <div className="flex gap-2">
            <Button
              variant={selectedLanguage === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedLanguage('all')}
            >
              <Globe className="w-3 h-3 mr-1" />
              All
            </Button>
            <Button
              variant={selectedLanguage === 'english' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedLanguage('english')}
            >
              EN
            </Button>
            <Button
              variant={selectedLanguage === 'tamil' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedLanguage('tamil')}
            >
              தமிழ்
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="movies" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="movies" className="flex items-center gap-2">
              <Film className="w-4 h-4" />
              Movies
            </TabsTrigger>
            <TabsTrigger value="songs" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Songs
            </TabsTrigger>
            <TabsTrigger value="books" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Books
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="movies" className="space-y-3">
            <div className="grid gap-3">
              {getContentForEmotion('movies').map(item => 
                renderContentItem(item, 'movies')
              )}
              {getContentForEmotion('movies').length === 0 && (
                <div className="text-center text-muted-foreground py-6">
                  <Film className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No movies found for this filter</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="songs" className="space-y-3">
            <div className="grid gap-3">
              {getContentForEmotion('songs').map(item => 
                renderContentItem(item, 'songs')
              )}
              {getContentForEmotion('songs').length === 0 && (
                <div className="text-center text-muted-foreground py-6">
                  <Music className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No songs found for this filter</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="books" className="space-y-3">
            <div className="grid gap-3">
              {getContentForEmotion('books').map(item => 
                renderContentItem(item, 'books')
              )}
              {getContentForEmotion('books').length === 0 && (
                <div className="text-center text-muted-foreground py-6">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No books found for this filter</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};