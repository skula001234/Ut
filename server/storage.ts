import { type User, type InsertUser, type Course, type InsertCourse } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCourses(): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourseContent(courseId: string, htmlContent: string): Promise<Course | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private courses: Map<string, Course>;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.initializeCourses();
  }

  private initializeCourses() {
    const defaultCourses: InsertCourse[] = [
      {
        title: "Complete Web Development",
        description: "Learn HTML, CSS, JavaScript, and React from scratch",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        startDate: "15 Jan 2024",
        endDate: "15 Apr 2024",
        videoCount: 42,
        pdfCount: 15,
        price: "₹2,499",
        rating: "4.8",
        reviewCount: 120,
        htmlContent: null,
      },
      {
        title: "Data Science Masterclass",
        description: "Python, Machine Learning, and Data Visualization",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        startDate: "20 Jan 2024",
        endDate: "20 May 2024",
        videoCount: 65,
        pdfCount: 25,
        price: "₹3,999",
        rating: "4.9",
        reviewCount: 85,
        htmlContent: null,
      },
      {
        title: "Digital Marketing Pro",
        description: "SEO, SEM, Social Media, and Content Marketing",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        startDate: "25 Jan 2024",
        endDate: "25 Mar 2024",
        videoCount: 38,
        pdfCount: 12,
        price: "₹1,999",
        rating: "4.6",
        reviewCount: 95,
        htmlContent: null,
      },
      {
        title: "Mobile App Development",
        description: "React Native and Flutter for iOS & Android",
        thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        startDate: "1 Feb 2024",
        endDate: "1 May 2024",
        videoCount: 55,
        pdfCount: 20,
        price: "₹3,499",
        rating: "4.7",
        reviewCount: 110,
        htmlContent: null,
      },
      {
        title: "Cybersecurity Fundamentals",
        description: "Network Security, Ethical Hacking & Risk Management",
        thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        startDate: "5 Feb 2024",
        endDate: "5 Apr 2024",
        videoCount: 45,
        pdfCount: 18,
        price: "₹2,799",
        rating: "4.5",
        reviewCount: 75,
        htmlContent: null,
      },
      {
        title: "UI/UX Design Mastery",
        description: "Figma, Adobe XD, and Design Thinking",
        thumbnail: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        startDate: "10 Feb 2024",
        endDate: "10 Apr 2024",
        videoCount: 35,
        pdfCount: 10,
        price: "₹2,299",
        rating: "4.9",
        reviewCount: 65,
        htmlContent: null,
      },
      {
        title: "Cloud Computing AWS",
        description: "AWS Solutions Architect and DevOps",
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        startDate: "15 Feb 2024",
        endDate: "15 May 2024",
        videoCount: 60,
        pdfCount: 22,
        price: "₹4,499",
        rating: "4.8",
        reviewCount: 90,
        htmlContent: null,
      },
      {
        title: "Blockchain & Crypto",
        description: "Smart Contracts, DeFi, and Web3 Development",
        thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        startDate: "20 Feb 2024",
        endDate: "20 Apr 2024",
        videoCount: 40,
        pdfCount: 16,
        price: "₹3,799",
        rating: "4.6",
        reviewCount: 45,
        htmlContent: null,
      },
      {
        title: "राजस्थान पुलिस उपनिरीक्षक बैच 2025",
        description: "Sub Inspector Batch (Recorded From Jodhpur Classroom) - Complete preparation course for Rajasthan Police Sub Inspector exam with video lectures and PDF notes covering all subjects including Hindi Grammar, Law, Current Affairs, Geography, and Economics.",
        thumbnail: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&h=300&fit=crop",
        startDate: "2024-09-01",
        endDate: "2025-03-31",
        videoCount: 1094,
        pdfCount: 1631,
        price: "₹5,999",
        rating: "4.8",
        reviewCount: 89,
        htmlContent: `<div class="course-content">
  <h1>राजस्थान पुलिस उपनिरीक्षक बैच</h1>
  <p class="course-description">Sub Inspector Batch (Recorded From Jodhpur Classroom) - Complete Course Content</p>
  <div class="subjects-grid">
    <div class="subject-card">
      <h3>📚 हिन्दी व्याकरण</h3>
      <p>सुनील खोखरिया सर द्वारा</p>
      <div class="stats">वीडियो: 2 | PDF: 2</div>
    </div>
    <div class="subject-card">
      <h3>⚖️ विधि (Law)</h3>
      <p>Ashok Sir द्वारा</p>
      <div class="stats">वीडियो: 70+ | PDF: 60+</div>
    </div>
    <div class="subject-card">
      <h3>🗞️ समसामयिकी</h3>
      <p>नरेंद्र चौधरी सर द्वारा</p>
      <div class="stats">वीडियो: 10+ | PDF: 15+</div>
    </div>
    <div class="subject-card">
      <h3>🏛️ राजस्थान भूगोल</h3>
      <p>नरेंद्र चौधरी सर द्वारा</p>
      <div class="stats">वीडियो: 100+ | PDF: 100+</div>
    </div>
    <div class="subject-card">
      <h3>💰 राजस्थान अर्थव्यवस्था</h3>
      <p>के. पी सर द्वारा</p>
      <div class="stats">वीडियो: 50+ | PDF: 50+</div>
    </div>
    <div class="subject-card">
      <h3>📖 अन्य विषय</h3>
      <p>विभिन्न शिक्षकों द्वारा</p>
      <div class="stats">कुल 71 विषय</div>
    </div>
  </div>
  <div class="course-stats">
    <div class="stat-item">
      <strong>कुल वीडियो:</strong> 1,094
    </div>
    <div class="stat-item">
      <strong>कुल PDF:</strong> 1,631
    </div>
    <div class="stat-item">
      <strong>विषय:</strong> 71
    </div>
  </div>
  <div class="access-note">
    <p><strong>नोट:</strong> सभी वीडियो लेक्चर और PDF नोट्स course detail page से access कर सकते हैं।</p>
  </div>
</div>

<style>
  .course-content { max-width: 1200px; margin: 0 auto; padding: 20px; }
  .course-description { color: #666; margin-bottom: 30px; font-size: 16px; }
  .subjects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 30px 0; }
  .subject-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; background: #f9fafb; }
  .subject-card h3 { margin: 0 0 8px 0; color: #2563eb; font-size: 18px; }
  .subject-card p { margin: 0 0 10px 0; color: #666; font-size: 14px; }
  .stats { background: #2563eb; color: white; padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; }
  .course-stats { display: flex; justify-content: space-around; background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
  .stat-item { text-align: center; }
  .access-note { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin-top: 20px; }
  .access-note p { margin: 0; color: #92400e; }
</style>`,
      },
    ];

    defaultCourses.forEach(course => {
      this.createCourse(course);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourse(id: string): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = randomUUID();
    const course: Course = { 
      ...insertCourse, 
      id, 
      createdAt: new Date()
    };
    this.courses.set(id, course);
    return course;
  }

  async updateCourseContent(courseId: string, htmlContent: string): Promise<Course | undefined> {
    const course = this.courses.get(courseId);
    if (course) {
      const updatedCourse = { ...course, htmlContent };
      this.courses.set(courseId, updatedCourse);
      return updatedCourse;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
