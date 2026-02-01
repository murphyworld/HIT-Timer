import { useState, useEffect, useCallback } from 'react';
import { Modal, Button, NumberInput } from '../common';
import { useSpeechRecognition, parseNumberFromSpeech } from '../../hooks/useSpeechRecognition';

interface RepInputModalProps {
  isOpen: boolean;
  setNumber: number;
  onSubmit: (reps: number) => void;
  onSkip: () => void;
}

export function RepInputModal({ isOpen, setNumber, onSubmit, onSkip }: RepInputModalProps) {
  const [reps, setReps] = useState(10);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const handleVoiceResult = useCallback(
    (result: { transcript: string }) => {
      const number = parseNumberFromSpeech(result.transcript);
      if (number !== null) {
        setReps(number);
        // Auto-submit after successful voice input
        setTimeout(() => onSubmit(number), 500);
      } else {
        setVoiceError(`Couldn't understand "${result.transcript}"`);
      }
    },
    [onSubmit]
  );

  const handleVoiceError = useCallback((error: string) => {
    if (error !== 'no-speech') {
      setVoiceError(`Voice error: ${error}`);
    }
  }, []);

  const { isListening, isSupported, startListening, stopListening } = useSpeechRecognition({
    onResult: handleVoiceResult,
    onError: handleVoiceError,
  });

  // Auto-start listening when modal opens
  useEffect(() => {
    if (isOpen && isSupported) {
      const timer = setTimeout(() => {
        startListening();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isSupported, startListening]);

  // Clear error after a few seconds
  useEffect(() => {
    if (voiceError) {
      const timer = setTimeout(() => setVoiceError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [voiceError]);

  const handleSubmit = () => {
    stopListening();
    onSubmit(reps);
  };

  return (
    <Modal isOpen={isOpen} onClose={onSkip} title={`Set ${setNumber} Complete`}>
      <div className="flex flex-col items-center gap-6">
        <p className="text-gray-600 dark:text-gray-400 text-center">
          How many reps did you complete?
        </p>

        {/* Voice indicator */}
        {isSupported && (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-red-500 animate-pulse'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <svg
                className={`w-8 h-8 ${isListening ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
              </svg>
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {isListening ? 'Listening...' : 'Tap to speak'}
            </span>
            {voiceError && (
              <span className="text-sm text-red-500">{voiceError}</span>
            )}
          </div>
        )}

        {/* Manual input */}
        <div className="w-full max-w-[200px]">
          <NumberInput
            value={reps}
            onChange={setReps}
            min={0}
            max={100}
            label="Reps"
          />
        </div>

        <div className="flex gap-3 w-full">
          <Button variant="secondary" onClick={onSkip} fullWidth>
            Skip
          </Button>
          <Button onClick={handleSubmit} fullWidth>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
