import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Film, Music, BookOpen, Star, Calendar, Globe, ExternalLink } from 'lucide-react';
import { apiService, type Movie, type Song, type Book } from '@/services/apiService';
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
  const [content, setContent] = useState<{ movies: Movie[], songs: Song[], books: Book[] }>({
    movies: [], songs: [], books: []
  });
  const [loading, setLoading] = useState(false);

  const loadContent = async () => {
    if (!emotion) return;
    
    setLoading(true);
    try {
      const [movies, songs, books] = await Promise.all([
        apiService.getMoviesByEmotion(emotion.emotion),
        apiService.getSongsByEmotion(emotion.emotion),
        apiService.getBooksByEmotion(emotion.emotion)
      ]);
      
      setContent({ movies, songs, books });
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadContent();
  }, [emotion]);

  const handleContentClick = (item: Movie | Song | Book) => {
    if (item.officialUrl) {
      window.open(item.officialUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const renderContentItem = (item: Movie | Song | Book, type: 'movies' | 'songs' | 'books') => {
    const emotionColor = emotion ? emotionService.getEmotionColor(emotion.emotion) : 'hsl(var(--primary))';
    
    return (
      <Card 
        key={item.id} 
        className="group hover:scale-105 transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/50"
        style={{
          background: `linear-gradient(135deg, hsl(var(--card)), ${emotionColor}10)`
        }}
        onClick={() => handleContentClick(item)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">
              {item.title}
              {'artist' in item && (
                <div className="text-xs text-muted-foreground mt-1">
                  by {item.artist}
                </div>
              )}
              {'author' in item && (
                <div className="text-xs text-muted-foreground mt-1">
                  by {item.author}
                </div>
              )}
            </h4>
            <div className="flex items-center gap-2">
              {item.officialUrl && (
                <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {item.description}
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
            {('rating' in item && item.rating) && (
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
          
          {loading && (
            <Badge variant="secondary">
              Loading...
            </Badge>
          )}
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
              {content.movies.map(item => 
                renderContentItem(item, 'movies')
              )}
              {content.movies.length === 0 && !loading && (
                <div className="text-center text-muted-foreground py-6">
                  <Film className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No movies found for this emotion</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="songs" className="space-y-3">
            <div className="grid gap-3">
              {content.songs.map(item => 
                renderContentItem(item, 'songs')
              )}
              {content.songs.length === 0 && !loading && (
                <div className="text-center text-muted-foreground py-6">
                  <Music className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No songs found for this emotion</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="books" className="space-y-3">
            <div className="grid gap-3">
              {content.books.map(item => 
                renderContentItem(item, 'books')
              )}
              {content.books.length === 0 && !loading && (
                <div className="text-center text-muted-foreground py-6">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No books found for this emotion</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};