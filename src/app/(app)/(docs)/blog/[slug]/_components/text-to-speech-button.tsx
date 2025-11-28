"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Equal, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TextToSpeechButtonProps {
  content: string;
}

export function TextToSpeechButton({
  content,
  className,
  ...props
}: React.ComponentProps<"div"> & TextToSpeechButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textChunksRef = useRef<string[]>([]);
  const currentChunkIndexRef = useRef(0);
  const keepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const shouldPlayRef = useRef(false);

  useEffect(() => {
    // Check if the browser supports the Speech Synthesis API
    setIsSupported(
      typeof window !== "undefined" && "speechSynthesis" in window
    );
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    // Ensure speech is stopped on mount (in case user navigated from another post)
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const synth = window.speechSynthesis;
      // Cancel any ongoing speech from previous pages
      synth.cancel();
    }

    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
      shouldPlayRef.current = false;

      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
        keepAliveIntervalRef.current = null;
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const synth = window.speechSynthesis;
        // Completely stop and cancel all speech
        synth.cancel();
      }
    };
  }, []);

  const cleanTextForSpeech = useCallback((text: string): string => {
    // Remove MDX/Markdown syntax and clean the text for speech
    return text
      .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Replace links with just the text
      .replace(/#{1,6}\s/g, "") // Remove markdown headers
      .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold syntax
      .replace(/\*([^*]+)\*/g, "$1") // Remove italic syntax
      .replace(/`([^`]+)`/g, "$1") // Remove code syntax
      .replace(/```[\s\S]*?```/g, "") // Remove code blocks
      .replace(/\n{2,}/g, ". ") // Replace multiple newlines with period
      .replace(/\n/g, " ") // Replace single newlines with space
      .trim();
  }, []);

  const splitTextIntoChunks = useCallback((text: string): string[] => {
    // Split text into smaller chunks to avoid browser timeout
    // Chrome has a limit around 15 seconds of continuous speech
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = "";
    const maxChunkLength = 500; // Approximate characters per chunk

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > maxChunkLength && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks.filter((chunk) => chunk.length > 0);
  }, []);

  const speakNextChunk = useCallback(() => {
    // Don't continue if component is unmounted or user stopped playback
    if (!isMountedRef.current || !shouldPlayRef.current) {
      return;
    }

    const synth = window.speechSynthesis;

    if (currentChunkIndexRef.current >= textChunksRef.current.length) {
      // Finished reading all chunks
      shouldPlayRef.current = false;
      if (isMountedRef.current) {
        setIsPlaying(false);
        setIsPaused(false);
      }
      currentChunkIndexRef.current = 0;
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
        keepAliveIntervalRef.current = null;
      }
      return;
    }

    const chunk = textChunksRef.current[currentChunkIndexRef.current];
    const utterance = new SpeechSynthesisUtterance(chunk);

    // Configure the utterance
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to use a better voice if available
    const voices = synth.getVoices();
    const preferredVoice =
      voices.find((voice) => voice.lang.startsWith("en")) || voices[0];
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    currentUtteranceRef.current = utterance;

    utterance.onend = () => {
      // Only continue if still mounted and should play
      if (!isMountedRef.current || !shouldPlayRef.current) {
        return;
      }
      currentChunkIndexRef.current += 1;
      speakNextChunk(); // Speak the next chunk
    };

    utterance.onerror = (event) => {
      if (!isMountedRef.current || !shouldPlayRef.current) {
        return;
      }

      if (event.error === "interrupted") {
        setTimeout(() => {
          if (isMountedRef.current && shouldPlayRef.current) {
            speakNextChunk();
          }
        }, 100);
      } else {
        shouldPlayRef.current = false;
        if (isMountedRef.current) {
          setIsPlaying(false);
          setIsPaused(false);
        }
        if (keepAliveIntervalRef.current) {
          clearInterval(keepAliveIntervalRef.current);
          keepAliveIntervalRef.current = null;
        }
      }
    };

    synth.speak(utterance);
  }, []);

  const handlePlay = useCallback(() => {
    if (!isSupported) return;

    const synth = window.speechSynthesis;

    if (isPaused) {
      // Resume if paused
      shouldPlayRef.current = true;
      synth.resume();
      setIsPaused(false);
      setIsPlaying(true);

      // Restart keep-alive interval
      if (!keepAliveIntervalRef.current) {
        keepAliveIntervalRef.current = setInterval(() => {
          // Only try to keep alive if speech is actually active and should play
          if (shouldPlayRef.current && synth.speaking && !synth.paused) {
            // Pause and resume to keep the engine alive
            synth.pause();
            synth.resume();
          }
        }, 10000);
      }
      return;
    }

    if (isPlaying) {
      // Pause if playing
      shouldPlayRef.current = false;
      synth.pause();
      setIsPaused(true);
      setIsPlaying(false);

      // Clear keep-alive interval when paused
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
        keepAliveIntervalRef.current = null;
      }
      return;
    }

    // Cancel any ongoing speech
    synth.cancel();
    shouldPlayRef.current = false;

    // Clear any existing interval
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }

    // Clean the content for speech
    const textToRead = cleanTextForSpeech(content);

    // Split into manageable chunks
    textChunksRef.current = splitTextIntoChunks(textToRead);
    currentChunkIndexRef.current = 0;

    // Set the flag to allow playback
    shouldPlayRef.current = true;
    setIsPlaying(true);
    setIsPaused(false);

    // Start a keep-alive interval to prevent browser timeout
    // This works around Chrome's automatic pause after ~15 seconds
    // Only resume if we're actually speaking and not paused by user
    keepAliveIntervalRef.current = setInterval(() => {
      // Only try to keep alive if speech is actually active and should play
      if (shouldPlayRef.current && synth.speaking && !synth.paused) {
        // Pause and resume to keep the engine alive
        synth.pause();
        synth.resume();
      }
    }, 10000); // Every 10 seconds

    // Start speaking the first chunk
    speakNextChunk();
  }, [
    content,
    isPlaying,
    isPaused,
    isSupported,
    cleanTextForSpeech,
    splitTextIntoChunks,
    speakNextChunk,
  ]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePlay}
        className="flex items-center gap-2"
        aria-label={
          isPlaying
            ? "Pause reading"
            : isPaused
            ? "Resume reading"
            : "Play reading"
        }
      >
        {isPlaying ? (
          <>
            <Equal className="rotate-90" size={18} />
            <span>{"Pause"}</span>
          </>
        ) : isPaused ? (
          <>
            <Play size={18} />
            <span>{"Resume"}</span>
          </>
        ) : (
          <>
            <Play size={18} />
            <span>{"Listen"}</span>
          </>
        )}
      </Button>
    </div>
  );
}
