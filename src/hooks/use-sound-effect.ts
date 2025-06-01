"use client";

import { useEffect, useRef } from "react";

type SoundType = "click" | "success" | "error" | "complete";

export const useSoundEffect = () => {
  // Instead of a single reference for each sound, use pools of audio elements
  const soundPools = useRef<Record<SoundType, HTMLAudioElement[]>>({
    click: [],
    success: [],
    error: [],
    complete: [],
  });

  // Number of sounds in each pool (for frequent clicking)
  const POOL_SIZE = 4;

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Create pools of audio elements for each sound type
      Object.entries(soundPools.current).forEach(([type, pool]) => {
        for (let i = 0; i < POOL_SIZE; i++) {
          const audio = new Audio(`/sounds/${type}.mp3`);
          audio.volume = type === "click" ? 0.5 : 0.7; // Adjust volume as needed
          audio.load();
          pool.push(audio);
        }
      });
    }

    return () => {
      // Clean up audio resources when component unmounts
      Object.values(soundPools.current).forEach((pool) => {
        pool.length = 0;
      });
    };
  }, []);

  // Track the last used index for each sound type
  const lastIndexUsed = useRef<Record<SoundType, number>>({
    click: -1,
    success: -1,
    error: -1,
    complete: -1,
  });

  const playSound = (type: SoundType = "click") => {
    const pool = soundPools.current[type];

    if (pool && pool.length > 0) {
      // Cycle through the audio elements in the pool
      lastIndexUsed.current[type] =
        (lastIndexUsed.current[type] + 1) % pool.length;
      const soundToPlay = pool[lastIndexUsed.current[type]];

      if (soundToPlay) {
        // For click sounds, add slight pitch variation for game-like feel
        if (type === "click") {
          // Random pitch between 0.95 and 1.05
          const pitch = 0.95 + Math.random() * 0.1;
          soundToPlay.playbackRate = pitch;
        }

        soundToPlay.currentTime = 0;
        soundToPlay.play().catch((error) => {
          console.log("Sound playback was prevented:", error);
        });
      }
    }
  };

  // Add haptic feedback for mobile devices (if supported)
  const playHapticFeedback = () => {
    if ("vibrate" in navigator) {
      // Short vibration for button press
      navigator.vibrate(15);
    }
  };

  // Combined function for sound and haptic feedback
  const playFeedback = (type: SoundType = "click") => {
    playSound(type);
    playHapticFeedback();
  };

  return { playSound, playFeedback };
};
