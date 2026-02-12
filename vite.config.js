import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic',
    jsxImportSource: '@emotion/react',
  })],
  optimizeDeps: {
    include: ['@emotion/react', '@emotion/cache'], 
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.jsx'),
      name: 'OpenIMISFeAdmin',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`
    },
    sourcemap: true,
    outDir: 'dist',
    rollupOptions: {
      external: [
        'react',
        'react/jsx-runtime',
        'react-dom',
        'redux',
        'redux-api-middleware',
        'react-redux',
        'react-intl',
        'prop-types',
        'moment',
        'classnames',
        'clsx',
        'react-router',
        'react-router-dom',
        'history',
        /^@mui\/material/,
        /^@mui\/icons-material/,
        /^@mui\/x-date-pickers/,
        /^@mui\/system/,

        '@date-io/core',
        '@date-io/moment',
        'zxcvbn',
        'lodash/debounce',

        /^@babel-.*/,
        /^@openimis.*/,
        /^@emotion\/react/,    
        /^@emotion\/styled/,
        /^@emotion\/cache/,
        /^@mui\/styled-engine/,
      ],
      output: {
        globals: {
          react: 'React',
          'react/jsx-runtime': 'jsxRuntime',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
