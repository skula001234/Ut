import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, FileText, Calendar } from "lucide-react";
import { Link } from "wouter";
import type { Course } from "@shared/schema";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };


  return (
    <Card 
      className="course-card bg-card rounded-lg shadow-md border border-border overflow-hidden hover:shadow-lg transition-all duration-200 max-w-sm"
      data-testid={`card-course-${course.id}`}
    >
        <div className="relative w-full h-56 overflow-hidden">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            data-testid={`img-course-thumbnail-${course.id}`}
          />
        </div>
        <div className="p-4">
          {/* Course Title */}
          <h4 
            className="text-lg font-bold mb-2 text-foreground line-clamp-2" 
            data-testid={`text-course-title-${course.id}`}
          >
            {course.title}
          </h4>
          
          {/* Course Description */}
          <p 
            className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed" 
            data-testid={`text-course-description-${course.id}`}
          >
            {course.description}
          </p>
          
          {/* Videos & PDFs Count */}
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <Play className="w-4 h-4 mr-1 text-primary" />
              <span data-testid={`text-course-videos-${course.id}`}>
                {course.videoCount} Videos
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="w-4 h-4 mr-1 text-accent" />
              <span data-testid={`text-course-pdfs-${course.id}`}>
                {course.pdfCount} PDFs
              </span>
            </div>
          </div>

          {/* Course Dates */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1 text-green-500" />
              <span data-testid={`text-course-start-date-${course.id}`}>
                {formatDate(course.startDate)}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1 text-red-500" />
              <span data-testid={`text-course-end-date-${course.id}`}>
                {formatDate(course.endDate)}
              </span>
            </div>
          </div>

          {/* Explore Button */}
          <Link href={`/courses/${course.id}`}>
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
              data-testid={`button-explore-${course.id}`}
            >
              Explore
            </Button>
          </Link>
        </div>
      </Card>
  );
}