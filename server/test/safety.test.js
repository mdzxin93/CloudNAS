import test from 'node:test';
import assert from 'node:assert/strict';
import {cleanName,validCode,codeHash,createCode,safeStorageKey} from '../src/safety.js';
test('filenames cannot contain path separators or control bytes',()=>{assert.equal(cleanName('../../secret.txt'),'.._.._secret.txt');assert.equal(cleanName('a\\b'),'a_b');assert.equal(cleanName('a\0b'),'a_b');assert.ok(cleanName('x'.repeat(1000)).length<=180)});
test('retrieval codes have six digits',()=>{for(let i=0;i<100;i++)assert.ok(validCode(createCode()));assert.equal(validCode('12345'),false);assert.equal(validCode('1234567'),false);assert.equal(validCode('aaaaaa'),false)});
test('hash is deterministic and distinct',()=>{assert.equal(codeHash('123456'),codeHash('123456'));assert.notEqual(codeHash('123456'),codeHash('123457'))});
test('storage key is a 24 byte lowercase hex ID',()=>{assert.ok(safeStorageKey('a'.repeat(48)));assert.equal(safeStorageKey('../'.repeat(16)),false)})
