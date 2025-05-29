import {resolve} from "node:path";

export default {
  root: 'src',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/js')
    },
  },
}