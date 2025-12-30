import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface AudioTrack {
  id: number;
  title: string;
  author: string;
  audioUrl?: string;
}

interface AudioPlayerProps {
  currentTrack: AudioTrack;
  playlist: AudioTrack[];
  onClose?: () => void;
  onTrackChange?: (trackId: number) => void;
}

export const AudioPlayer = ({ currentTrack, playlist, onClose, onTrackChange }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      playNext();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, currentTime - 10);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, currentTime + 10);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const playNext = () => {
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    if (currentIndex < playlist.length - 1) {
      const nextTrack = playlist[currentIndex + 1];
      onTrackChange?.(nextTrack.id);
    }
  };

  const playPrevious = () => {
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > 0) {
      const prevTrack = playlist[currentIndex - 1];
      onTrackChange?.(prevTrack.id);
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardContent className="p-6">
        <audio ref={audioRef} src={currentTrack.audioUrl} preload="metadata" autoPlay />
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{currentTrack.title}</h3>
            <p className="text-sm text-muted-foreground">{currentTrack.author}</p>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={playPrevious}
              disabled={playlist.findIndex(t => t.id === currentTrack.id) === 0}
            >
              <Icon name="SkipBack" size={18} />
            </Button>

            <Button variant="outline" size="icon" onClick={skipBackward}>
              <Icon name="RotateCcw" size={18} />
            </Button>
            
            <Button
              size="icon"
              className="h-14 w-14"
              onClick={togglePlay}
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={24} />
            </Button>
            
            <Button variant="outline" size="icon" onClick={skipForward}>
              <Icon name="RotateCw" size={18} />
            </Button>

            <Button 
              variant="outline" 
              size="icon" 
              onClick={playNext}
              disabled={playlist.findIndex(t => t.id === currentTrack.id) === playlist.length - 1}
            >
              <Icon name="SkipForward" size={18} />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onMouseEnter={() => setShowVolumeControl(true)}
                onMouseLeave={() => setShowVolumeControl(false)}
              >
                <Icon 
                  name={volume === 0 ? "VolumeX" : volume < 50 ? "Volume1" : "Volume2"} 
                  size={18} 
                />
              </Button>
              
              {showVolumeControl && (
                <div 
                  className="w-24 animate-fade-in"
                  onMouseEnter={() => setShowVolumeControl(true)}
                  onMouseLeave={() => setShowVolumeControl(false)}
                >
                  <Slider
                    value={[volume]}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Icon name="ListMusic" size={18} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};