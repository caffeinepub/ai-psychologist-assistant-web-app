import { useState, useRef, useEffect } from 'react';
import { useGetStaticMessage, useGetStaticAssistantMessage } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Send, Wind } from 'lucide-react';
import { toast } from 'sonner';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { useCalmModeStore } from '../stores/calmModeStore';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { data: welcomeMessage } = useGetStaticMessage();
  const { data: assistantMessage } = useGetStaticAssistantMessage();
  const { setOpen: setCalmModeOpen } = useCalmModeStore();

  useEffect(() => {
    if (welcomeMessage && messages.length === 0) {
      setMessages([
        {
          id: '1',
          sender: 'assistant',
          text: welcomeMessage,
          timestamp: new Date(),
        },
      ]);
    }
  }, [welcomeMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const simulateAssistantResponse = (userMessage: string) => {
    setIsTyping(true);

    setTimeout(() => {
      const lowerMessage = userMessage.toLowerCase();
      let response = '';

      // Detect anxiety/stress keywords
      if (
        lowerMessage.includes('anxious') ||
        lowerMessage.includes('anxiety') ||
        lowerMessage.includes('stress') ||
        lowerMessage.includes('worried') ||
        lowerMessage.includes('panic')
      ) {
        response = `I hear that you're feeling anxious right now. That must be really difficult. Would you like to try a calming breathing exercise? It can help ground you in this moment. Remember, you're not alone in this.`;
      }
      // Detect sadness/depression keywords
      else if (
        lowerMessage.includes('sad') ||
        lowerMessage.includes('depressed') ||
        lowerMessage.includes('lonely') ||
        lowerMessage.includes('down')
      ) {
        response = `I'm sorry you're feeling this way. Your feelings are valid, and it's okay to not be okay sometimes. Can you tell me a bit more about what's been weighing on your heart?`;
      }
      // Detect crisis keywords
      else if (
        lowerMessage.includes('hurt myself') ||
        lowerMessage.includes('end it') ||
        lowerMessage.includes('suicide') ||
        lowerMessage.includes('die')
      ) {
        response = `I'm really concerned about what you're sharing. Your life matters, and there are people who want to help. Please reach out to a mental health professional or crisis helpline immediately. In many countries, you can call emergency services or a suicide prevention hotline. You don't have to face this alone.`;
      }
      // General supportive response
      else {
        response =
          assistantMessage ||
          `Thank you for sharing that with me. I'm here to listen and support you. How are you feeling right now? Take your time, there's no rush.`;
      }

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'assistant',
          text: response,
          timestamp: new Date(),
        },
      ]);
    }, 1500 + Math.random() * 1000);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    simulateAssistantResponse(userMessage.text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex-1 flex flex-col container mx-auto px-4 py-6 max-w-4xl">
      <Card className="flex-1 flex flex-col bg-white/90 dark:bg-calm-800/90 backdrop-blur-sm border-calm-200 dark:border-calm-700 shadow-lg overflow-hidden">
        <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        </ScrollArea>

        <div className="border-t border-calm-200 dark:border-calm-700 p-4 bg-white/50 dark:bg-calm-900/50 backdrop-blur-sm">
          <div className="flex gap-2 items-end">
            <Button
              onClick={() => setCalmModeOpen(true)}
              variant="outline"
              size="icon"
              className="shrink-0 border-calm-300 dark:border-calm-600 hover:bg-calm-100 dark:hover:bg-calm-700"
              title="Open Calm Mode"
            >
              <Wind className="w-5 h-5 text-calm-600 dark:text-calm-300" />
            </Button>
            
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Share what's on your mind..."
              className="resize-none min-h-[44px] max-h-[120px] border-calm-300 dark:border-calm-600 focus:border-calm-500 dark:focus:border-calm-400 bg-white dark:bg-calm-800"
              rows={1}
            />
            
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="shrink-0 bg-gradient-to-r from-calm-500 to-calm-600 hover:from-calm-600 hover:to-calm-700 text-white"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-calm-500 dark:text-calm-500 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </Card>
    </div>
  );
}
