/// <reference types="vite/client" />

// Fix for Web Speech API
interface Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
} 