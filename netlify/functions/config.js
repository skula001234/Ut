
exports.handler = async (event, context) => {
  // Only return non-sensitive config data
  const config = {
    nodeEnv: process.env.NODE_ENV || 'production',
    apiVersion: 'v1',
    features: {
      videoPlayer: true,
      courseUpload: true,
      responsive: true
    }
  };

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(config)
  };
};
