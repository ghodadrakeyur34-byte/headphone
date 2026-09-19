import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-project-frames',
      configureServer(server) {
        server.middlewares.use('/frames', (req, res, next) => {
          const cleanUrl = req.url.split('?')[0].replace(/^\//, '');
          const filePath = path.join(__dirname, 'frames', decodeURIComponent(cleanUrl));
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            fs.createReadStream(filePath).pipe(res);
          } else {
            next();
          }
        });
      }
    }
  ],
  server: {
    port: 5173,
    host: true
  }
});
