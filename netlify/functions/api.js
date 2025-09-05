
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Sample courses data
const courses = [
  {
    id: "example",
    title: "VDO 2025",
    description: "Complete video course for 2025",
    thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    difficulty: "Beginner",
    duration: "2 hours",
    lessons: 10,
    instructor: "Expert Teacher",
    rating: 4.5,
    studentsEnrolled: 1250
  },
  {
    id: "sub",
    title: "Advanced Concepts",
    description: "Deep dive into advanced topics",
    thumbnailUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    difficulty: "Advanced",
    duration: "4 hours",
    lessons: 15,
    instructor: "Senior Expert",
    rating: 4.8,
    studentsEnrolled: 890
  }
];

// Routes
app.get('/courses', (req, res) => {
  res.json(courses);
});

app.get('/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json(course);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Handle all other routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports.handler = serverless(app);
