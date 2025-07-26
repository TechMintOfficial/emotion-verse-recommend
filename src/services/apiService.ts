// API service for content recommendations using real APIs

export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string;
  year: number;
  rating: number;
  image: string;
  officialUrl: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  description: string;
  genre: string;
  year?: number;
  image: string;
  officialUrl: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  year?: number;
  rating?: number;
  image: string;
  officialUrl: string;
}

class ApiService {
  private tmdbApiKey = '01e39e215b7a2d6953a1c8ac8a49743f'; // Public API key
  private tmdbBaseUrl = 'https://api.themoviedb.org/3';
  private tmdbImageUrl = 'https://image.tmdb.org/t/p/w500';

  private getSpotifyCredentials() {
    return {
      clientId: localStorage.getItem('spotify_client_id') || '',
      clientSecret: localStorage.getItem('spotify_client_secret') || ''
    };
  }

  private async getSpotifyToken(): Promise<string | null> {
    const { clientId, clientSecret } = this.getSpotifyCredentials();
    
    if (!clientId || !clientSecret) {
      console.warn('Spotify credentials not found');
      return null;
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        throw new Error(`Spotify auth error: ${response.status}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Spotify authentication error:', error);
      return null;
    }
  }

  async getMoviesByEmotion(emotion: string): Promise<Movie[]> {
    try {
      const genreMap: { [key: string]: string } = {
        'happy': 'comedy',
        'sad': 'drama',
        'angry': 'action',
        'surprised': 'thriller',
        'fear': 'horror',
        'disgusted': 'documentary',
        'neutral': 'adventure'
      };

      const searchTerm = genreMap[emotion] || 'popular';
      const response = await fetch(
        `${this.tmdbBaseUrl}/search/movie?api_key=${this.tmdbApiKey}&query=${searchTerm}&sort_by=popularity.desc&page=1`
      );

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.results.slice(0, 8).map((movie: any) => ({
        id: movie.id.toString(),
        title: movie.title,
        description: movie.overview || 'No description available',
        genre: searchTerm,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : 2024,
        rating: movie.vote_average,
        image: movie.poster_path ? `${this.tmdbImageUrl}${movie.poster_path}` : '/placeholder.svg',
        officialUrl: `https://www.themoviedb.org/movie/${movie.id}`
      }));
    } catch (error) {
      console.error('Error fetching movies:', error);
      return this.getFallbackMovies(emotion);
    }
  }

  async getSongsByEmotion(emotion: string): Promise<Song[]> {
    const token = await this.getSpotifyToken();
    
    if (!token) {
      return this.getFallbackSongs(emotion);
    }

    try {
      const moodMap: { [key: string]: string } = {
        'happy': 'happy upbeat',
        'sad': 'sad melancholy',
        'angry': 'angry rock',
        'surprised': 'energetic dance',
        'fear': 'calm relaxing',
        'disgusted': 'chill ambient',
        'neutral': 'popular hits'
      };

      const searchTerm = moodMap[emotion] || 'popular';
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track&limit=8`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.tracks.items.map((track: any) => ({
        id: track.id,
        title: track.name,
        artist: track.artists[0]?.name || 'Unknown Artist',
        description: `${track.artists[0]?.name} - ${track.album.name}`,
        genre: searchTerm,
        year: track.album.release_date ? new Date(track.album.release_date).getFullYear() : undefined,
        image: track.album.images[1]?.url || track.album.images[0]?.url || '/placeholder.svg',
        officialUrl: track.external_urls.spotify
      }));
    } catch (error) {
      console.error('Error fetching songs:', error);
      return this.getFallbackSongs(emotion);
    }
  }

  async getBooksByEmotion(emotion: string): Promise<Book[]> {
    try {
      const bookMap: { [key: string]: string } = {
        'happy': 'uplifting inspirational books',
        'sad': 'comfort healing books',
        'angry': 'mindfulness meditation books',
        'surprised': 'adventure mystery books',
        'fear': 'courage self-help books',
        'disgusted': 'philosophy wisdom books',
        'neutral': 'bestseller popular books'
      };

      const searchTerm = bookMap[emotion] || 'popular books';
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&maxResults=8&orderBy=relevance`
      );

      if (!response.ok) {
        throw new Error(`Google Books API error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.items?.map((book: any) => ({
        id: book.id,
        title: book.volumeInfo.title || 'Unknown Title',
        author: book.volumeInfo.authors?.[0] || 'Unknown Author',
        description: book.volumeInfo.description || 'No description available',
        genre: searchTerm,
        year: book.volumeInfo.publishedDate ? new Date(book.volumeInfo.publishedDate).getFullYear() : undefined,
        rating: book.volumeInfo.averageRating,
        image: book.volumeInfo.imageLinks?.thumbnail || '/placeholder.svg',
        officialUrl: book.volumeInfo.infoLink || `https://books.google.com/books?id=${book.id}`
      })) || [];
    } catch (error) {
      console.error('Error fetching books:', error);
      return this.getFallbackBooks(emotion);
    }
  }

  private getFallbackMovies(emotion: string): Movie[] {
    const fallbackMovies: { [key: string]: Movie[] } = {
      'happy': [
        {
          id: 'fallback1',
          title: 'The Pursuit of Happyness',
          description: 'A struggling salesman takes custody of his son as they\'re both about to be evicted.',
          genre: 'Drama',
          year: 2006,
          rating: 8.0,
          image: '/placeholder.svg',
          officialUrl: 'https://www.imdb.com/title/tt0454921/'
        }
      ]
    };
    return fallbackMovies[emotion] || [];
  }

  private getFallbackSongs(emotion: string): Song[] {
    const fallbackSongs: { [key: string]: Song[] } = {
      'happy': [
        {
          id: 'fallback1',
          title: 'Happy',
          artist: 'Pharrell Williams',
          description: 'Pharrell Williams - Uplifting pop anthem',
          genre: 'Pop',
          year: 2013,
          image: '/placeholder.svg',
          officialUrl: 'https://open.spotify.com/track/60nZcImufyMA1MKQY3dcCH'
        }
      ]
    };
    return fallbackSongs[emotion] || [];
  }

  private getFallbackBooks(emotion: string): Book[] {
    const fallbackBooks: { [key: string]: Book[] } = {
      'happy': [
        {
          id: 'fallback1',
          title: 'The Alchemist',
          author: 'Paulo Coelho',
          description: 'A philosophical book about following your dreams.',
          genre: 'Fiction',
          year: 1988,
          rating: 3.9,
          image: '/placeholder.svg',
          officialUrl: 'https://www.goodreads.com/book/show/865.The_Alchemist'
        }
      ]
    };
    return fallbackBooks[emotion] || [];
  }
}

export const apiService = new ApiService();