export interface ChatMessage {
  id: string;
  text: string;
  textTamil?: string;
  sender: 'user' | 'bot';
  timestamp: number;
  emotion?: string;
}

export interface EmotionalResponse {
  response: string;
  responseTamil?: string;
  followUp?: string;
  followUpTamil?: string;
  actions?: string[];
}

class ChatbotService {
  private emotionalResponses: { [emotion: string]: EmotionalResponse[] } = {
    happy: [
      {
        response: "I can see you're in a great mood! 😊 That's wonderful to see. Would you like me to suggest some uplifting content to keep those good vibes going?",
        responseTamil: "நீங்கள் நல்ல மனநிலையில் இருப்பதை என்னால் பார்க்க முடிகிறது! 😊 அது பார்க்க அற்புதமாக இருக்கிறது. உங்கள் நல்ல உணர்வுகளை தொடர்ந்து வைக்க சில உற்சாகமான உள்ளடக்கங்களை பரிந்துரைக்கட்டுமா?",
        followUp: "What type of content would make you even happier right now?",
        followUpTamil: "இப்போது எந்த வகையான உள்ளடக்கம் உங்களை இன்னும் மகிழ்ச்சியாக ஆக்கும்?",
        actions: ["Show happy movies", "Play upbeat songs", "Suggest inspiring books"]
      },
      {
        response: "Your happiness is contagious! ✨ I love seeing that smile. Let me find some content that matches your joyful energy.",
        responseTamil: "உங்கள் மகிழ்ச்சி பரவக்கூடியது! ✨ அந்த புன்னகையைப் பார்ப்பது எனக்கு மிகவும் பிடிக்கிறது. உங்கள் மகிழ்ச்சியான ஆற்றலுக்கு பொருந்தும் சில உள்ளடக்கங்களைக் கண்டுபிடிக்கிறேன்.",
        actions: ["Explore feel-good content"]
      }
    ],
    sad: [
      {
        response: "I notice you seem a bit down today. 💙 It's okay to feel sad sometimes - emotions are part of being human. Would you like some gentle content to help you process these feelings?",
        responseTamil: "நீங்கள் இன்று கொஞ்சம் மனமுடைந்திருப்பதை என்னால் காண முடிகிறது. 💙 சில சமயங்களில் சோகமாக உணர்வது பரவாயில்லை - உணர்ச்சிகள் மனிதனாக இருப்பதன் ஒரு பகுதி. இந்த உணர்வுகளை சமாளிக்க சில மென்மையான உள்ளடக்கங்கள் வேண்டுமா?",
        followUp: "Sometimes it helps to watch something relatable or listen to music that understands your feelings.",
        followUpTamil: "சில சமயங்களில் தொடர்புடைய ஏதாவது பார்ப்பது அல்லது உங்கள் உணர்வுகளை புரிந்துகொள்ளும் இசையைக் கேட்பது உதவும்.",
        actions: ["Show comforting movies", "Play soothing music", "Suggest uplifting books"]
      },
      {
        response: "I'm here with you. 🤗 Sometimes we need content that helps us cry it out or find hope again. What would help you most right now?",
        responseTamil: "நான் உங்களுடன் இருக்கிறேன். 🤗 சில சமயங்களில் நமக்கு அழுவதற்கு அல்லது மீண்டும் நம்பிக்கையைக் கண்டுபிடிக்க உதவும் உள்ளடக்கம் தேவைப்படுகிறது. இப்போது உங்களுக்கு எது மிகவும் உதவும்?",
        actions: ["Find healing content"]
      }
    ],
    angry: [
      {
        response: "I can sense some intensity in your emotions right now. 🔥 Anger can be powerful - sometimes we need to channel it or find ways to release it constructively.",
        responseTamil: "இப்போது உங்கள் உணர்ச்சிகளில் சில தீவிரத்தை என்னால் உணர முடிகிறது. 🔥 கோபம் சக்திவாய்ந்ததாக இருக்கலாம் - சில சமயங்களில் நாம் அதை வழிநடத்த வேண்டும் அல்லது அதை ஆக்கபூர்வமாக வெளியிட வழிகளைக் கண்டுபிடிக்க வேண்டும்.",
        followUp: "Would you like some intense action content or something that helps you calm down?",
        followUpTamil: "உங்களுக்கு சில தீவிர அதிரடி உள்ளடக்கம் வேண்டுமா அல்லது உங்களை அமைதிப்படுத்த உதவும் ஏதாவது வேண்டுமா?",
        actions: ["Show action movies", "Play intense music", "Find calming content"]
      }
    ],
    surprised: [
      {
        response: "Wow, you look surprised! 😲 I love that expression - there's something exciting about being caught off guard in a good way. Want to explore some mind-blowing content?",
        responseTamil: "ஆஹா, நீங்கள் ஆச்சரியமாக இருக்கிறீர்கள்! 😲 அந்த வெளிப்பாடு எனக்கு மிகவும் பிடிக்கிறது - நல்ல விதத்தில் ஆச்சரியப்படுவதில் ஏதோ உற்சாகமான விஷயம் இருக்கிறது. மனதை வியப்பிக்கும் சில உள்ளடக்கங்களை ஆராய விரும்புகிறீர்களா?",
        actions: ["Show surprising movies", "Discover amazing content"]
      }
    ],
    fear: [
      {
        response: "I can see you might be feeling a bit scared or anxious. 🤗 That's completely normal. Would you like something comforting, or are you in the mood for some thrills?",
        responseTamil: "நீங்கள் கொஞ்சம் பயமாக அல்லது கவலையாக உணர்கிறீர்கள் என்பதை என்னால் பார்க்க முடிகிறது. 🤗 அது முற்றிலும் இயல்பானது. உங்களுக்கு ஏதாவது ஆறுதல் வேண்டுமா, அல்லது சில சிலிர்ப்பான விஷயங்கள் வேண்டுமா?",
        followUp: "Sometimes facing our fears through stories can help, or we can choose something gentle instead.",
        followUpTamil: "சில சமயங்களில் கதைகள் மூலம் நமது பயங்களை எதிர்கொள்வது உதவும், அல்லது அதற்கு பதிலாக மென்மையான ஏதாவதை தேர்வு செய்யலாம்.",
        actions: ["Find comforting content", "Explore gentle thrills"]
      }
    ],
    disgusted: [
      {
        response: "I notice you might be feeling a bit disgusted or uncomfortable. 😔 Sometimes we need content that cleanses the palate or lifts our spirits.",
        responseTamil: "நீங்கள் கொஞ்சம் வெறுப்பாக அல்லது சங்கடமாக உணர்கிறீர்கள் என்பதை என்னால் காண முடிகிறது. 😔 சில சமயங்களில் நமக்கு மனதை சுத்தப்படுத்தும் அல்லது ஆன்மாவை உயர்த்தும் உள்ளடக்கம் தேவைப்படுகிறது.",
        actions: ["Find uplifting content", "Show beautiful stories"]
      }
    ],
    neutral: [
      {
        response: "You seem pretty balanced right now! 😌 That's a great state to be in. What kind of content are you in the mood for?",
        responseTamil: "நீங்கள் இப்போது மிகவும் சமநிலையில் இருக்கிறீர்கள்! 😌 அது ஒரு சிறந்த நிலை. எந்த வகையான உள்ளடக்கத்திற்கு உங்களுக்கு மூட் இருக்கிறது?",
        followUp: "I can suggest anything from entertainment to educational content based on what you're feeling right now.",
        followUpTamil: "நீங்கள் இப்போது எப்படி உணர்கிறீர்கள் என்பதன் அடிப்படையில் பொழுதுபோக்கு முதல் கல்வி உள்ளடக்கம் வரை எதையும் பரிந்துரைக்க முடியும்.",
        actions: ["Explore all content", "Get personalized suggestions"]
      }
    ]
  };

  private conversationContext: ChatMessage[] = [];

  getEmotionalResponse(emotion: string, language: 'en' | 'ta' = 'en'): EmotionalResponse {
    const responses = this.emotionalResponses[emotion] || this.emotionalResponses.neutral;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      response: language === 'ta' && randomResponse.responseTamil ? randomResponse.responseTamil : randomResponse.response,
      followUp: language === 'ta' && randomResponse.followUpTamil ? randomResponse.followUpTamil : randomResponse.followUp,
      actions: randomResponse.actions
    };
  }

  generateContextualResponse(userInput: string, currentEmotion: string, language: 'en' | 'ta' = 'en'): string {
    const lowerInput = userInput.toLowerCase();
    
    // Check for specific keywords
    if (lowerInput.includes('movie') || lowerInput.includes('film') || (language === 'ta' && (lowerInput.includes('சினிமா') || lowerInput.includes('படம்')))) {
      return language === 'ta' 
        ? `உங்கள் ${currentEmotion} உணர்வுக்கு ஏற்ற சில அருமையான படங்களை பரிந்துரைக்கிறேன்! 🎬`
        : `I'd love to recommend some great movies that match your ${currentEmotion} mood! 🎬`;
    }
    
    if (lowerInput.includes('song') || lowerInput.includes('music') || (language === 'ta' && (lowerInput.includes('பாடல்') || lowerInput.includes('இசை')))) {
      return language === 'ta'
        ? `உங்கள் உணர்வுக்கு பொருந்தும் அற்புதமான பாடல்கள் உள்ளன! 🎵`
        : `I have some amazing songs that fit your current vibe! 🎵`;
    }
    
    if (lowerInput.includes('book') || lowerInput.includes('read') || (language === 'ta' && (lowerInput.includes('புத்தகம்') || lowerInput.includes('படிக்க')))) {
      return language === 'ta'
        ? `உங்கள் மனநிலைக்கு ஏற்ற சில அருமையான புத்தகங்களை பரிந்துரைக்கிறேன்! 📚`
        : `Let me suggest some wonderful books that align with your current mindset! 📚`;
    }

    // Emotion-specific responses
    const emotionalResponse = this.getEmotionalResponse(currentEmotion, language);
    return emotionalResponse.response;
  }

  addToContext(message: ChatMessage): void {
    this.conversationContext.push(message);
    // Keep only last 10 messages for context
    if (this.conversationContext.length > 10) {
      this.conversationContext = this.conversationContext.slice(-10);
    }
  }

  getContextualSuggestions(emotion: string, language: 'en' | 'ta' = 'en'): string[] {
    const suggestions: { [key: string]: string[] } = {
      happy: language === 'ta' 
        ? ['மகிழ்ச்சியான படங்கள் காட்டு', 'உற்சாகமான பாடல்கள் பாடு', 'உத்வேகம் தரும் புத்தகங்கள் பரிந்துரை'] 
        : ['Show me happy movies', 'Play upbeat songs', 'Suggest inspiring books'],
      sad: language === 'ta'
        ? ['ஆறுதல் தரும் படங்கள்', 'மனதை அமைதிப்படுத்தும் இசை', 'நம்பிக்கை தரும் புத்தகங்கள்']
        : ['Comforting movies', 'Soothing music', 'Uplifting books'],
      angry: language === 'ta'
        ? ['அதிரடி படங்கள்', 'தீவிரமான இசை', 'அமைதிப்படுத்தும் உள்ளடக்கம்']
        : ['Action movies', 'Intense music', 'Calming content'],
      surprised: language === 'ta'
        ? ['ஆச்சரியமான படங்கள்', 'அசத்தும் உள்ளடக்கம்']
        : ['Mind-blowing movies', 'Amazing discoveries'],
      fear: language === 'ta'
        ? ['ஆறுதல் தரும் உள்ளடக்கம்', 'மென்மையான உள்ளடக்கம்']
        : ['Comforting content', 'Gentle entertainment'],
      neutral: language === 'ta'
        ? ['எல்லா உள்ளடக்கமும் ஆராய்', 'தனிப்பட்ட பரிந்துரைகள்']
        : ['Explore all content', 'Get personalized suggestions']
    };

    return suggestions[emotion] || suggestions.neutral;
  }
}

export const chatbotService = new ChatbotService();
