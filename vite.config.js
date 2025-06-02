import {resolve} from "node:path";

export default {
  base: '/todo-list/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/js')
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
}