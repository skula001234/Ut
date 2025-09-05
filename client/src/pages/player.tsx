import { useLocation } from "wouter";
import VideoPlayer from "@/components/video-player";

export default function Player() {
  const [location] = useLocation();
  
  // Extract URL parameter from query string
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const videoUrl = urlParams.get('url');
  
  if (!videoUrl) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Video Player</h1>
          <p className="text-muted-foreground">
            No video URL provided. Please add ?url=your_video_url to the URL.
          </p>
          <div className="text-sm text-muted-foreground">
            <p>Example: /player?url=https://example.com/video.mp4</p>
            <p>Supports: MP4, M3U8, YouTube URLs</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <VideoPlayer 
            videoUrl={decodeURIComponent(videoUrl)}
            title="Video Player"
            data-testid="standalone-player"
          />
        </div>
      </div>
    </div>
  );
}