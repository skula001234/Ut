import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Search } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/navbar";
import CourseCard from "@/components/course-card";
import type { ExtendedCourse } from "@shared/schema";

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: courses, isLoading } = useQuery<ExtendedCourse[]>({
    queryKey: ['/api/courses'],
  });

  const filteredCourses = useMemo(() => {
    if (!courses || !searchQuery.trim()) return courses;
    
    return courses.filter(course => 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Back Button - Absolute Top Left Corner */}
      <div className="absolute top-4 left-4 z-50">
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2" data-testid="button-back-home">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="flex justify-center mb-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-courses"
              />
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Available Courses</h1>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl h-96 animate-pulse" />
              ))}
            </div>
          ) : filteredCourses && filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No courses found matching your search.</p>
            </div>
          )}

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button 
              variant="outline"
              className="bg-secondary text-secondary-foreground px-8 py-3 rounded-lg hover:bg-secondary/90 transition-colors border border-border"
              data-testid="button-load-more"
            >
              Load More Courses
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}