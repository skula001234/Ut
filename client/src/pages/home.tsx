import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Users, Star, GraduationCap } from "lucide-react";
import Navbar from "@/components/navbar";

export default function Home() {

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                  <GraduationCap className="text-primary-foreground text-3xl" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                Welcome to
                <span className="text-primary block">Study Hub</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Your gateway to excellence. Master new skills with our comprehensive video courses and study materials.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/courses">
                <Button 
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary/90 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  data-testid="button-available-courses"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Courses
                </Button>
              </Link>
              
              <a 
                href="https://t.me/learnhub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-4 rounded-lg hover:bg-blue-600 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                data-testid="button-join-telegram"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Join Community
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Course Statistics */}
      <section className="py-20 bg-gradient-to-r from-secondary/30 to-accent/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our growing community of learners and achieve your goals with quality education
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-card rounded-xl shadow-lg border border-border hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <BookOpen className="text-primary text-2xl" />
                </div>
              </div>
              <div className="text-4xl font-bold text-primary mb-2" data-testid="text-total-courses">
                150+
              </div>
              <div className="text-muted-foreground font-medium">Total Courses</div>
            </div>
            
            <div className="text-center p-6 bg-card rounded-xl shadow-lg border border-border hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                  <Users className="text-accent text-2xl" />
                </div>
              </div>
              <div className="text-4xl font-bold text-accent mb-2" data-testid="text-total-students">
                12K+
              </div>
              <div className="text-muted-foreground font-medium">Happy Students</div>
            </div>
            
            <div className="text-center p-6 bg-card rounded-xl shadow-lg border border-border hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center">
                  <Star className="text-yellow-500 text-2xl" />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="text-4xl font-bold text-yellow-600" data-testid="text-avg-rating">
                  4.8
                </div>
                <Star className="text-yellow-500 text-2xl fill-current" />
              </div>
              <div className="text-muted-foreground font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Copyright */}
      <footer className="py-8 text-center text-muted-foreground">
        <p>© 2024 all Copyright Reserved</p>
      </footer>

    </div>
  );
}
