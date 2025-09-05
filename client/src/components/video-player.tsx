import { useState, useRef, useEffect } from "react";
import Hls from "hls.js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Play,
  Pause,
  Volume2,
  Maximize,
  PictureInPicture2,
  ChevronDown,
} from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  isLoading?: boolean;
  currentVideoIndex?: number;
  totalVideos?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  onPlayingStateChange?: (isPlaying: boolean) => void;
  onVideoEnd?: () => void;
  thumbnail?: string;
}

export default function VideoPlayer({
  videoUrl,
  title,
  isLoading = false,
  currentVideoIndex = 0,
  totalVideos,
  onNext,
  onPrevious,
  onPlayingStateChange,
  onVideoEnd,
  thumbnail,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState(-1);
  const [isPiPSupported, setIsPiPSupported] = useState(false);
  const [isYouTubeVideo, setIsYouTubeVideo] = useState(false);
  const [youTubeUrl, setYouTubeUrl] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekingProgress, setSeekingProgress] = useState(0);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

  // Auto-hide controls functionality
  const resetControlsTimer = () => {
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    setShowControls(true);
    if (isPlaying) {
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      setControlsTimeout(timeout);
    }
  };

  const handleVideoClick = () => {
    if (showControls) {
      setShowControls(false);
    } else {
      resetControlsTimer();
    }
  };
  
  const convertToYouTubeEmbed = (url: string) => {
    let videoId = '';
    
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('/embed/')[1].split('?')[0];
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&rel=0&modestbranding=1`;
    }
    
    return url;
  };

  useEffect(() => {
    // Cleanup previous HLS instance
    if (hlsRef.current) {
      try {
        hlsRef.current.destroy();
      } catch (e) {
        console.log('HLS cleanup error:', e);
      }
      hlsRef.current = null;
    }

    // Reset states when video URL changes
    setIsYouTubeVideo(false);
    setYouTubeUrl('');
    setCurrentTime(0);
    setDuration(0);
    setProgress(0);
    setIsPlaying(false);
    onPlayingStateChange?.(false);
    setShowControls(true);
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
      setControlsTimeout(null);
    }
    setHasError(false);
    setErrorMessage('');
    setHasStartedPlaying(false);

    const video = videoRef.current;
    if (video && videoUrl) {
      const updateTime = () => {
        setCurrentTime(video.currentTime);
        setProgress((video.currentTime / video.duration) * 100);
      };

      const updateDuration = () => {
        setDuration(video.duration);
      };

      video.addEventListener("timeupdate", updateTime);
      video.addEventListener("loadedmetadata", updateDuration);

      // Check for PiP support
      setIsPiPSupported("pictureInPictureEnabled" in document);

      // Extract actual video URL from wrapper URLs
      let actualVideoUrl = videoUrl;
      
      // Extract M3U8 URL from khanglobalstudies wrapper
      if (videoUrl.includes('khanglobalstudies.com/player?src=')) {
        const urlParams = new URLSearchParams(videoUrl.split('?')[1]);
        actualVideoUrl = urlParams.get('src') || videoUrl;
      }
      
      // Extract M3U8 URL from other wrapper services
      if (videoUrl.includes('anonymouspwplayer') && videoUrl.includes('url=')) {
        const urlParams = new URLSearchParams(videoUrl.split('?')[1]);
        actualVideoUrl = urlParams.get('url') || videoUrl;
      }
      
      // Handle YouTube URLs - prepare for embedding
      if (actualVideoUrl.includes('youtube.com') || actualVideoUrl.includes('youtu.be')) {
        console.log('YouTube video detected:', actualVideoUrl);
        setIsYouTubeVideo(true);
        setYouTubeUrl(actualVideoUrl);
        return; // Return early for YouTube videos
      } else {
        setIsYouTubeVideo(false);
        setYouTubeUrl('');
      }

      // Handle HLS (M3U8) files
      if (actualVideoUrl.includes('.m3u8')) {
        if (Hls.isSupported()) {
          // Destroy existing HLS instance
          if (hlsRef.current) {
            try {
              (hlsRef.current as any).destroy();
            } catch (e) {
              console.log('HLS cleanup error:', e);
            }
          }
          
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false, // Disable for better stability
            maxBufferLength: 30, // Reduce buffer to prevent memory issues
            maxMaxBufferLength: 60,
            maxBufferSize: 60 * 1000 * 1000, // 60MB buffer limit
            maxBufferHole: 0.5,
            highBufferWatchdogPeriod: 2,
            nudgeOffset: 0.1,
            nudgeMaxRetry: 3,
            maxFragLookUpTolerance: 0.25,
            liveSyncDurationCount: 3,
            liveMaxLatencyDurationCount: 10,
            backBufferLength: 90, // Keep some back buffer for seeking
            xhrSetup: (xhr: XMLHttpRequest, url: string) => {
              xhr.withCredentials = false;
              xhr.timeout = 30000; // 30 second timeout
            },
            manifestLoadingTimeOut: 30000,
            manifestLoadingMaxRetry: 3,
            manifestLoadingRetryDelay: 1000,
            fragLoadingTimeOut: 30000,
            fragLoadingMaxRetry: 3,
            fragLoadingRetryDelay: 1000
          });
          
          hlsRef.current = hls;
          hls.loadSource(actualVideoUrl);
          hls.attachMedia(video);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('HLS manifest loaded successfully');
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS error:', data.type, data.details);
            
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.log('Attempting to recover from network error');
                  setTimeout(() => {
                    if (hlsRef.current) {
                      hlsRef.current.startLoad();
                    }
                  }, 1000);
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.log('Attempting to recover from media error');
                  setTimeout(() => {
                    if (hlsRef.current) {
                      hlsRef.current.recoverMediaError();
                    }
                  }, 1000);
                  break;
                default:
                  // Fatal error, show error message
                  console.log('Fatal error occurred');
                  setHasError(true);
                  setErrorMessage('Video playback error. Please try refreshing or select another video.');
                  if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    setTimeout(() => {
                      if (hlsRef.current) {
                        hlsRef.current.destroy();
                      }
                      video.src = actualVideoUrl;
                    }, 2000);
                  }
                  break;
              }
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Safari native HLS support
          video.src = actualVideoUrl;
        }
      } else {
        // Regular video files
        video.src = actualVideoUrl;
      }

      return () => {
        video.removeEventListener("timeupdate", updateTime);
        video.removeEventListener("loadedmetadata", updateDuration);
        
        // Pause and clear video to free memory
        if (video) {
          video.pause();
          video.removeAttribute('src');
          video.load(); // This helps free memory
        }
        
        // Cleanup HLS
        if (hlsRef.current) {
          try {
            hlsRef.current.destroy();
          } catch (e) {
            console.log('HLS cleanup error:', e);
          }
          hlsRef.current = null;
        }
        
        // Cleanup controls timeout
        if (controlsTimeout) {
          clearTimeout(controlsTimeout);
        }
      };
    }
  }, [videoUrl]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setSeekingProgress(newProgress);
    setIsSeeking(true);
  };

  const handleSeekEnd = () => {
    const video = videoRef.current;
    if (video && duration) {
      const seekTime = (seekingProgress / 100) * duration;
      video.currentTime = seekTime;
      setProgress(seekingProgress);
    }
    setIsSeeking(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const changeQuality = (quality: number) => {
    setSelectedQuality(quality);
    // Quality change logic would go here
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (video) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        video.requestFullscreen();
      }
    }
  };

  const togglePictureInPicture = async () => {
    const video = videoRef.current;
    if (video && isPiPSupported) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await video.requestPictureInPicture();
        }
      } catch (error) {
        console.error("PiP error:", error);
      }
    }
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
  };

  const getSpeedDisplay = () => {
    return playbackRate === 1 ? "1x" : `${playbackRate}x`;
  };

  const getSelectedQualityDisplay = () => {
    if (selectedQuality === -1) return "Auto";
    return `${selectedQuality}p`;
  };

  const getVideoType = (url: string) => {
    if (!url) return "video/mp4";
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'mp4': return "video/mp4";
      case 'webm': return "video/webm";
      case 'ogg': return "video/ogg";
      case 'avi': return "video/avi";
      case 'mov': return "video/mov";
      case 'mkv': return "video/mkv";
      case 'flv': return "video/flv";
      case 'wmv': return "video/wmv";
      case '3gp': return "video/3gp";
      case 'm4v': return "video/mp4";
      case 'm3u8': return "application/vnd.apple.mpegurl";
      case 'ts': return "video/mp2t";
      default: return "video/mp4";
    }
  };


  // Early return for no video URL
  if (!videoUrl) {
    return (
      <div className="flex justify-center items-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={currentVideoIndex === 0}
          data-testid="previous-video-button"
          className="text-xs px-3"
        >
          Previous
        </Button>
        
        <span className="text-xs text-muted-foreground px-2 bg-muted rounded-md py-1">
          {(currentVideoIndex || 0) + 1} / {totalVideos}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={currentVideoIndex === ((totalVideos || 1) - 1)}
          data-testid="next-video-button"
          className="text-xs px-3"
        >
          Next
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="w-full shadow-lg">
        <CardContent className="p-0">
          <div 
            className="relative bg-black rounded-lg overflow-hidden group aspect-video"
            onMouseMove={resetControlsTimer}
            onMouseEnter={() => setShowControls(true)}
          >
            {isYouTubeVideo ? (
              <iframe
                src={convertToYouTubeEmbed(youTubeUrl)}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                data-testid="youtube-iframe"
              />
            ) : (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                onPlay={() => {
                  setIsPlaying(true);
                  setHasStartedPlaying(true);
                  onPlayingStateChange?.(true);
                  resetControlsTimer();
                }}
                onPause={() => {
                  setIsPlaying(false);
                  onPlayingStateChange?.(false);
                  setShowControls(true);
                  if (controlsTimeout) {
                    clearTimeout(controlsTimeout);
                  }
                }}
                onClick={handleVideoClick}
                onMouseMove={resetControlsTimer}
                data-testid="video-player"
                controls={false}
                playsInline
                crossOrigin="anonymous"
              >
                {!videoUrl?.includes('.m3u8') && (
                  <>
                    <source src={videoUrl} type={getVideoType(videoUrl)} />
                    <source src={videoUrl} />
                  </>
                )}
                Your browser does not support the video tag.
              </video>
            )}
            
            {/* Loading Overlay */}
            {isLoading && !isYouTubeVideo && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-white text-sm">Loading...</p>
                </div>
              </div>
            )}

            {/* Thumbnail Overlay - Show only when video hasn't started playing yet */}
            {!isYouTubeVideo && !hasStartedPlaying && !isLoading && !hasError && thumbnail && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src={thumbnail} 
                    alt="Course thumbnail" 
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-black/70 rounded-full p-4">
                      <Play className="h-12 w-12 text-white fill-white" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Overlay */}
            {hasError && !isYouTubeVideo && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-3 text-center p-4">
                  <div className="w-12 h-12 text-red-500">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-white text-sm max-w-sm">{errorMessage}</p>
                  <button
                    onClick={() => {
                      setHasError(false);
                      setErrorMessage('');
                      window.location.reload();
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            )}
            
            {/* Video Controls Overlay - Bottom - Only show for non-YouTube videos */}
            {!isYouTubeVideo && (
              <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {/* Progress Bar */}
              <div className="mb-3">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isSeeking ? seekingProgress : progress || 0}
                    onChange={handleSeek}
                    onMouseUp={handleSeekEnd}
                    onTouchEnd={handleSeekEnd}
                    disabled={isLoading}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    data-testid="video-progress"
                  />
                  <div 
                    className="absolute top-0 left-0 h-1 bg-white rounded-lg pointer-events-none"
                    style={{ width: `${isSeeking ? seekingProgress : progress}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Controls Row */}
              <div className="flex items-center justify-between">
                {/* Left Controls */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlay}
                    disabled={isLoading}
                    className="text-white hover:bg-white/20 w-8 h-8"
                    data-testid="play-pause-button"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-white" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume * 100}
                      onChange={handleVolumeChange}
                      disabled={isLoading}
                      className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      data-testid="volume-control"
                    />
                  </div>
                  
                  <span className="text-white text-xs font-medium">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                
                {/* Right Controls */}
                <div className="flex items-center space-x-2">
                  {isPiPSupported && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={togglePictureInPicture}
                      disabled={isLoading}
                      className="text-white hover:bg-white/20 w-8 h-8"
                      data-testid="pip-button"
                      title="Picture-in-Picture"
                    >
                      <PictureInPicture2 className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    disabled={isLoading}
                    className="text-white hover:bg-white/20 w-8 h-8"
                    data-testid="fullscreen-button"
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              </div>
            )}

            
          </div>
        </CardContent>
      </Card>
      
      {/* Video Title */}
      {title && (
        <div className="px-1">
          <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-relaxed">
            {title}
          </h3>
        </div>
      )}
      
      {/* Speed and Quality Selectors - Side positioned */}
      <div className="flex justify-between items-center space-x-2">
        {/* Speed Selector - Left side */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="text-xs h-8 px-2 min-w-[60px] flex items-center justify-between"
              data-testid="speed-selector-button"
            >
              <span>{getSpeedDisplay()}</span>
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[80px]">
            <DropdownMenuItem
              onClick={() => changeSpeed(0.5)}
              className="text-xs cursor-pointer"
              data-testid="speed-option-0-5x"
            >
              0.5x
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeSpeed(1)}
              className="text-xs cursor-pointer"
              data-testid="speed-option-1x"
            >
              1x
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeSpeed(1.25)}
              className="text-xs cursor-pointer"
              data-testid="speed-option-1-25x"
            >
              1.25x
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeSpeed(1.5)}
              className="text-xs cursor-pointer"
              data-testid="speed-option-1-5x"
            >
              1.5x
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeSpeed(2)}
              className="text-xs cursor-pointer"
              data-testid="speed-option-2x"
            >
              2x
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quality Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="text-xs h-8 px-2 min-w-[80px] flex items-center justify-between"
              data-testid="quality-selector-button"
            >
              <span>{getSelectedQualityDisplay()}</span>
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[100px]">
            <DropdownMenuItem
              onClick={() => changeQuality(-1)}
              className="text-xs cursor-pointer"
              data-testid="quality-option-auto"
            >
              Auto
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeQuality(720)}
              className="text-xs cursor-pointer"
              data-testid="quality-option-720p"
            >
              720p
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeQuality(480)}
              className="text-xs cursor-pointer"
              data-testid="quality-option-480p"
            >
              480p
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeQuality(360)}
              className="text-xs cursor-pointer"
              data-testid="quality-option-360p"
            >
              360p
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeQuality(240)}
              className="text-xs cursor-pointer"
              data-testid="quality-option-240p"
            >
              240p
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation Controls */}
      {totalVideos && totalVideos > 1 && (
        <div className="flex justify-center items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={currentVideoIndex === 0}
            data-testid="previous-video-button"
            className="text-xs px-3"
          >
            Previous
          </Button>
          
          <span className="text-xs text-muted-foreground px-2 bg-muted rounded-md py-1">
            {(currentVideoIndex || 0) + 1} / {totalVideos}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onNext}
            disabled={currentVideoIndex === (totalVideos - 1)}
            data-testid="next-video-button"
            className="text-xs px-3"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}