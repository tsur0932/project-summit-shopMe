
import { NODE_ENV } from './config.js';


const levelOrder = { error: 0, warn: 1, info: 2, http: 3, debug: 4 };
const currentLevel = (() => {
  const env = (process.env.LOG_LEVEL || (NODE_ENV === 'development' ? 'debug' : 'info')).toLowerCase();
  return levelOrder[env] != null ? env : 'info';
})();


function write(level, msg, meta) {
  if (levelOrder[level] > levelOrder[currentLevel]) return;
  const payload = {
    level,
    message: typeof msg === 'string' ? msg : JSON.stringify(msg),
    timestamp: new Date().toISOString(),
    ...meta,
  };

  process.stdout.write(`${JSON.stringify(payload)}\n`);
}


export const logger = {
  info: (msg, meta = {}) => write('info', msg, meta),
  warn: (msg, meta = {}) => write('warn', msg, meta),
  error: (msg, meta = {}) => write('error', msg, meta),
  http: (msg, meta = {}) => write('http', msg, meta),
  debug: (msg, meta = {}) => write('debug', msg, meta),
  stream: {
    write: (message) => write('http', message.trim()),
  },
};






