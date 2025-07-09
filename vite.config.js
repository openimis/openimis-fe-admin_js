import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react()
  ],
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
        '@material-ui/core',
        '@material-ui/icons',
        '@material-ui/lab',
        '@material-ui/pickers',
        '@material-ui/styles',
        '@date-io/core',
        '@date-io/moment',
        'zxcvbn',
        'lodash/debounce',
        /^@material-ui\/icons\/.*/,
        /^@material-ui\/core\/.*/,
        /^@material-ui\/lab\/.*/,
        /^@babel-.*/,
        /^@openimis.*/
      ],
      output: {
        globals: {
          react: 'React',
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
})
