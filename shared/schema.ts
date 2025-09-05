import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnail: text("thumbnail").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  videoCount: integer("video_count").notNull(),
  pdfCount: integer("pdf_count").notNull(),
  price: text("price").notNull(),
  rating: text("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  htmlContent: text("html_content"), // Stores HTML content
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
});


// Extended course content types for file-based system
export interface CourseContent {
  videos: Array<{url: string, title: string}>;
  pdfs: Array<{url: string, title: string}>;
}

export interface ExtendedCourse extends Course {
  content?: CourseContent;
}

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
