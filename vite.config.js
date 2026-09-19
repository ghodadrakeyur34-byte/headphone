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
      name: 'handle-project-frames',
      // Development server middleware
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
      },
      // Production build: copy frames into dist/frames so Vercel serves them cleanly
      closeBundle() {
        const srcDir = path.join(__dirname, 'frames');
        const destDir = path.join(__dirname, 'dist', 'frames');
        if (fs.existsSync(srcDir)) {
          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
          }
          const files = fs.readdirSync(srcDir);
          for (const file of files) {
            fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
          }
          console.log(`[build] Successfully copied ${files.length} frames into dist/frames for production deployment.`);
        }
      }
    }
  ],
  server: {
    port: 5173,
    host: true
  }
});
