import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      name: 'CosmicOrrery',
      fileName: 'cosmic-orrery'
    },
    rollupOptions: {
      external: ['three', 'tone'],
      output: {
        globals: {
          three: 'THREE',
          tone: 'Tone'
        }
      }
    }
  },
  server: {
    open: true,
    port: 3333 // Sacred geometry port
  }
});