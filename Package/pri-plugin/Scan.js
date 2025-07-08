import path from 'path';
import scanComponent from './scanComponent.js';
import fg from 'fast-glob';
import fs from "fs"
import crypto from 'crypto';
import beautify from 'js-beautify';

function hash(content) {
  return crypto.createHash('sha256').update(content || '').digest('hex');
}

function normalizeScript(script) {
  const pretty = beautify.js(script || '', {
    indent_size: 2,
    preserve_newlines: true,
    space_in_empty_paren: false,
  });
  return pretty.trim();
}

export function Scan() {
  let serveInitalScript = true;
  const cacheMap = new Map();
  const projectRoot = path.resolve();
  const srcDir = path.resolve('src');

  function scanAndCache(absFilePath) {
    const data = scanComponent(absFilePath);
    const scriptHash = hash(normalizeScript(data.script));
    cacheMap.set(absFilePath, {
      data, scriptHash, hasChanged: true
    });
    return data;
  }

  return {
    name: 'vite-scan-pri-plugin',

    configureServer(server) {
      const priGlob = path.resolve(process.cwd(), 'src/**/*.pri');
      server.watcher.add(priGlob);
    },
    resolveId(source, importer) {
      if (!source.endsWith('.pri')) return null;
      if (source.startsWith("./")) {
        const dir = path.resolve(srcDir, path.dirname(importer));
        const filePath = path.resolve(dir, source);
        return filePath;
      }
      return path.resolve(srcDir, source)

    },

    load(id) {
      if (!id.endsWith('pri')) return null;
      const absFile = id

      console.log('Resolved .pri file:', absFile);

      let cached = cacheMap.get(absFile);
      if (!cached) {
        try {
          console.log("Cache not found")
          const data = scanAndCache(absFile);
          cached = cacheMap.get(absFile);
        } catch (err) {
          console.error(`[plugin] Failed to scan ${absFile}:`, err);
          return null;
        }
      }

      const {
        data
      } = cached;
      return data.script;
    },

    handleHotUpdate(ctx) {
      const {
        server,
        file
      } = ctx;
      if (file.endsWith(".pri")) server.restart()
    }

  };
}