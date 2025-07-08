import {
  defineConfig
} from 'vite';
import path from 'path';
import Scan from "./Package/plugin";

export default defineConfig( {
  resolve:{
    alias:{
      "priy":path.resolve(__dirname,"Package")
    }
  },
  plugins: [Scan()]
})
