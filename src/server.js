const app = require('./app');
const ConnectDB = require('./config/db');
const server = require('http').createServer(app);

ConnectDB()
  .then(() => {
    console.log('Connected to MongoDB');

    const PORT = process.env.PORT || 3000;
    server
      .listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      })
      .on('error', error => {
        console.error('Server failed to start:', error);
        process.exit(1);
      });

    ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
      process.on(signal, async () => {
        console.log(`\nReceived ${signal}. Shutting down gracefully...`);
        server.close(() => {
          console.log('HTTP server closed');
          process.exit(0);
        });
      });
    });
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });
