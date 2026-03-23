import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

const listenOnPort = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => resolve({ server, port }));
    server.on('error', reject);
  });

const startServer = async () => {
  try {
    await connectDB();

    let startPort = Number(PORT);
    let attempts = 0;

    while (attempts < 10) {
      try {
        const { port } = await listenOnPort(startPort);
        console.log(`Server running on port ${port}`);
        return;
      } catch (error) {
        if (error?.code === 'EADDRINUSE' && !isProduction) {
          console.warn(`Port ${startPort} is in use. Retrying on ${startPort + 1}...`);
          startPort += 1;
          attempts += 1;
          continue;
        }
        throw error;
      }
    }

    throw new Error('Unable to find an available port after 10 attempts.');
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
