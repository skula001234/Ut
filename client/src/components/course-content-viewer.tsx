import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, FileText, ExternalLink } from 'lucide-react';
import VideoPlayer from './video-player';

interface Video {
  url: string;
  title: string;
}

interface PDF {
  url: string;
  title: string;
}

interface CourseContent {
  videos: Video[];
  pdfs: PDF[];
}

interface CourseContentViewerProps {
  content: CourseContent;
  courseName: string;
  onVideoPlayingStateChange?: (isPlaying: boolean) => void;
  courseThumbnail?: string;
}

export default function CourseContentViewer({ content, courseName, onVideoPlayingStateChange, courseThumbnail }: CourseContentViewerProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("videos");
  const [selectedPdfIndex, setSelectedPdfIndex] = useState<number | null>(null);

  const handleVideoEnd = () => {
    // Auto-play next video
    if (currentVideoIndex < content.videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const selectVideo = (index: number) => {
    setCurrentVideoIndex(index);
  };

  const handlePreviousVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const handleNextVideo = () => {
    if (currentVideoIndex < content.videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  if (!content.videos.length && !content.pdfs.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="mx-auto h-16 w-16 mb-4" />
        <p className="text-sm">No course content available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Video Player Section */}
      {content.videos.length > 0 && (
        <div className="space-y-4">
          {/* Video Player */}
          <VideoPlayer
            videoUrl={content.videos[currentVideoIndex]?.url || ''}
            title={content.videos[currentVideoIndex]?.title || ''}
            onVideoEnd={handleVideoEnd}
            currentVideoIndex={currentVideoIndex}
            totalVideos={content.videos.length}
            onPrevious={handlePreviousVideo}
            onNext={handleNextVideo}
            onPlayingStateChange={onVideoPlayingStateChange}
            thumbnail={courseThumbnail}
          />
          
          
        </div>
      )}

      {/* Tabs for Videos/PDFs List */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50 h-9">
          <TabsTrigger value="videos" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm">
            <Play className="h-3 w-3" />
            Videos ({content.videos.length})
          </TabsTrigger>
          <TabsTrigger value="pdfs" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm">
            <FileText className="h-3 w-3" />
            PDFs ({content.pdfs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="space-y-4 mt-4">
          {content.videos.length > 0 ? (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 text-sm">All Videos - {courseName}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {content.videos.map((video, index) => (
                    <Card
                      key={index}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        index === currentVideoIndex ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => selectVideo(index)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start space-x-2">
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === currentVideoIndex ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-xs font-medium line-clamp-2 leading-relaxed">{video.title}</p>
                            {index === currentVideoIndex && (
                              <span className="text-xs text-primary font-medium mt-1 inline-block">Playing</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Play className="mx-auto h-12 w-12 mb-4" />
              <p className="text-sm">No videos available</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pdfs" className="space-y-4 mt-4">
          {content.pdfs.length > 0 ? (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 text-sm">All PDFs - {courseName}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {content.pdfs.map((pdf, index) => (
                    <Card
                      key={index}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        index === selectedPdfIndex ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => {
                        setSelectedPdfIndex(index);
                        window.open(pdf.url, '_blank');
                      }}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start space-x-2">
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === selectedPdfIndex ? 'bg-primary text-primary-foreground' : 'bg-red-500/20 text-red-600'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-xs font-medium line-clamp-2 leading-relaxed">{pdf.title}</p>
                            {index === selectedPdfIndex && (
                              <span className="text-xs text-primary font-medium mt-1 inline-block">Opened</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 mb-4" />
              <p className="text-sm">No PDF resources available</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}