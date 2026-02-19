import { env } from './config/env';
import { sequelize } from './config/database';
import app from './app';

// Import models to register associations
import './db/models';

const start = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Sync models (creates tables if they don't exist)
    await sequelize.sync({ alter: env.nodeEnv === 'development' });
    console.log('✅ Database synced');

    // Start server
    app.listen(env.port, () => {
      console.log(`🚀 Server running on http://localhost:${env.port}`);
      console.log(`📋 API: http://localhost:${env.port}/api/v1`);
      console.log(`❤️  Health: http://localhost:${env.port}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

start();
