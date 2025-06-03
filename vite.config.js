import {resolve} from "node:path";

export default {
  base: '/todo-list/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/js'),
      '#': resolve(__dirname, 'src/styles/components'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
}