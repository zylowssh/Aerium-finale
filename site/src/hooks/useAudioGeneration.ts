import { useState, useCallback } from "react";
import { aeriumScript } from "@/remotion/script";

export interface AudioAsset {
  sceneId: string;
  audioUrl: string;
  duration: number;
}

export const useAudioGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioAssets, setAudioAssets] = useState<AudioAsset[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateNarration = useCallback(async (text: string, voiceId: string = "onwK4e9ZLuTAKqWW03F9") => {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text, voiceId }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `TTS request failed: ${response.status}`);
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  }, []);

  const generateMusic = useCallback(async (prompt: string, duration: number = 30) => {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-music`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ prompt, duration }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Music request failed: ${response.status}`);
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  }, []);

  const generateAllNarration = useCallback(async () => {
    setIsGenerating(true);
    setProgress(0);
    setError(null);
    const assets: AudioAsset[] = [];

    try {
      const scenes = aeriumScript.scenes;
      
      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        const audioUrl = await generateNarration(scene.text);
        
        assets.push({
          sceneId: scene.id,
          audioUrl,
          duration: scene.durationInFrames / 30, // Convert frames to seconds
        });
        
        setProgress(((i + 1) / scenes.length) * 100);
      }

      setAudioAssets(assets);
      return assets;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate audio";
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [generateNarration]);

  const playAudio = useCallback((audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
    return audio;
  }, []);

  return {
    isGenerating,
    progress,
    audioAssets,
    error,
    generateNarration,
    generateMusic,
    generateAllNarration,
    playAudio,
  };
};
