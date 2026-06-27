import dotenv from 'dotenv';
dotenv.config();

import app from './src/app';

const PORT = parseInt(process.env.PORT || '3001', 10);

app.listen(PORT, () => {
  console.log(`🚀 Feature Flag API server running on http://localhost:${PORT}`);
  console.log(`📚 Swagger API docs available at http://localhost:${PORT}/api-docs`);
});
