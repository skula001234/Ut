
const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  const { path: requestPath } = event;
  
  try {
    // Handle course files and assets
    if (requestPath.startsWith('/courses/')) {
      const filePath = path.join(process.cwd(), requestPath);
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*'
          },
          body: content
        };
      }
    }
    
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'File not found' })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
