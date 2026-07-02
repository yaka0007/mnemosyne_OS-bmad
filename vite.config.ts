import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuration for BMAD 2.0 Cartridge (Vite Port 5190)
export default defineConfig({
  plugins: [react()],
  base: './', // Vital for custom protocols (mnemo-plugin://)
  server: {
    host: '127.0.0.1', // Forces IPv4 loopback binding for Electron compatibility
    port: 5190,        // Unique static port (range 5180+)
    strictPort: true,  // Fails fast if port is already in use
    cors: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  }
});
