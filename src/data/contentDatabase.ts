export interface ContentItem {
  id: string;
  title: string;
  titleTamil?: string;
  description: string;
  descriptionTamil?: string;
  genre: string;
  year?: number;
  rating?: number;
  language: 'english' | 'tamil' | 'both';
  image?: string;
}

export interface ContentDatabase {
  movies: { [emotion: string]: ContentItem[] };
  songs: { [emotion: string]: ContentItem[] };
  books: { [emotion: string]: ContentItem[] };
}

export const contentDatabase: ContentDatabase = {
  movies: {
    happy: [
      {
        id: 'mov1',
        title: 'The Pursuit of Happyness',
        description: 'An inspiring story of determination and success',
        genre: 'Drama',
        year: 2006,
        rating: 8.0,
        language: 'english'
      },
      {
        id: 'mov2',
        title: 'Moana',
        description: 'A spirited Polynesian teenager sails across the Pacific',
        genre: 'Animation',
        year: 2016,
        rating: 7.6,
        language: 'english'
      },
      {
        id: 'mov3',
        title: 'Vikram Vedha',
        titleTamil: 'விக்ரம் வேதா',
        description: 'A clever cat-and-mouse game between a cop and a gangster',
        descriptionTamil: 'ஒரு போலீஸ் மற்றும் ஒரு கேங்ஸ்டர் இடையே நடக்கும் புத்திசாலித்தனமான விளையாட்டு',
        genre: 'Action Thriller',
        year: 2017,
        rating: 8.4,
        language: 'tamil'
      },
      {
        id: 'mov4',
        title: 'Super Deluxe',
        titleTamil: 'சூப்பர் டீலக்ஸ்',
        description: 'An anthology of interconnected stories',
        descriptionTamil: 'ஒன்றோடொன்று தொடர்புடைய கதைகளின் தொகுப்பு',
        genre: 'Drama',
        year: 2019,
        rating: 8.3,
        language: 'tamil'
      }
    ],
    sad: [
      {
        id: 'mov5',
        title: 'Inside Out',
        description: 'A young girl struggles with moving to a new city',
        genre: 'Animation',
        year: 2015,
        rating: 8.1,
        language: 'english'
      },
      {
        id: 'mov6',
        title: 'Manchester by the Sea',
        description: 'A man confronts his tragic past',
        genre: 'Drama',
        year: 2016,
        rating: 7.8,
        language: 'english'
      },
      {
        id: 'mov7',
        title: 'Kaaka Muttai',
        titleTamil: 'காக்கா முட்டை',
        description: 'Two slum boys dream of eating pizza',
        descriptionTamil: 'இரு குழந்தைகள் பிஸ்ஸா சாப்பிட வேண்டும் என்று கனவு காண்கின்றனர்',
        genre: 'Drama',
        year: 2014,
        rating: 8.1,
        language: 'tamil'
      }
    ],
    angry: [
      {
        id: 'mov8',
        title: 'Mad Max: Fury Road',
        description: 'A post-apocalyptic action adventure',
        genre: 'Action',
        year: 2015,
        rating: 8.1,
        language: 'english'
      },
      {
        id: 'mov9',
        title: 'Visaranai',
        titleTamil: 'விசாரணை',
        description: 'A hard-hitting tale of police brutality',
        descriptionTamil: 'போலீஸ் கொடுமையைப் பற்றிய கடுமையான கதை',
        genre: 'Crime Drama',
        year: 2015,
        rating: 8.0,
        language: 'tamil'
      }
    ],
    surprised: [
      {
        id: 'mov10',
        title: 'Inception',
        description: 'A mind-bending thriller about dreams within dreams',
        genre: 'Sci-Fi',
        year: 2010,
        rating: 8.8,
        language: 'english'
      },
      {
        id: 'mov11',
        title: 'Thani Oruvan',
        titleTamil: 'தனி ஒருவன்',
        description: 'An honest cop battles a brilliant criminal',
        descriptionTamil: 'ஒரு நேர்மையான காவலர் புத்திசாலியான குற்றவாளியுடன் போராடுகிறார்',
        genre: 'Action Thriller',
        year: 2015,
        rating: 8.2,
        language: 'tamil'
      }
    ],
    fear: [
      {
        id: 'mov12',
        title: 'Get Out',
        description: 'A young man uncovers disturbing secrets',
        genre: 'Horror Thriller',
        year: 2017,
        rating: 7.7,
        language: 'english'
      },
      {
        id: 'mov13',
        title: 'Yaamirukka Bayamey',
        titleTamil: 'யாமிருக்க பயமே',
        description: 'A horror comedy about ghosts in a mansion',
        descriptionTamil: 'ஒரு பெரிய வீட்டில் பேய்களைப் பற்றிய திகில் நகைச்சுவை',
        genre: 'Horror Comedy',
        year: 2014,
        rating: 6.8,
        language: 'tamil'
      }
    ],
    neutral: [
      {
        id: 'mov14',
        title: 'The Social Network',
        description: 'The story of Facebook\'s creation',
        genre: 'Biography',
        year: 2010,
        rating: 7.7,
        language: 'english'
      },
      {
        id: 'mov15',
        title: '96',
        titleTamil: '96',
        description: 'A nostalgic love story between high school sweethearts',
        descriptionTamil: 'உயர்நிலைப் பள்ளி காதலர்களின் ஏக்கம் நிறைந்த காதல் கதை',
        genre: 'Romance',
        year: 2018,
        rating: 8.5,
        language: 'tamil'
      }
    ]
  },
  songs: {
    happy: [
      {
        id: 'song1',
        title: 'Happy',
        description: 'Pharrell Williams - Uplifting pop anthem',
        genre: 'Pop',
        year: 2013,
        language: 'english'
      },
      {
        id: 'song2',
        title: 'Maari Thara Local',
        titleTamil: 'மாரி தார லோக்கல்',
        description: 'From Maari - Energetic folk song',
        descriptionTamil: 'மாரி படத்திலிருந்து - ஆற்றல் மிக்க நாட்டுப்புற பாடல்',
        genre: 'Folk',
        year: 2015,
        language: 'tamil'
      },
      {
        id: 'song3',
        title: 'Don\'t Worry Be Happy',
        description: 'Bobby McFerrin - Feel-good classic',
        genre: 'Reggae',
        year: 1988,
        language: 'english'
      }
    ],
    sad: [
      {
        id: 'song4',
        title: 'Someone Like You',
        description: 'Adele - Heart-wrenching ballad',
        genre: 'Pop Ballad',
        year: 2011,
        language: 'english'
      },
      {
        id: 'song5',
        title: 'Yaakai Thiri',
        titleTamil: 'யாக்கை திரி',
        description: 'From 96 - Melancholic melody about lost love',
        descriptionTamil: '96 படத்திலிருந்து - இழந்த காதலைப் பற்றிய சோகமான பாடல்',
        genre: 'Melody',
        year: 2018,
        language: 'tamil'
      }
    ],
    angry: [
      {
        id: 'song6',
        title: 'We Will Rock You',
        description: 'Queen - Powerful anthem',
        genre: 'Rock',
        year: 1977,
        language: 'english'
      },
      {
        id: 'song7',
        title: 'Vaathi Coming',
        titleTamil: 'வாத்தி கமிங்',
        description: 'From Master - High-energy mass song',
        descriptionTamil: 'மாஸ்டர் படத்திலிருந்து - அதிக ஆற்றல் கொண்ட வெகுஜன பாடல்',
        genre: 'Mass',
        year: 2021,
        language: 'tamil'
      }
    ],
    surprised: [
      {
        id: 'song8',
        title: 'Bohemian Rhapsody',
        description: 'Queen - Epic rock opera',
        genre: 'Rock Opera',
        year: 1975,
        language: 'english'
      },
      {
        id: 'song9',
        title: 'Aalaporaan Thamizhan',
        titleTamil: 'ஆளாபோறான் தமிழன்',
        description: 'From Mersal - Patriotic anthem',
        descriptionTamil: 'மெர்சல் படத்திலிருந்து - தேசபக்தி பாடல்',
        genre: 'Patriotic',
        year: 2017,
        language: 'tamil'
      }
    ],
    fear: [
      {
        id: 'song10',
        title: 'Thriller',
        description: 'Michael Jackson - Spooky pop classic',
        genre: 'Pop',
        year: 1982,
        language: 'english'
      }
    ],
    neutral: [
      {
        id: 'song11',
        title: 'Imagine',
        description: 'John Lennon - Peaceful anthem',
        genre: 'Folk Rock',
        year: 1971,
        language: 'english'
      },
      {
        id: 'song12',
        title: 'Munbe Vaa',
        titleTamil: 'முன்பே வா',
        description: 'From Sillunu Oru Kaadhal - Romantic melody',
        descriptionTamil: 'சில்லுனு ஒரு காதல் படத்திலிருந்து - காதல் மெலடி',
        genre: 'Romance',
        year: 2006,
        language: 'tamil'
      }
    ]
  },
  books: {
    happy: [
      {
        id: 'book1',
        title: 'The Alchemist',
        description: 'Paulo Coelho - A journey of self-discovery',
        genre: 'Fiction',
        year: 1988,
        rating: 3.9,
        language: 'english'
      },
      {
        id: 'book2',
        title: 'Ponniyin Selvan',
        titleTamil: 'பொன்னியின் செல்வன்',
        description: 'Kalki - Epic historical novel about Chola dynasty',
        descriptionTamil: 'கல்கி - சோழர் வம்சத்தைப் பற்றிய வரலாற்று நாவல்',
        genre: 'Historical Fiction',
        year: 1955,
        rating: 4.5,
        language: 'tamil'
      }
    ],
    sad: [
      {
        id: 'book3',
        title: 'The Fault in Our Stars',
        description: 'John Green - A touching love story',
        genre: 'Young Adult',
        year: 2012,
        rating: 4.0,
        language: 'english'
      },
      {
        id: 'book4',
        title: 'Sivagamiyin Sabadham',
        titleTamil: 'சிவகாமியின் சபதம்',
        description: 'Kalki - Tragic tale of love and sacrifice',
        descriptionTamil: 'கல்கி - காதல் மற்றும் தியாகத்தின் சோகமான கதை',
        genre: 'Historical Fiction',
        year: 1944,
        rating: 4.3,
        language: 'tamil'
      }
    ],
    angry: [
      {
        id: 'book5',
        title: '1984',
        description: 'George Orwell - Dystopian classic about oppression',
        genre: 'Dystopian Fiction',
        year: 1949,
        rating: 4.2,
        language: 'english'
      }
    ],
    surprised: [
      {
        id: 'book6',
        title: 'The Da Vinci Code',
        description: 'Dan Brown - Mystery thriller with shocking revelations',
        genre: 'Mystery Thriller',
        year: 2003,
        rating: 3.8,
        language: 'english'
      }
    ],
    fear: [
      {
        id: 'book7',
        title: 'The Shining',
        description: 'Stephen King - Terrifying psychological horror',
        genre: 'Horror',
        year: 1977,
        rating: 4.2,
        language: 'english'
      }
    ],
    neutral: [
      {
        id: 'book8',
        title: 'Sapiens',
        description: 'Yuval Noah Harari - A brief history of humankind',
        genre: 'Non-fiction',
        year: 2011,
        rating: 4.4,
        language: 'english'
      },
      {
        id: 'book9',
        title: 'Arthamulla Indhu Matham',
        titleTamil: 'அர்த்தமுள்ள இந்து மதம்',
        description: 'Kannadasan - Philosophical insights into Hinduism',
        descriptionTamil: 'கண்ணதாசன் - இந்து மதத்தின் தத்துவ நுண்ணறிவுகள்',
        genre: 'Philosophy',
        year: 1972,
        rating: 4.2,
        language: 'tamil'
      }
    ]
  }
};