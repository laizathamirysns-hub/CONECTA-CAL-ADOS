/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Music, Pause, Play, Volume2, VolumeX, ExternalLink, Youtube } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';

// Custom Spotify Icon (Lucide doesn't have it)
const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.491 17.306c-.215.353-.671.464-1.024.249-2.846-1.74-6.429-2.131-10.647-1.171-.403.092-.807-.16-.899-.562-.092-.403.16-.807.562-.899 4.619-1.056 8.579-.611 11.76 1.337.353.215.464.671.248 1.026zm1.467-3.261c-.271.441-.849.584-1.29.312-3.257-2.002-8.223-2.585-12.075-1.415-.497.151-1.026-.13-1.177-.627-.151-.497.13-1.026.627-1.177 4.407-1.337 9.883-.687 13.603 1.598.441.271.584.849.312 1.29zm.127-3.41c-3.907-2.32-10.347-2.534-14.102-1.394-.599.182-1.238-.163-1.42-.762-.182-.599.163-1.238.762-1.42 4.307-1.307 11.411-1.053 15.903 1.613.539.32.715 1.015.395 1.554-.32.539-1.015.715-1.554.395z"/>
  </svg>
);

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Royalty-free ambient/lo-fi track
  const AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3";

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log("Audio play blocked by browser", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-50 flex items-center gap-3">
      <audio ref={audioRef} src={AUDIO_URL} loop />
      
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            className="glass-panel px-6 py-4 flex flex-col gap-4 border border-white/10 min-w-[240px]"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-widest text-brand-gold">Ambiente</span>
                <span className="text-[10px] text-white/60 truncate max-w-[120px]">Conecta Lounge</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-white/60 hover:text-brand-gold hover:bg-white/5"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 bg-brand-gold text-brand-dark hover:bg-brand-gold/90 rounded-none"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">Conectar com:</p>
              <div className="grid grid-cols-2 gap-2">
                <a 
                  href="https://open.spotify.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#1DB954]/10 hover:bg-[#1DB954]/20 text-[#1DB954] py-2 px-3 transition-colors text-[10px] font-bold uppercase tracking-wider"
                >
                  <SpotifyIcon />
                  Spotify
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#FF0000]/10 hover:bg-[#FF0000]/20 text-[#FF0000] py-2 px-3 transition-colors text-[10px] font-bold uppercase tracking-wider"
                >
                  <Youtube className="h-4 w-4" />
                  YouTube
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        variant="ghost"
        size="icon"
        className={`h-12 w-12 rounded-none border border-white/10 backdrop-blur-md transition-all duration-500 ${
          isPlaying ? 'bg-brand-gold text-brand-dark border-brand-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'bg-black/40 text-white hover:bg-white/5'
        }`}
        onClick={() => setShowControls(!showControls)}
      >
        <Music className={`h-5 w-5 ${isPlaying ? 'animate-pulse' : ''}`} />
      </Button>
    </div>
  );
}
