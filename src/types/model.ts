export type ModelCategory =
  | "chat"          // Default for most models
  | "audio-transcription"  // Whisper, etc.
  | "text-to-speech"       // PlayAI TTS
  | "vision"        // Multimodal models
  | "reasoning";    // Specialized logic 

export interface ModelMetadata {
  id: string;
  category: ModelCategory;
  name?: string;
  description?: string;
  supportsFileUpload?:boolean;
  supportsStreaming?:boolean;
}

export const MODEL_OVERRIDES: Record<string, ModelMetadata> = {
    // Speech-to-Text (STT) Models
    "whisper-large-v3": {
      id: "whisper-large-v3",
      category: "audio-transcription",
      name: "Whisper Large V3",
      description: "High-quality speech recognition",
      supportsFileUpload: true
    },
    "whisper-large-v3-turbo": {
      id: "whisper-large-v3-turbo",
      category: "audio-transcription",
      name: "Whisper Turbo",
      description: "Fast speech-to-text conversion",
      supportsFileUpload: true
    },
    "distil-whisper-large-v3-en": {
      id: "distil-whisper-large-v3-en",
      category: "audio-transcription",
      name: "Distilled Whisper (English)",
      description: "Lightweight English transcription",
      supportsFileUpload: true
    },
  
    // Text-to-Speech (TTS) Models
    "playai-tts": {
      id: "playai-tts",
      category: "text-to-speech",
      name: "PlayAI TTS",
      description: "Standard text-to-speech voice",
      supportsStreaming: true
    },
    "playai-tts-arabic": {
      id: "playai-tts-arabic",
      category: "text-to-speech",
      name: "PlayAI TTS (Arabic)",
      description: "Arabic text-to-speech support",
      supportsStreaming: true
    },
  
    // Vision Models
    "llama-3.2-90b-vision-preview": {
      id: "llama-3.2-90b-vision-preview",
      category: "vision",
      name: "Llama 3 Vision (90B)",
      description: "Multimodal image understanding",
      supportsFileUpload: true
    },
    "llama-3.2-11b-vision-preview": {
      id: "llama-3.2-11b-vision-preview",
      category: "vision",
      name: "Llama 3 Vision (11B)",
      description: "Lightweight image analysis",
      supportsFileUpload: true
    }
  };

// Default metadata generator
export const getModelMetadata = (modelId: string): ModelMetadata => {
  return (
    MODEL_OVERRIDES[modelId] || {
      id: modelId,
      category: "chat", // Default fallback
      name: modelId.split("-").slice(0, 3).join("-"), // Cleaned ID
    }
  );
};