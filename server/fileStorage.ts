import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

export interface CourseContent {
  videos: Array<{url: string, title: string}>;
  pdfs: Array<{url: string, title: string}>;
}

export interface CourseMetadata {
  title: string;
  description: string;
  thumbnail: string;
  startDate: string;
  endDate: string;
  videoCount: number;
  pdfCount: number;
  price: string;
  rating: string;
  reviewCount: number;
}

export class FileStorage {
  private coursesDir = 'courses';
  private metadataDir = 'courses_style';
  private metadataFile = 'metadata.json';

  // Extract names and URLs from content
  private extractNamesAndUrls(fileContent: string): Array<{name: string, url: string}> {
    const lines = fileContent.trim().split('\n');
    const data: Array<{name: string, url: string}> = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      // Skip comments and empty lines
      if (trimmed.startsWith('#') || !trimmed || !trimmed.includes(':')) {
        continue;
      }
      
      const colonIndex = trimmed.indexOf(':');
      if (colonIndex > 0) {
        const name = trimmed.substring(0, colonIndex).trim();
        const url = trimmed.substring(colonIndex + 1).trim();
        if (url.startsWith('http')) {
          data.push({ name, url });
        }
      }
    }
    
    return data;
  }

  // Categorize URLs based on your handler logic
  private categorizeUrls(urls: Array<{name: string, url: string}>): CourseContent {
    const videos: Array<{url: string, title: string}> = [];
    const pdfs: Array<{url: string, title: string}> = [];
    
    for (const {name, url} of urls) {
      let newUrl = url;
      
      // Handle special video hosting services
      if (url.includes('akamaized.net/') || url.includes('1942403233.rsc.cdn77.org/')) {
        newUrl = `https://www.khanglobalstudies.com/player?src=${url}`;
        videos.push({ url: newUrl, title: name });
      }
      else if (url.includes('d1d34p8vz63oiq.cloudfront.net/')) {
        // Note: You'll need to provide the working token
        newUrl = `https://anonymouspwplayer-0e5a3f512dec.herokuapp.com/pw?url=${url}&token=YOUR_WORKING_TOKEN`;
        videos.push({ url: newUrl, title: name });
      }
      else if (url.includes('youtube.com') || url.includes('youtu.be')) {
        // Handle various YouTube URL formats
        let ytId = '';
        if (url.includes('youtu.be/')) {
          ytId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('youtube.com/watch?v=')) {
          ytId = url.split('v=')[1].split('&')[0];
        } else if (url.includes('youtube.com/embed/')) {
          ytId = url.split('/embed/')[1].split('?')[0];
        }
        
        if (ytId) {
          newUrl = `https://www.youtube.com/watch?v=${ytId}`;
          videos.push({ url: newUrl, title: name });
        }
      }
      else if (url.includes('.m3u8') || url.includes('.mp4')) {
        videos.push({ url: url, title: name });
      }
      else if (url.toLowerCase().includes('pdf')) {
        pdfs.push({ url: url, title: name });
      }
      // Skip other types for now
    }
    
    return { videos, pdfs };
  }

  // Parse TXT file content to extract videos and PDFs using your handler
  async parseCourseFile(filename: string): Promise<CourseContent> {
    const filePath = path.join(this.coursesDir, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Extract all name:url pairs from the file
    const extractedData = this.extractNamesAndUrls(content);
    
    // Categorize URLs into videos and PDFs
    const categorizedContent = this.categorizeUrls(extractedData);
    
    return categorizedContent;
  }

  // Get all course files from courses directory
  async getCourseFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.coursesDir);
      return files.filter(file => file.endsWith('.txt'));
    } catch (error) {
      return [];
    }
  }

  // Load metadata for all courses
  async loadMetadata(): Promise<Record<string, CourseMetadata>> {
    try {
      const metadataPath = path.join(this.metadataDir, this.metadataFile);
      const content = await fs.readFile(metadataPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      return {};
    }
  }

  // Save metadata for courses
  async saveMetadata(metadata: Record<string, CourseMetadata>): Promise<void> {
    const metadataPath = path.join(this.metadataDir, this.metadataFile);
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  }

  // Get all courses with content and metadata
  async getAllCourses() {
    const files = await this.getCourseFiles();
    const metadata = await this.loadMetadata();
    
    const courses = [];
    
    for (const file of files) {
      const courseId = path.basename(file, '.txt');
      const content = await this.parseCourseFile(file);
      const meta = metadata[courseId];
      
      if (meta) {
        courses.push({
          id: courseId,
          title: meta.title,
          description: meta.description,
          thumbnail: meta.thumbnail,
          startDate: meta.startDate,
          endDate: meta.endDate,
          videoCount: content.videos.length,
          pdfCount: content.pdfs.length,
          price: meta.price,
          rating: meta.rating,
          reviewCount: meta.reviewCount,
          content: content
        });
      }
    }
    
    return courses;
  }

  // Get single course by ID
  async getCourse(courseId: string) {
    const files = await this.getCourseFiles();
    const metadata = await this.loadMetadata();
    
    const file = `${courseId}.txt`;
    
    if (!files.includes(file)) {
      return null;
    }
    
    const content = await this.parseCourseFile(file);
    const meta = metadata[courseId];
    
    if (!meta) {
      return null;
    }
    
    return {
      id: courseId,
      title: meta.title,
      description: meta.description,
      thumbnail: meta.thumbnail,
      startDate: meta.startDate,
      endDate: meta.endDate,
      videoCount: content.videos.length,
      pdfCount: content.pdfs.length,
      price: meta.price,
      rating: meta.rating,
      reviewCount: meta.reviewCount,
      content: content,
      htmlContent: this.generateHtmlContent(content)
    };
  }

  // Generate HTML content from course content
  private generateHtmlContent(content: CourseContent): string {
    let html = '<div class="course-content">';
    
    if (content.videos.length > 0) {
      html += '<h3>Videos</h3><div class="videos-section">';
      content.videos.forEach((video, index) => {
        html += `
          <div class="video-item" data-video-url="${video.url}">
            <h4>Video ${index + 1}: ${video.title}</h4>
            <div class="video-player" id="player-${index}">
              <video controls width="100%">
                <source src="${video.url}" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        `;
      });
      html += '</div>';
    }
    
    if (content.pdfs.length > 0) {
      html += '<h3>PDF Resources</h3><div class="pdfs-section">';
      content.pdfs.forEach((pdf, index) => {
        html += `
          <div class="pdf-item">
            <h4>PDF ${index + 1}: ${pdf.title}</h4>
            <a href="${pdf.url}" target="_blank" class="pdf-link">View PDF</a>
          </div>
        `;
      });
      html += '</div>';
    }
    
    html += '</div>';
    return html;
  }
}

export const fileStorage = new FileStorage();