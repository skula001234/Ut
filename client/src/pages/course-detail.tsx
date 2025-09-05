import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Home } from "lucide-react";
import Navbar from "@/components/navbar";
import CourseContentViewer from "@/components/course-content-viewer";
import type { ExtendedCourse } from "@shared/schema";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  const { data: course, isLoading, error } = useQuery<ExtendedCourse>({
    queryKey: ['/api/courses', id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {!isVideoPlaying && <Navbar />}
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-96 bg-muted rounded mb-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background">
        {!isVideoPlaying && <Navbar />}
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold text-destructive mb-4">Course Not Found</h1>
              <p className="text-muted-foreground mb-4">
                The course you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Courses
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {!isVideoPlaying && <Navbar />}
      
      <div className="container mx-auto px-4 py-6">

        {/* Course Content - Videos at Top */}
        <div className="max-w-7xl mx-auto">
          {course.content ? (
            <CourseContentViewer 
              content={course.content} 
              courseName={course.title}
              onVideoPlayingStateChange={setIsVideoPlaying}
              courseThumbnail={course.thumbnail}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Course Content Loading...
                </h3>
                <p className="text-muted-foreground">
                  Course videos will be available soon.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Back to Courses */}
        <div className="mt-6 max-w-7xl mx-auto">
          <Link href="/">
            <Button variant="outline" data-testid="button-back-to-courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}