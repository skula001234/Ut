import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fileStorage } from "./fileStorage";
import { insertCourseSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all courses from file system
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await fileStorage.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  // Get single course from file system
  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await fileStorage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      console.error('Error fetching course:', error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  // File system info endpoint
  app.get("/api/courses/info", async (req, res) => {
    try {
      const files = await fileStorage.getCourseFiles();
      const metadata = await fileStorage.loadMetadata();
      res.json({ files, metadata });
    } catch (error) {
      console.error('Error getting course info:', error);
      res.status(500).json({ message: "Failed to get course info" });
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}
