import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Globe } from 'lucide-react';
import { chatbotService, type ChatMessage } from '@/services/chatbotService';
import { emotionService, type EmotionResult } from '@/services/emotionService';
import { cn } from '@/lib/utils';

interface EmotionalChatbotProps {
  emotion: EmotionResult | null;
  className?: string;
}

export const EmotionalChatbot: React.FC<EmotionalChatbotProps> = ({
  emotion,
  className
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ta'>('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send welcome message when emotion changes
  useEffect(() => {
    if (emotion && messages.length === 0) {
      const welcomeResponse = chatbotService.getEmotionalResponse(emotion.emotion, language);
      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        text: welcomeResponse.response,
        sender: 'bot',
        timestamp: Date.now(),
        emotion: emotion.emotion
      };
      
      setMessages([botMessage]);
      chatbotService.addToContext(botMessage);
    }
  }, [emotion, language, messages.length]);

  const handleSend = async () => {
    if (!inputValue.trim() || !emotion) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    chatbotService.addToContext(userMessage);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = chatbotService.generateContextualResponse(
        inputValue,
        emotion.emotion,
        language
      );

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: Date.now(),
        emotion: emotion.emotion
      };

      setMessages(prev => [...prev, botMessage]);
      chatbotService.addToContext(botMessage);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay 1-2 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const renderMessage = (message: ChatMessage) => {
    const isBot = message.sender === 'bot';
    const emotionColor = message.emotion 
      ? emotionService.getEmotionColor(message.emotion)
      : 'hsl(var(--primary))';

    return (
      <div
        key={message.id}
        className={cn(
          "flex gap-3 mb-4",
          isBot ? "justify-start" : "justify-end"
        )}
      >
        {isBot && (
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
            style={{ backgroundColor: emotionColor }}
          >
            <Bot className="w-4 h-4" />
          </div>
        )}
        
        <div
          className={cn(
            "max-w-[80%] rounded-lg p-3 text-sm",
            isBot 
              ? "bg-card/80 border text-foreground" 
              : "bg-primary text-primary-foreground ml-auto"
          )}
          style={isBot ? { borderColor: emotionColor + '40' } : {}}
        >
          <div className="whitespace-pre-wrap">{message.text}</div>
          <div className="text-xs opacity-70 mt-1">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>

        {!isBot && (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
            <User className="w-4 h-4" />
          </div>
        )}
      </div>
    );
  };

  const suggestions = emotion 
    ? chatbotService.getContextualSuggestions(emotion.emotion, language)
    : [];

  return (
    <Card className={cn("flex flex-col bg-card/50 backdrop-blur-sm border-border/50", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <div className="gradient-text">Emotion Buddy</div>
              <div className="text-sm font-normal text-muted-foreground">
                {emotion ? `Understanding your ${emotion.emotion} mood` : 'Here to help you'}
              </div>
            </div>
          </CardTitle>
          
          <div className="flex gap-1">
            <Button
              variant={language === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('en')}
            >
              EN
            </Button>
            <Button
              variant={language === 'ta' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('ta')}
            >
              தமிழ்
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 p-0">
        {/* Messages Area */}
        <div className="flex-1 p-4 space-y-2 min-h-[300px] max-h-[400px] overflow-y-auto">
          {messages.length === 0 && !emotion && (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground">
              <div>
                <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Start emotion detection to begin chatting!</p>
              </div>
            </div>
          )}
          
          {messages.map(renderMessage)}
          
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-card/80 border border-border/50 rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {suggestions.length > 0 && (
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-border/50">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === 'ta' ? "உங்கள் செய்தியை தட்டச்சு செய்யுங்கள்..." : "Type your message..."}
              disabled={!emotion}
              className="flex-1"
            />
            <Button 
              onClick={handleSend} 
              disabled={!inputValue.trim() || !emotion || isTyping}
              size="sm"
              className="emotion-glow"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};