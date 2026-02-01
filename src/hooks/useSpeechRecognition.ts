import { useState, useCallback, useRef, useEffect } from 'react';

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

interface UseSpeechRecognitionOptions {
  onResult?: (result: SpeechRecognitionResult) => void;
  onError?: (error: string) => void;
  continuous?: boolean;
}

// Define types for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

interface IWindow extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const { onResult, onError, continuous = false } = options;
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const windowWithSpeech = window as IWindow;
    const SpeechRecognitionAPI =
      windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = continuous;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const last = event.results.length - 1;
        const result = event.results[last];
        if (result.isFinal) {
          const transcript = result[0].transcript.trim();
          const confidence = result[0].confidence;
          onResult?.({ transcript, confidence });
        }
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false);
        onError?.(event.error);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [continuous, onResult, onError]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
  };
}

// Helper to extract numbers from speech
export function parseNumberFromSpeech(transcript: string): number | null {
  // Try to parse direct number
  const directNumber = parseInt(transcript, 10);
  if (!isNaN(directNumber) && directNumber >= 0 && directNumber <= 100) {
    return directNumber;
  }

  // Word to number mapping
  const wordToNumber: Record<string, number> = {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
    sixteen: 16,
    seventeen: 17,
    eighteen: 18,
    nineteen: 19,
    twenty: 20,
    thirty: 30,
    forty: 40,
    fifty: 50,
  };

  const lowerTranscript = transcript.toLowerCase();

  // Check for exact word match
  if (wordToNumber[lowerTranscript] !== undefined) {
    return wordToNumber[lowerTranscript];
  }

  // Check for compound numbers (e.g., "twenty five")
  for (const [word, value] of Object.entries(wordToNumber)) {
    if (lowerTranscript.includes(word)) {
      const remaining = lowerTranscript.replace(word, '').trim();
      if (remaining && wordToNumber[remaining] !== undefined) {
        return value + wordToNumber[remaining];
      }
      return value;
    }
  }

  // Try to find any number in the string
  const numberMatch = transcript.match(/\d+/);
  if (numberMatch) {
    const num = parseInt(numberMatch[0], 10);
    if (num >= 0 && num <= 100) {
      return num;
    }
  }

  return null;
}
