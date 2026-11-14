import crypto from 'node:crypto';
export const cleanName=value=>String(value||'untitled').replace(/[\\/\x00-\x1f]/g,'_').slice(0,180);
export const validCode=value=>/^\d{6}$/.test(value);
export const codeHash=value=>crypto.createHash('sha256').update(value).digest('hex');
export const createCode=()=>String(crypto.randomInt(0,1000000)).padStart(6,'0');
export const safeStorageKey=value=>/^[a-f0-9]{48}$/.test(value);
