import {
  defineConfig
} from 'vite';
import path from 'path';
import Scan from "./priy/plugin";

export default defineConfig( {
  resolve:{
    alias:{
      "priy":path.resolve(__dirname,"priy")
    }
  },
  plugins: [Scan()]
})
